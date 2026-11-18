---
title: "We beat an OEV auction on HyperEVM. The operator was bidding in it"
description: "A ~$23K liquidation where the auction got nothing, and the bot that kept outbidding us turned out to be the auction operator's own."
date: 2026-09-28
thread: https://x.com/0xZick/status/2104559511478608028
---

We beat an OEV auction on HyperEVM. A liquidation worth about $23K went through, and the auction got nothing for it.

Before that we kept losing the same auction to one bot. When we traced that bot on-chain, it led back to the auction operator, who was paying bids to itself.

This is the long version of an [X thread](https://x.com/0xZick/status/2104559511478608028), with every transaction linked at the end.

![Cash flow diagram: the Atlas auction pays 90% of all bids (9,566 HYPE) to the auction operator 0x78C5...a474, which deployed three solver contracts and funded solver wallets and a bundler funder; operator solvers won 206 Morpho liquidations, paid 912 HYPE in bids and kept 824 HYPE.](/articles/oev-auction-hyperevm/1.jpg)

## How the auction worked

OEV is oracle extractable value. When an oracle price update makes a loan liquidatable, whoever liquidates right after the update takes the bonus. An OEV auction sells that right and sends the money to the lending protocol instead of leaving it to a gas race.

In 2025, HyperLend and Morpho liquidations on HyperEVM went through RedStone Atom running on FastLane Atlas. Solvers send sealed bids. The winner liquidates in the same transaction as the price update, and the bid goes to the protocol.

## Getting in

There were no docs for Atlas on HyperEVM.

The TypeScript SDK crashed: it supports Atlas up to v1.6, and the deployed contract is v1.6.2. We were told the TS SDK is meant for frontends and solvers should use Go. The Go SDK didn't know HyperEVM's chainId until we pinned one of its internal dependencies.

![GitHub page of FastLane-Labs/atlas-sdk, src/config/chain.ts, where the supported Atlas versions end at 1.6.](/articles/oev-auction-hyperevm/2.jpg)

## The bot that always outbid us

We played fair at first. One bot kept outbidding us. Its bids often went above 50% of the profit, and the top one was 90.8%.

For an outside solver, a 90% bid leaves close to nothing after gas. A bid like that only makes sense if the money comes back to you.

So we checked on-chain. That bot's solver contract was deployed by 0x78C5…a474, the same address that deployed the auction control contract. The same address also funded the bot's wallet directly.

![Block explorer page of the transaction where 0x78C5...a474 created the solver contract 0xC31f...a90fa61 on August 29, 2025.](/articles/oev-auction-hyperevm/3.jpg)
![Block explorer page of a transaction where 0x78C5...a474 sent 0.1 HYPE to the solver wallet 0xB7a9...E651 on August 25, 2025.](/articles/oev-auction-hyperevm/4.jpg)

From August 2025 to January 2026:

- operator-linked solvers won 218 liquidations, 206 of them on Morpho
- they paid 912 HYPE in bids and kept 824 HYPE for themselves
- 90% of all auction bids (9,566 HYPE) went to 0x78C5
- the bundlers were funded from wallets linked to it

![Two bar charts of Atlas OEV auction wins on HyperEVM, August 2025 to January 2026: 507 Morpho liquidations, 81 HyperLend liquidations, 200 with no liquidation; won by operator-linked solvers 218 (912 HYPE in bids), an independent team 338 (8,932 HYPE), others 232.](/articles/oev-auction-hyperevm/5.jpg)

## Losing on purpose

Then something happened by accident. One of our solver operations reverted inside the auction, and the price update still landed.

The control contract allowed the update even if every solver failed. You didn't need to win. You could bid highest, revert, and liquidate in the next transaction, right behind the update.

There was one catch. Before accepting a bid, the operator simulates the solver operation to check the bid can be paid. The simulation called our contract from address 0x0. When the caller was 0x0, the contract pulled HYPE from another wallet at runtime, so the bid looked payable and the simulation passed. In the real run there was no top-up, and the operation reverted.

## The block

Block 21413794, December 9, 2025 (UTC).

- **tx 0**: the auction metacall. The HYPE price updates to $27.659, and our 972 HYPE bid reverts.
- **tx 1**: our plain transaction, with a gas price 1 wei below the bundle. A Morpho flash loan, the HyperLend liquidation, a swap on a v3 pool.

Profit: 844.81 HYPE, about $23.4K at the update price. The auction got 0.

![Block explorer list of transactions in block 21413794: the auction metacall at the bottom, our liquidation transaction above it, and failed attempts from other bots.](/articles/oev-auction-hyperevm/6.jpg)
![Event logs of the metacall transaction: a ValueUpdate event with the new price, followed by a SolverTxResult event for our solver.](/articles/oev-auction-hyperevm/7.jpg)
![Block explorer page of our liquidation transaction, status success, block 21413794, with a transfer of 844.81 HYPE.](/articles/oev-auction-hyperevm/8.jpg)

## We weren't the only ones

The auction's price update also moved HyperLend prices. The winner only liquidated what it bid for, usually a Morpho position. Other HyperLend positions made liquidatable by the same update went to whoever came next in the block, with no bid paid.

One independent team (0xA888…068b) did 82 HyperLend liquidations this way. In most of them its bot pushed its own price through HyperLend's second oracle, Chainlink Data Streams, inside the liquidation tx, and never touched the auction. A group of five wallets did 485 liquidations on HyperLend and Morpho and earned about 3,135 HYPE. We found no link between either team and the operator.

The auction captured only part of the OEV. The rest leaked around it. The [follow-up](/articles/hyperevm-liquidations-numbers) goes through all our liquidations on HyperEVM and what each approach earned.

## What's left of it

The mechanism has since been rewritten, so this no longer works. What carries over to other auctions:

- If someone bids most of the profit, check where the bid goes.
- Test what happens when the winner fails on purpose.
- Simulation isn't execution. A contract can tell the two apart.
- Check whether the operator bids in its own auction.

## Receipts

Our side:

- [Price update, auction metacall, our bid reverts](https://hyperevmscan.io/tx/0xe43b03a54cff13d35a3e556762e1969a0a5ac044bd24ed10c2ec6cbc49fabed8)
- [Our liquidation, 844.81 HYPE](https://hyperevmscan.io/tx/0xb9e646b4a63daf8937dee73a6a15642102beb4bc639c381c6731a5051e2530f0)
- [Block 21413794](https://hyperevmscan.io/block/21413794)

The operator's side:

- [0x78C5 deploys the solver](https://hyperevmscan.io/tx/0x891716f20e6b41d845cf6a10a07be90ec1ea6bb57975e8ce322432c83a0a6f99)
- [0x78C5 funds the bot's wallet](https://hyperevmscan.io/tx/0x53f5372c25c4a28d295ba84941586020cb51b36637174e9ddca34ef465afc284)
- [A 90% bid](https://hyperevmscan.io/tx/0x197ad56fc88f081c12120ab35c22f0f8d4282279b6862a0d64d0968f3a69d31c)
- Operator solver wins: [1](https://hyperevmscan.io/tx/0xdec11717d891a6f1204e60158b8913f8bc23f436999d7f72f53ba46ec65b4542), [2](https://hyperevmscan.io/tx/0xc15e53e87cc11d87cc0902599e531e163470e0cd9396599b1e1b422f50c569ce), [3](https://hyperevmscan.io/tx/0xc40f369d2477b332f9c6125cbae4ac6898d33abe034726018e562c6d06e5fb68)
