---
title: Twelve days with $200. The diary, losses included
date: 2026-09-21
summary: Day by day — from the first scanner to the first week of real money. What broke, which rules were born from losses, which directions were closed with numbers. Balance at the end of week two — $200 → $138.
lang: en
draft: false
---

The terms of the experiment: $200, one laptop, automated trading. The question — can it go from zero to $100K in a year. I show the whole path, minuses included; numbers are not rounded in my favor. This is a digest of the first twelve days from the daily log. [The anatomy of the market](/writing/2026-09-20-anatomy-of-a-meme-market/) is a separate piece; this one is about what happens when that anatomy meets money.

## The ledger

| Period | Trades | Result | Balance |
|---|---:|---:|---:|
| Days 1–4 (10–13.09) | 0 — data collection, dry runs | — | $200 |
| Day 5 (14.09), first money | 5 | −0.0103 ETH | |
| Week 1 (14–15.09) | | −0.031 ETH ≈ −$70 | ~$130 |
| Week 2 (15–21.09) | 62, 17 winners | −0.0156 ETH | |
| **Total as of 21.09** | | **−0.026 ETH ≈ −$62** | **$138** |

Position size — 0.003 ETH, about $7. The task of the first month is not to earn but to measure how far life diverges from simulation. It diverges a lot.

## Days 1–4. A scanner instead of a bot

**Day 1.** The first thing I built was a scanner. 8,500 pools in a day. The early conclusions from 100 pools — "v3 is ten times better", "the top 3 pools = 90% of volume" — turned out to be garbage a day later.

**Day 2.** Backfilled 20 hours of history: 12,749 pools, 1.4M swaps. A crude filter, "≥ 10 swaps in the first minute", picks pools of which 83% survive to some trading. The scanner moved into tmux with `caffeinate`, because a night without data costs more than an hour of setup. The main fact about this market: 70% of swaps happen in the first five minutes of a pool's life. The decision window is seconds.

**Day 3.** The second pass over the data flipped the picture: 35% of pools are traps with a 50–99% fee, another huge chunk are factories. And a bug in my own data: for v4 the swap direction was inverted. Recomputed 1.8M rows; half of the early numbers had been noise. The strongest feature is not volume but who created the pool. Assembled the trading loop: quotes, simulation, limits, positions in the database. Started it without money.

**Day 4.** Overnight dry run: 20 positions, +12…27% on paper. Three of them were rugs: liquidity pulled 13 seconds to 3 minutes after entry, and the simulation didn't see it. Added liquidity tracking via events. In parallel, found that the scanner was silently losing swaps: the subscription died and the library quietly fell back to truncated polling. Three gaps in the data in one week. Folded every analysis into one document, 15 sections; from that day every decision has to cite a number from it.

## Day 5. First money: −0.0103 ETH over five trades

0.11 ETH on a separate wallet, the key only in a password manager, nowhere in the code. Five trades — and an immediate answer to "what does the simulation not see":

- Two rugs **1.8 seconds** after the buy.
- Three stops at −47%: a factory with an identical liquidity amount in all of its pools dumped on a timer. The dry run "sold" at other people's prices from the tape and never saw it.
- A bug: after the buy, the database write failed and the tokens were left untracked. Now the position is written **before** the transaction is sent.

Every loss of the day became a rule. I also scouted the local Morpho deployment: 168 liquidations in its whole history, 92% on one token, one liquidator took 56% of the bonuses. No daily flow. Noted it and put it aside — wrongly, as it turned out, but more on that below.

## Day 6. My own router and the first positive day

Wrote a router contract for Uniswap v4: straight into the PoolManager, no approve per token, automatic ETH wrapping. 15 fork tests. Against factories — three fingerprints: the amount of the first liquidity add, the token bytecode hash, the launcher contract; the blacklist is recomputed hourly. Before every buy — a full sell simulation with a balance override: honeypots are cut before entry.

Result: COHOOD +0.0018 (take-profit +61%), LEVY −0.0005, one buy failed on slippage. The first positive day — on a single trade.

In the evening — an arbitrage monitor between the launchpad and secondary pools. The idea seemed obvious. 32,000 samples over 20 pairs in five hours: not one positive round trip, the best was −4.9%, in 74% of samples the secondary pool didn't quote at all. The reason is structural: secondary pools are created by the token authors themselves with a 5–20% fee. Direction closed in one evening.

## Day 7. The worst day

In the morning it turned out the scanner had not seen new pools for three hours. The subscription had died and the watchdog considered it alive, because old swaps kept flowing. The bot stood all night with no candidates.

During the day — an independent code review of the bot: 11 findings, 7 critical. Positions lost on a receipt timeout, revenue double-counted on two sells, take-profit that switched itself off after one failure. Fixed in a day. Other people's eyes are cheaper than your own money.

In the evening — a factory built for people like me. A new wallet and a new launcher for every pool (bypasses two fingerprints out of three), 35–42 "buyers" through one router in 30 seconds, liquidity pulled at second 34 — one second after my entry at second 30. Six positions in 22 minutes, −0.018 ETH. Statistics on the new template took half an hour to accumulate; the bot entered six times in that window.

The answer was not one more filter but a rule for the whole risk class: **only enter where liquidity cannot be pulled** — the LP token is burned, sits in a locker, or belongs to a launcher with hundreds of pools and no rugs. On 72 hours of history such pools: 0% rugs, +0.38 mETH per trade. The rest: 3% rugs and −0.10. The price of the rule — candidate flow drops from ~50 a day to ~6.

The same day I also assembled a research loop: a hypothesis registry with statuses and an acceptance criterion, a daily digest, four sub-agent roles — analyst, developer, reviewer, backtester — sharing memory only through files. The first hypothesis through it, the "second wave" (enter a pool 15–90 minutes in, on renewed buying), was rejected by backtest within an hour: −0.23 mETH per trade on the fitting days, −0.32 on the validation days, the whole 324-point grid negative. Cheaper than money.

## Days 8–9. Rules in production

**Day 8.** The "non-removable liquidity only" rule rejected 9 pools overnight, three of which were later rugged. DIVIDENDS +0.0016, ECHO −0.0008. Removed the 90-second time stop: on my own trades it had cost 0.0027 ETH — two take-profits never got the chance, it saved me once. A rule against one factory had become a tax on every pool.

A watcher over 1,180 Morpho borrowers: the health factor of every position every 10 seconds. The picture: $140M in stablecoin loops at hf 1.0025–1.02 — a quarter of a percent from liquidation. No daily income, an enormous tail.

Scouted the oracle lag of tokenized-stock pools against Hyperliquid perps: 15 minutes in a quiet session, lag ≤ 7 bp, no windows. Deferred until a measurement at market open. A negative result in an hour beats a week of hope.

**Day 9.** Experiment: instead of skipping pools with removable liquidity, take them at a third of the size under a "two rugs in a row — pause for an hour" stop. 17 trades, +0.0026 ETH, best — MELEE +0.0017. The first trade at reduced size, PCMN, was a take-profit, but the tape showed 106 of 107 buys had been made by the creator himself. Luck, not earnings. Logged as a separate feature.

The day's tally under the new rules: 20 trades, +0.09 mETH per trade — exactly the threshold I had set for myself (+0.10 over ≥ 30 trades). Balance: −0.030 ETH since the start.

## Day 10. The best night, and a backtest that lost

Six trades, +0.0066 ETH (+$16). FLYPROTOCOL and FREEDOM closed at +50% six seconds after entry, LOX peaked at +208%, took +50%. Two stops within 9–11 seconds. The character of the strategy — a coin that pays 2:1.

Tested the idea "don't enter if a notable amount has already been sold before me". On six days of history (188 pools) the EV doubles. Switched it on for the night: the filter cut 18 pools, **11 of which would have reached +50%** (VLAD +1800%, APG +353%). On 20 live trades the same rule would have cut 4 of the 6 wins. Switched it off. A backtest on 188 pools lost to eight hours of live market — because the early seller in live trades turned out to be not a rugger but another sniper's router taking profit.

26 trades under the new rules, +0.33 mETH per trade. But 60% of the plus came from a single night. Too early to call it a conclusion.

## Days 11–12. The market cools, and the main discovery isn't in sniping

**Day 11.** Four trades, four stops, −0.0016 ETH. All the same shape: 16–28 buyers through 1–2 routers, dump seconds after entry. The first day without a plus since 16.09. The 30-trade test is closed: 37 trades, +0.15 mETH per trade — above the threshold, but the week is negative.

Separately, checked three "obvious" scaling ideas, to close them with numbers rather than opinion:

- *"A machine: $100 per position, thousands of trades a day."* ETH pools with swaps — ~1,270 a day, not thousands; after the live filters, ~12 candidates. Opening the funnel = bringing back day seven's factory, now at $100: six rugs ≈ −$600 in 22 minutes. Frequency is limited by decent pools, not by the cap.
- *"DEX-DEX arbitrage, a little from every pair."* Over 48 hours, tokens with two live ETH pools at a normal fee — 9, eight of them dust. The single live pair is already served by eight routers, 188 arbitrage legs, p50 size 0.04 ETH. The ETH→USDG→ETH round trip on the official pools is negative at any size: −2.3 bp at $100, −9.3 bp at $5k.
- *"Tokenized stocks against perps."* Lag ≤ 7 bp in a quiet session; never measured the open — it was Sunday.

Overnight — a second liquidation cluster on Morpho: 26 in an hour and a half, $74k repaid, ≈ $9.4k in bonuses. My watcher had seen all 26 borrowers in advance and again caught none.

**Day 12.** The sniper made no trades: 900 rejections in a day, not one candidate passed every filter. The RH meme-pool market cooled noticeably toward the end of the week. Dissecting the liquidation winner's blocks revealed a pattern I recognized — it was sitting in my old repositories, written for a different chain. Liquidations moved into a separate project; the sniper stays as is at 0.003 ETH. [Liquidations are their own story.](/writing/2026-09-21-queue-not-speed/)

## Closed with numbers

| Direction | Measurement | Result |
|---|---|---|
| Launchpad ↔ secondary arbitrage | 32,616 round trips, 20 pairs, 5 hours | 0 positive, best −4.9% |
| "Second wave" (entry at 15–90 min) | Backtest, 324-point grid | All negative, −0.3 mETH/trade |
| Tokenized-stock oracle lag | 15 min of a quiet session | ≤ 7 bp, no windows |
| Early-sell filter | 8 hours live | Cut 11 future +50% out of 18 |
| DEX-DEX / CEX-DEX arbitrage | 48 hours, all pairs | One live pair, already taken |
| 90-second time stop | 6 trades | −0.0027 ETH, removed |

Four "no"s in a week is also a week's result.

## What is left of the strategy

39 live trades since 16.09: 13 take-profits, 16 stops, 10 timeouts, +0.112 mETH per trade. The +0.10 criterion over ≥ 30 trades formally holds, but the last day was 5 stops out of 6, and the candidate flow has fallen to nearly zero. Pools with locked liquidity: 19 trades, +0.161 mETH. Removable liquidity (at reduced size): 20 trades, +0.065.

The honest conclusion at the end of week two: sniping on this market is a small positive edge with a fat tail, which lives as long as the flow of new pools lives and dies with it. One caught liquidation cluster is worth a month of this work. So week three is about liquidations.

Contract addresses, keys and exact filter thresholds do not go here.
