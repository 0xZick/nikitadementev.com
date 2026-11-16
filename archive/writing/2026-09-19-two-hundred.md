---
title: $200, one laptop, a new L2
date: 2026-09-19
summary: Public experiment — can automatic trading compound $200 toward $100k in a year. First nine days, with the losses left in.
lang: en
draft: false
---

The experiment: $200, one laptop and MEV bots. The question — can automated trading go from zero to $100K in a year. I am showing the whole path with numbers, including the minuses.

The field: Robinhood Chain — a new L2, 0.1 s blocks, no public mempool, Uniswap v4. Few bots, thousands of meme pools a day. The first 3 days were not trading but data collection: my own scanner writes every pool, swap and liquidity move. 12,700 pools, 1.4M swaps.

The data: 35% of pools are traps with a 50–99% fee. Another ~40% are factories: create a pool, pump the volume, pull liquidity a minute later. Real projects are a few percent. Without that statistic, sniping here is a donation to the factories.

First week of real money: −0.031 ETH (≈ −$70). Rugs 1.8 s after the buy. A factory that pulled liquidity one second after my entry — six positions in 22 minutes. Every loss produced a rule; the main one — only enter where the LP is burned or locked.

Closed three directions with numbers rather than hope: launchpad ↔ secondary arbitrage (32,000 samples, not one positive), the "second wave" (backtest −0.3 mETH per trade), tokenized stocks (oracle lag ≤ 7 bp). A "no" is also a result.

Day 10: 26 trades under the new rules. Best night +0.0066 ETH over 6 trades. Balance: $200 → $145.

The long versions: [the anatomy of the market](/writing/2026-09-20-anatomy-of-a-meme-market/), [the twelve-day diary](/writing/2026-09-21-twelve-days/), [why liquidations are a queue, not a race](/writing/2026-09-21-queue-not-speed/).

Contract addresses, keys and exact filter thresholds do not go here.
