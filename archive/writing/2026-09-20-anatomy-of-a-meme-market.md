---
title: 45,000 pools in four days. Anatomy of a meme market on a new L2
date: 2026-09-20
summary: What the scanner showed once I recorded every pool, swap and liquidity move on Robinhood Chain — before putting in the first dollar. Five different worlds instead of one market, traps, factories, and the single feature that predicts anything.
lang: en
draft: false
---

This is a data write-up, not a money story. The money story runs separately; this is what it stands on. Everything below was collected 10–13 September 2026 on Robinhood Chain: a new L2, 0.1 s blocks, no public mempool, Uniswap v4 as the main DEX, thousands of meme pools a day and almost no bots. A young market is the only place where $200 makes any sense, and the only one where nobody has collected the statistics yet.

## Scanner first, bot second

The first thing I wrote was not a trading bot but a scanner. Every `Initialize`, every `Swap`, every liquidity move goes into SQLite with block precision. A pool that survives to three hours gets labeled: how many swaps, what volume, whether liquidity was pulled, who created it.

| Dataset as of 13.09, 22:10 UTC | |
|---|---:|
| Pools | 44,807 |
| Swaps | 4,833,953 |
| Liquidity events (since 13.09 03:00) | 142,463 |
| Labeled (survived to 3 h) | 36,839 |
| Unique creators | 7,684 |

Why not trade right away: the first "conclusions" from 100 pools turned out to be garbage. "v3 is ten times better than v4", "the top 3 pools make 90% of volume", "a BEFORE_SWAP flag in the hook is certain death" — a day later the data overturned all of it. Conclusions are drawn on thousands of pools, not a hundred. And even on thousands — with caveats, below.

## Five worlds instead of one market

Averages over the whole base are meaningless, because a "meme pool on RH" is five different phenomena with different economics. Full three hours of observation, excluding the 10.09 data-gap window (n = 32,007):

| Segment | Pools | Dead | Meaningful | Rug within 10 min |
|---|---:|---:|---:|---:|
| v4, no hook, fee ≥ 50% — **traps** | 11,948 | 80% | **0%** | — |
| v4, no hook, normal fee | 10,040 | 30% | 24% | **25%** |
| Tokenized-stock hook | 6,095 | 60% | 33%* | — |
| Other hooks | 2,055 | 46% | 28% | 2% |
| v3 | 875 | 43% | 23% | — |
| **Launchpad** | 619 | 0% | **99%** | **0%** |
| v2 | 375 | 21% | 56%** | — |

"Meaningful" — ≥ 1 ETH of volume in three hours. "Dead" — no swaps after the first minutes. \* For stock pools "meaningful" is measured in units of the stock token, a different scale. \*\* 91% of v2 swaps come from one contract; of the 52 "meaningful" v2 pools, 36 have at most three senders. That is not a market, that is one script.

Meaningful is not profitable. Of pools with ≥ 10 swaps in the first minute, 79–90% become meaningful, but only 39–45% finish above +10% from the entry price at second 60. A crude activity filter selects pools where something happens; what exactly happens is a separate question.

## Traps: fees up to 100%

Uniswap v4 allows an LP fee of up to 100%. About a dozen bots with fixed signatures create a pool for every new token they see: 1,087 such pools appeared ~5.5 minutes after the launchpad pool of the same token, thousands more for tokens with no normal pool at all. Some tokens have 70–200 trap pools. Swaps in them are few, but the largest single loss in the base is 0.099 ETH at an 88% fee: you can buy, and you can sell only by giving almost everything back.

A separate kind of noise — the "ladder": one address created 533 pools for two tokens with fees of 100, 110, 120 … 5,000 basis points. Why, I don't know; possibly to clog routers.

The rule is simple: an abnormal fee without a dynamic hook — skip; the router only goes into the token's most liquid pool. Without this rule any statistic over the base is meaningless: 35–40% of all pools are traps.

## Factories: how a rug works

Since 13.09 the scanner records liquidity events, and the rug picture became concrete. Of 1,773 ordinary v4 pools with liquidity, **25% have ≥ 50% of it pulled within the first 10 minutes**. On the launchpad — 0%, on pools with other hooks — 2%.

Who pulls it: in 12 of 12 bot positions I checked — **the pool creator**, who is also the only liquidity provider. The pattern repeats word for word:

1. Fresh wallet.
2. Token → pool → liquidity.
3. 11 swaps through one router, 0.86 ETH in total — price ×1.37 in 30 seconds.
4. Liquidity pulled 30–230 seconds after launch.

The only buyer is himself. A new wallet every time, so a "new deployer" filter lets it through. Later the factories learned more — a new launcher and a new token template for every pool — but that belongs to the money story.

The feature available at second 30 (277 pools with ≥ 5 swaps):

| Rule | Pools left | Rug rate among them |
|---|---:|---:|
| No filter | 100% | 30% |
| ≥ 3 independent buyers | 34% | **4%** |
| ≥ 5 independent buyers | 25% | 1% |
| Depth ≥ 1 ETH and ≥ 3 buyers | 18% | 0% |

And a paradox that matters more than the table: in the dry run it was precisely the one-buyer pools that made the bot +26% (43 of 55 trades), while pools with three or more buyers made −30% (n = 10). The bot is de facto riding the rugger's own pump and in four cases out of five exits on take-profit before he pulls liquidity: TP on average 65–85 s after entry, the pull 55 s after. In one case out of five it doesn't make it. Those are the 20% write-offs.

## The launchpad: zero rugs, but a ten-minute game

The only hook with 99% meaningful pools is the local launchpad. Liquidity sits with the hook and the creator cannot pull it: of 119 pools with liquidity — zero withdrawals. The launchpad router carries 48% of all ETH swaps in the base; the hook itself sold the tokens it collected for +204 ETH in the first two days.

But that does not mean money can be made there. Price relative to entry at second 30 (ETH pools, n = 64):

| | 1 min | 5 min | 10 min | 20 min | 30 min | 60 min |
|---|---:|---:|---:|---:|---:|---:|
| p25 | 0.89 | 0.79 | 0.37 | 0.13 | 0.10 | 0.08 |
| median | 1.00 | 1.05 | 0.89 | 0.64 | 0.40 | 0.16 |
| p75 | 1.16 | 1.53 | 1.59 | 1.45 | 1.80 | 0.88 |
| p90 | 1.36 | 2.07 | 2.36 | 2.22 | 2.62 | 2.19 |

Peak: median 1.62× at minute eight, p90 9.1×. After three hours the median is 0.145×. Volume stops at a median of minute 65. The simulation says tight stops lose here (TP +30 / SL −30 / 5 minutes → −5.5%), and asymmetry works: half the position at +100%, trailing, out by minute 20 → +10…20% on paper. A dry run of 41 trades gave −1.9%: 24 stops at minute five with a peak of +25%. Bots churn these pools, and the quote for our size jumps harder than the prints in the tape. Verdict for now: a small, noisy edge, unconfirmed.

## The pool creator is the main feature

Of everything you can compute at second 30, the strongest predictor of the outcome is not volume, not swap count, not the hook — it is **who created the pool**. Three cohorts under identical entry rules:

| Creator | Pools | Meaningful | Mean outcome | Median |
|---|---:|---:|---:|---:|
| New deployer, first pool | 425 | 71% | **+21.2%** | **+9.4%** |
| Repeat deployer | 101 | 28% | −2.5% | −11.2% |
| Secondary pool of an existing token | 70 | 36% | −8.1% | −19.9% |

The blacklist of serial creators builds itself: a wallet with 24 tokens and 24 dead pools, a wallet with 23 pools of the same test token, a wallet with 103 pools and 9% meaningful. Launchpad pools are created by four relayers — the rule does not apply to them.

The feature's limit is the factories: they change wallets for every token and pass as "new". So the creator is a necessary condition, not a sufficient one.

## Hooks as platform identifiers

A hook address is effectively a platform identifier, and the spread between platforms is wider than between any activity filters. There are hooks with 66% meaningful pools and hooks with 0% — with identical flags. The `BEFORE_SWAP` flag by itself predicts nothing. The hook whitelist and blacklist are recomputed daily.

## The first block is not worth fighting for

The sniper's intuition — "you have to be first". On this market it doesn't hold.

- In ordinary pools the price one minute after the first trade is, at the median, 13% **above** the first trade. On the launchpad it is below the first — there the first buy is made by the launcher inside the creation transaction.
- In the first three swaps of ordinary pools, 163 bot wallets make 58% of trades, 42% of those within the first 5 seconds. But the size is dust: 265 pools at 0.0008 ETH, 84 pools at 0.0004 ETH. These are honeypot probes, not positions.
- The only participant with money and selectivity in the first seconds: 23 pools at 0.035 ETH, 61% meaningful.
- A pool's "meaningfulness" does not depend on who entered first.

No public mempool, priority fee is zero, block order is first come, first served. There is a race, but not for the first block: for the first *meaningful* minute.

## Time of day

By UTC hour: 02–05 — 25–30% meaningful at lower flow; 14–16 — 16–18% at twice the noise; 22–01 — 12–24%. The Saturday-to-Sunday night gave 10% meaningful and 43% dead against 26% / 24% on weekdays. The market regime changes by day; one day is not statistics, a week of data is mandatory. Meanwhile the pool flow kept growing: 355/hour on 10.09 → 755/hour on 13.09.

## What broke in the data

Half of the early numbers were noise not because of the market but because of my own defects. The honest list:

| Defect | Effect | Fix |
|---|---|---|
| Swap direction for v4 computed from the sign, as in v3 | Buys and sells swapped in every v4 pool | Dedicated direction function; 1.82M rows recomputed |
| The `Swap` WebSocket subscription silently degrades: the library falls back to polling with truncated `getLogs`, while `Initialize` keeps working | Two 3-hour collection gaps: 5–10% of swaps, thousands of pools look "dead" | Reconciliation via `getLogs` every 30 s; gaps backfilled |
| On shutdown the scanner labeled pools younger than 3 hours | 2,158 pools labeled on 69 minutes of data | Young pools are not labeled; adopted on restart |
| Creator field was not populated | The main feature was invisible | Resolved on insert + recomputed |
| The simulator "sold" at the last price of a pool that had gone silent | Trailing ROI overstated several times | Penalty for exiting a dead pool, a separate "pessimistic" column |
| The node cuts dense `getLogs` ("log query timed out") | Backfill took hours | Ranges ≤ 20k blocks |

Infrastructure breaks more quietly than strategies. A strategy that doesn't work shows up in PnL. A subscription that silently stopped receiving events shows up only as "the bot found no candidates overnight".

## What became the strategy

The only segment with an honest plus: the first pool of a new creator with real buys in the first 30 seconds — enter at second 30, take profit +50% on the whole position, stop −30%, exit on liquidity pull. Three dry runs in a row:

| Run | Trades | Winners | Rugs | ROI |
|---|---:|---:|---:|---:|
| 12.09, night | 20 | 60% | 3 | +4.6% |
| 13.09, day | 84 | 67% | 17 | +13.0% |
| 13.09, evening | 61 | 70% | 13 | +14.0% |
| **Total** | **177** | **67%** | **36 (20%)** | **+12.2%** |

The simulation says +19…26% — it doesn't see rugs. Replaying the same positions at swap prices with harsh slippage — 0…+7%. Honest estimate: **0…+12% per position, with a fat tail**. The structure of a day: 50 take-profits (+0.084 ETH, on average after 85 s), 17 write-offs (−0.051), 13 timeouts (+0.005), 4 stops (−0.005).

What the dry run could not see, and what the first week of real money added, is in [the diary](/writing/2026-09-21-twelve-days/). Spoiler: the gap between "the quote at the moment of decision" and "execution one second later" turned out to be bigger than the whole edge.

Contract addresses, keys and exact filter thresholds do not go here.
