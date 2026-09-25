---
title: Days 13–16. The sniper is closed, the hunter meets the oracle
date: 2026-09-25
summary: The sniper closed with its numbers — 90% of the loss was eight tokens that cannot be sold. The liquidation hunter moved next to the sequencer, learned the oracle's clock, fired about 250 times and has hit nothing yet. What every miss taught.
lang: en
draft: false
---

Same terms: $200, one laptop, automated trading, numbers not rounded in my favor. [Twelve days](/writing/2026-09-21-twelve-days/) ended with the decision to move from sniping meme pools to liquidations on the local Morpho deployment. These are the next four days, from the daily log. The mechanics of the leader's queue are in [Queue, not speed](/writing/2026-09-21-queue-not-speed/); this piece is about what happened when I joined that queue.

## The ledger

| Line | Numbers | Result |
|---|---|---:|
| Sniper, 8 days of trading, closed 22.09 | 63 closed trades −0.0028 ETH; 8 unsellable tokens −0.024 ETH | −0.0268 ETH |
| Hunter, 23.09 | 6 shots, 6 reverts | −0.000141 ETH |
| Hunter, 24.09 | 244 shots, 0 hits | −$15.66 in gas |
| Hunter, 25.09 so far | 1 shot, revert | 932,644 gas |
| Earned | | $0 |

The balance was $138 at the close of week two. Since then: the sniper's last −0.0008 ETH and about $16 of hunter gas. Nothing has been earned in the liquidation branch yet. Position sizes are unchanged; the hunter needs no capital of its own, only gas.

## Day 13. Closing the sniper, and why the hunter was blind

Closed the sniper and both scanners. The result of eight days of trading: −0.0268 ETH. The decomposition was unexpected: 63 closed trades gave −0.0028, and −0.024 is eight tokens that simply cannot be sold. 90% of the loss is not in the strategy but in honeypots.

And the filter against them did work. The hangs happened only on 14 and 16 September; after the "LP burned or in a locker" check was added, not one. Over 17–21 September the sniper was positive: 39 trades, 33% win rate, +0.0051 ETH. I am closing not a losing thing but a too-small one.

Arc folded too. 50 hours of scouting: 12,048 pools, $41M of volume, a live market. But 0.4% of pools pass the filter, and outside buyers arrive on average 11 blocks before me. To monetize that I would have to write a second sniper, for $14 a week.

All attention on liquidations. Found why the hunter was blind: it priced positions from the pair's spot, while the oracle is a TWAP that jumps in a step without a single transaction. In the night cluster the hunter showed a health factor of 1.0021 where on-chain it was 0.9890. A competitor took the cluster.

Rewrote it on an exact oracle model: the same TWAP, computed locally from events. Caught a window switch live: the price jumped −0.47% with no transactions, and the model reproduced it with a 0.0000% discrepancy. Now the jump is visible seconds before, not half a minute after.

And the day's embarrassment: the burst I had spent half a day building did not work at all. All ten transactions left with the same nonce; one of them would have made it into the chain. viem advances the counter inside its own send, and I sign and broadcast myself. Took the scheme from the old flooder.

## Day 14. Next to the sequencer

Moved the hunter to a server next to the RH sequencer. From Dubai a transaction arrived in 457 ms, from here in 22. All three winners of the past clusters had index 1 in their block, so this is not polish, it is the entry ticket.

First day of live fire: six shots, all six reverted, 0.000141 ETH of gas. Not a bug and not bad luck. The bot was hitting a position with a 4.9% cushion to liquidation, betting on an oracle jump, and no jump anywhere near that size came all shift.

Measured what jumps look like: 654 samples over 5.5 hours, median 0.54%, p90 1.22%, maximum 2.55%. But on the 22nd, during the dump, a step reached 9.46%. Betting on a big jump is not meaningless. It is just dead on every day except cluster day.

Which made the crude band redundant, because the exact path lives right next to it: take the post-jump price from the model, recompute the health factor on it, and fire only if it goes under one. Narrowed the band. The point is not gas, gas is pennies; the point is nonces and the place in the block.

Toward evening the market answered on its own: a $15.9k position slid from 1.038 to 1.006, 0.6% from liquidation. The bot switched into edge mode and fired every 10 seconds. And that surfaced a flaw: at that pace the daily gas budget is spent in 37 minutes, so the bot goes silent exactly when it needs to fire.

## Day 15. 244 shots, zero hits

A full day of live fire: 244 shots, 0 hits, $15.66 of gas, all 244 checked against receipts. Twice the jump forecast was right and we stood in the winner's block, in place #82. And one target the bot saw 16 times over 8 minutes while it slid under one by drift, and never fired: not a jump, a slow slope.

Why it is expensive: not because a miss costs 448k gas, but because 85% of the shots fly at the wrong moment. Between oracle jumps the price does not move at all, so a miss is guaranteed. Tied the spray to the switch second. Measured delivery: a TLS handshake on every shot, 25–85 ms. Warm sockets: 120–156 ms became 22–26.

The leader, block by block: silence until 130 s before the jump, ten cheap shots one second before, 23 shots across three blocks in the target second, and the first of them takes place #1. He is not faster; he takes the place in advance. Reproduced it: a time guard in the contract, so an early shot costs 35k gas instead of 444k, and a burst every block from every wallet.

Seven lost liquidations, dissected: in one we stood at #1 but fired a second early, full price for the miss; the rest left 5–20 s ahead of time; one target never passed the debt threshold. Gas: baseFee 0.0444 gwei, everyone's priority fee is zero, no correlation between price and place in the block. The second decides the place, not the price.

At night, an audit of the hunter: 13 findings, three serious (the jump moment when several observations are young, the price after the jump, the nonce after a node failure). Fixed and deployed at 23:28 UTC. Six minutes before that the old code fired twice on an upward jump. Both reverted; the first reverted on the guard at 37,913 gas, as designed.

## Day 16. The spray learns the direction

Dissected the two 23:22 shots: both on an upward jump of +0.65%, with nobody to liquidate. The first left before the switch second and reverted on the guard at 37,913 gas; the second, after it, went the full path at 624,049. Total 2.9e-5 ETH. The cause: the spray looked at the current health factor, not at where the oracle was about to jump.

Fixed: the spray now filters like the burst. It takes the post-jump price from the model, recomputes the health factor and fires only if it goes under one; after the switch, only if it is under one right now. A dry run on the 00:23:22 UTC jump (−1.63%): five targets rejected with forecasts of 1.012–1.030. Zero extra shots.

The old code on the server fired in that same second at four positions in one transaction: revert, 932,644 gas. A live confirmation of the diagnosis two minutes before the rollout. The new code has been on the server since 00:25 UTC. The next jump, at 00:53, is +0.22%: nobody to shoot at, and the bot now knows that in advance.

## What the misses taught

- **Price does not move between oracle jumps.** Everything is decided in the switch second; a shot at any other moment is a donation.
- **Direction matters as much as timing.** A jump up costs a full miss if you fire on the current health factor. Fire on the forecast one.
- **Place in the block is bought by being early and cheap**, not by paying more. Priority fees are zero for everyone; the leader is simply already there.
- **Budgets fail at the worst moment.** A daily gas cap tuned for quiet days goes silent in the cluster.
- **The oracle is a TWAP, not the spot.** A model that reproduces it to 0.0000% is the whole edge; without it the hunter was reading a different market.

## Next

The first downward jump with a target under one on the forecast. The code has been through a dry run on a real jump; what is missing is the first receipt with a hit. Contract addresses, keys and exact filter thresholds do not go here.
