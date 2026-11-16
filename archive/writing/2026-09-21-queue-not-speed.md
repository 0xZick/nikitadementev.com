---
title: Queue, not speed. How I watched $16k of liquidations and took none
date: 2026-09-21
summary: Two liquidation clusters on Morpho in one week; my watcher saw all 40 positions in advance — and got zero. Dissecting the winner's blocks showed he isn't faster. He just stands in line every block.
lang: en
draft: false
---

This is a story about how a correctly built watcher lost 40 out of 40, and why it was not about speed.

## Starting point: "there is no flow"

On day five of the experiment I scouted the Morpho deployment on Robinhood Chain. In its whole history — 168 liquidations, 137 of them on one token, one liquidator took 56% of the bonuses. No daily flow. I noted: what remains is the tail risk of a depeg in the stablecoin loops. Put it aside.

On day eight I raised a watcher anyway: 1,180 borrowers, the health factor of every position every 10 seconds. The picture was more interesting than the summary: **$140M in stablecoin loops at hf 1.0025–1.02** — a quarter of a percent from liquidation. Plus a market with wsNET as collateral, where the LIF goes up to 12.7%. The Morpho formula is public: `min(1.15, 1 / (1 − 0.3·(1 − LLTV)))`, no close factor — the whole debt can be repaid at once. No income on any given day, an enormous tail. And so it stayed: the watcher writes, I look at the sniper.

## Cluster one: 14 liquidations in 90 minutes

19 September, 03:00–04:30 UTC. The wsNET oracle crossed the threshold, and in an hour and a half **14 liquidations went through: $50.3k repaid, ≈ $6.4k in bonuses**. Roughly six bots. One of them took **six liquidations in a single block** — the very block in which the oracle updated.

My 10-second poller: 0 of 14. It had seen all 14 positions in advance — for hours, at hf 1.01–1.02. It did not see the moment.

The first explanation was simple: 0.1-second blocks, polling every 10 seconds, a factor of a hundred. Need to be faster. An event loop on the oracle logs instead of polling, pre-signed transactions, a WebSocket feed instead of RPC. Wrote it into the plan.

## Cluster two: 26 in an hour and a half

The night of 20 September. A second cluster: **26 liquidations, $74k repaid, ≈ $9.4k in bonuses**. The watcher had again seen all 26 borrowers in advance. And again zero.

This time I did not rewrite the poller; I dissected the winner's blocks. Transaction by transaction, block by block, before and after the oracle update.

## What the winner does

He does not "see" the liquidation. He **predicts** it from a swap in the collateral pool — and from that moment sends a liquidation transaction **every block**. Six transactions per block. All of them revert: the oracle hasn't crossed yet, `Morpho.liquidate` rejects a healthy position. An attempt costs about $0.01. In the block where the oracle finally updates, his transaction is first — because it was first in the previous hundred blocks too.

Robinhood Chain has no public mempool, `maxPriorityFeePerGas` is zero, block order is first come, first served. Overtaking someone already standing in line is impossible by definition: by the time you have seen the oracle log, the block containing that log is already built, and the liquidation in it already belongs to someone else.

**This is not reaction speed. This is a queue.** The winner is not whoever saw the event fastest, but whoever paid for a place in every block until the event happened. A hundred blocks at $0.06 is enough to take a $1.3k bonus off one position.

The same conclusion the sniper had given me a week earlier in a different form: the first block is not worth fighting for if you are trying to *see* it. You can only *stand* in it.

## The flooder from an old repository

On the morning of day twelve I remembered where I had seen this pattern. A year ago, for a different chain, I had written a "flooder": code that sends the same transaction from N accounts every X milliseconds until it goes through. Exactly what the winner does. Don't rewrite it, port it.

A separate project was assembled for this — liquidations moved out of the sniper project entirely, trading and liquidations are now two different repositories:

- **The flooder** — the old code, adapted to the chain's FCFS feed.
- **The Morpho liquidator contracts** — also mine, with one essential detail: Morpho hands over the collateral in a callback *before* the debt is paid, so no flash loan is needed, no capital is needed. The collateral arrives, gets sold, the debt is repaid from the proceeds, the difference stays.
- **The watcher** — the one that already exists, but its job is no longer "catch the moment" but "tell the flooder which position to queue for, and from which block".

The last part is the key question of week three. Queuing for every position with hf < 1.02 means thousands of reverts a day; at $0.01 an attempt that is cheap but not free, and on a 26-position cluster the queue has to be held for all of them at once. The first step is to run the flooder against the **recorded** clusters: from which block would we have started sending, which block would we have landed in, how many would we have taken. Then shadow mode until the next dump.

## Why this matters more than the sniper

The sniper over two weeks — −0.026 ETH on 62 trades, and the candidate flow fell to zero by the end of the week. One liquidation cluster — $6–9k in bonuses in an hour and a half, and there were two such clusters in one week. Even a tenth of one cluster is a month of the sniper's work in its best week.

At the same time, liquidations are not a market you can walk into with $200 and no engineering. You need a contract that handles the callback correctly, a flooder that doesn't crash the node or lose nonces, and a watcher that knows whom to queue for. I turned out to have all three — two of them written earlier, for other tasks. That is precisely why this experiment is being run by me and not by someone with a bigger account.

## What to measure next

1. On the recorded clusters: the share of liquidations where `Liquidate` and the oracle update land in the same block. If ≥ 80% — queue only; if less — there is a window for an event loop as well.
2. Replay the flooder over those clusters: start block, position in block, positions taken.
3. Shadow until the next wsNET dump.

Numbers on Sunday. Contract addresses, keys and thresholds do not go here.
