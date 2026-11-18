---
title: "56 liquidations on HyperEVM: what we earned and where it came from"
description: "Five months of liquidations on HyperLend and Morpho: about 3,985 HYPE ($108K) net, and why playing the OEV auction fairly earned almost nothing."
date: 2026-11-18
---

The [first article](/articles/oev-auction-hyperevm) is about one block: the liquidation where the auction got 0. This one is about everything around it. Between September 2025 and January 2026 we liquidated on HyperLend and Morpho on HyperEVM. Here is what that earned, how, and why most of the money came from one approach.

All amounts are in HYPE, net of gas and auction bids. Dollar values use the HYPE daily close on the day of each liquidation. Liquidations of our own positions are left out.

## The totals

From September 10, 2025 to January 31, 2026:

- **56 liquidations**: 24 on HyperLend, 32 on Morpho
- **5,026 HYPE** gross profit
- **596 HYPE** paid in auction bids
- **445 HYPE** paid in gas on successful transactions
- **3,985 HYPE net, about $108.5K**

Failed transactions cost another 240 HYPE in gas. After that, about 3,745 HYPE was left.

## Four ways to liquidate

Every liquidation we made was one of four kinds. They paid very differently.

| How | Liquidations | Gross, HYPE | Paid out, HYPE | Net, HYPE | Net, USD |
|---|---|---|---|---|---|
| Winning the auction | 20 | 731 | 596 in bids | 135 | $4.5K |
| Plain gas race | 20 | 1,000 | 442 in gas | 557 | $15.9K |
| Our bypass: bid, revert, liquidate behind | 13 | 3,179 | 2.3 in gas | 3,177 | $85.1K |
| Auction did only the price update | 3 | 117 | 0.2 in gas | 117 | $3.1K |

**Winning the auction.** This is the way the auction was meant to be used. Solvers send sealed bids, the winner liquidates in the same transaction as the price update, and the bid goes to the protocol. We won 20 times. The bids took 81.5% of the gross profit, and 135 HYPE was left over five months. The reason was the bot we kept losing to. It belonged to the auction operator, and its bids came back to the operator. An outside solver bidding against it could only win by giving away nearly everything.

**Plain gas race.** Some liquidations had no auction in front of them and no price update at all. The bot reacted to an on-chain event that made a position liquidatable, and then it was about speed. On HyperEVM the order inside a block is decided by gas price, so whoever pays more goes first. These 20 liquidations made 1,000 HYPE, and 44% of it went to gas. One HyperLend liquidation on December 1 made 130.7 HYPE net after paying 124.5 HYPE for its place in the block.

**Our bypass.** The auction let the price update land even if the winning solver failed. The [first article](/articles/oev-auction-hyperevm) shows how we used that: bid highest, revert on purpose, and liquidate in the next transaction with gas 1 wei below the bundle. The bid was never paid. In each of these 13 liquidations, our own solver operation sits in the metacall right before our transaction. They cost 2.3 HYPE in gas in total and made 3,177 HYPE. That's 80% of everything we earned.

**The auction did only the price update.** Someone else won the auction, and its update moved more than the one position it sold. Other positions became liquidatable in the same block, and nobody had paid for them. We took three of those, for 117 HYPE. Other teams did much more of this, as the first article describes.

## Month by month

| Month | Liquidations | Net, HYPE | Net, USD |
|---|---|---|---|
| September 2025 | 5 | 0 | $0 |
| November 2025 | 27 | 335 | $10.6K |
| December 2025 | 22 | 3,631 | $97.3K |
| January 2026 | 2 | 20 | $0.6K |

September was five tiny HyperLend liquidations that earned nothing. November was the auction month: 18 of the 20 auction wins and almost all of the bids are there, and the net is small. December is when the bypass took off. We first used it once on November 22, and the other 12 bypass liquidations all happened in December, which brought 91% of the total. January had two plain liquidations.

## The largest ones

1. **December 9, HyperLend: 844.6 HYPE, about $23.6K.** This is the one from the first article. The auction's metacall updated the price, our bid reverted, and our liquidation went next with gas 1 wei below the bundle.
2. **December 16, Morpho: 770.5 HYPE, about $20.7K.** The same bypass, on Morpho.
3. **December 9, HyperLend: 617.1 HYPE, about $17.2K.** The same bypass, earlier the same day.

The top three made 2,232 HYPE, more than half of the total. All three used the bypass, paid under 0.2 HYPE in gas each, and paid nothing to the auction.

## What it cost to find out

The money was not spread evenly over time. Getting into the auction took real work first. There were no docs for Atlas on HyperEVM, the TypeScript SDK didn't support the deployed contract version, and the Go SDK needed a pinned internal dependency before it knew the chain. Then fair bidding paid 596 HYPE to the auction and returned 135. Everything after that came from noticing that a failed solver didn't stop the price update.

Without the December liquidations, five months would have earned about 355 HYPE before failed gas.

## What we'd tell someone starting now

- Check who you're bidding against before you bid. If one bidder always pays most of the profit, find out where its bids go. That takes an hour on-chain.
- Count what the auction doesn't sell. One price update can unlock many positions across several protocols, and the auction may sell only one of them.
- The honest route in an auction can be the worst one. Fair bidding earned 135 HYPE in 20 wins. A plain gas race earned four times more.
- Track failed gas from day one. It was 240 HYPE for us, about 6% of the net.
