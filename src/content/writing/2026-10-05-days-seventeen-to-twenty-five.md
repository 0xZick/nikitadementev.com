---
title: Days 17–25. Silent failures, and a queue I do not win yet
date: 2026-10-05
summary: Two bugs made the hunter silent for a day without any alarm, then the clock and the oracle forecast were fixed. The first win came on 2 October at $26.7, and the next two days showed that delivery, not the model, is what costs the places.
lang: en
draft: false
---

Same terms: $200, one laptop, automated trading, numbers not rounded in my favor. [The previous piece](/writing/2026-09-25-days-thirteen-to-sixteen/) ended on the first downward jump the hunter was waiting for. These are the next nine days, from the daily log. Days 21 and 22 (30 September, 1 October) have no entries in it, and I would rather leave the gap than reconstruct it.

## Day 17. Silence looks like a calm market

A quiet day: no commits, yet the hunter's log has 330 records and 19 sent transactions. It worked while I was not watching. A week of log sizes by day: 1059, 98, 11, 12, 330. A hundredfold between neighbouring days is not the market. It is the bot running or standing still, and I find out afterwards.

The conclusion cost two more days: I need an hourly tick counter in plain sight. Without it, silence in the log cannot be told from a calm market.

## Day 18. A big rework, and a quiet failure

Four rollouts of the hunter, the largest one 18 files, +1464/−365. I also switched off a second copy that had been running in parallel: with two of them, receipts do not show whose shot it was and every gas number is counted twice.

The last transaction went out at 12:11, and then nothing. The dashboard showed a living bot, logs were written, ticks ran. I noticed the next day. Rolling out a big rework and walking away is a bad idea even when everything is green.

## Day 19. 21 hours without a transaction

The shot slot was rounded up, so it always lay in the future, while the "time to fire?" check required it to be in the past. Two windows, 08:37 and 09:08, closed with zero shots. Fixed by splitting the wait for the next slot from the check that the slot has passed: one line for fix, 41 for making sure it never passes silently again.

The second bug of the day: after the first scheduled resubscribe, all eight subscriptions died. The old client was closed after the new one had taken the same cached socket, and the errors were swallowed by a "we are resubscribing" flag. The watchdog got blunter and more useful: five seconds without block headers means the socket is broken.

What those 21 hours taught: when the tick count is zero, look at delivery, not at the model. The prediction model was accurate the whole time. It just sent nothing to anyone.

## Day 20. Asking the chain instead of the model

The night of 28→29: 747 reverts with "Healthy", about 300k gas each. Targets stood within 0.06% of liquidation, while my local price model has an error up to 0.046% plus a drift of 0.05% over eleven minutes. In that fog a healthy position cannot be told from a liquidatable one.

So I stopped asking the model and started asking the chain: an `eth_call` with a substituted time returns the oracle price for a given second. Checked on a liquidation in block 75333327: a call from the previous block names the second of the event exactly. Now the hunter asks once a second about the worst positions. No crossing second in the next two minutes means no shot at all, which is exactly those 747. A known second means a miss costs 25–30k gas instead of 300k.

The clocks too. Slots were counted from public-node block headers, with error to the next block p50 10.6 ms; the sequencer feed gives 4.7. A run on the first places: with the small delay we took first place 8 times out of 40, with the larger one 19 out of 32. The clock decides the place, not the speed.

## Day 23. The first win, and why it does not count as skill

On 2 October I went through the misses of 29 September to 2 October. 22 liquidation transactions, almost all at index 1 of the first block of the second. One competitor took 17 of the 30 positions. He sends one transaction per event, each time from a new address.

We have one win: $26.7 at 13:43:41 UTC on 2 October. It was a mass event, and we landed at index 31 of 49. Speed did not win it; there was simply room for everyone in the block. Our transactions otherwise land 0.9–4.1 s after sending, and each next one in a series a second later.

A bug in the fan-out. At 02:41 the sequencer was silent for 5 s and a public node answered 500. The bot took it as every node rejecting, rolled the nonce back from 979 to 975, though the transactions had gone through, and got a cascade of "nonce too high". Fixed: a timeout or a proxy 500 is not a rejection.

In the evening I launched a latency probe, a fresh address against our wallet. It failed because of its settings: the gas limit of 21000 is below the network's minimum, and the nonce kept growing after each refusal. All 40 attempts were rejected, no gas spent.

## Days 24–25. Delivery

The sequencer answers in 3–5 s (median 3.2 s), while the live series fires every 100 ms. While we wait for an answer, the counter runs ahead of the chain; the log shows resets such as 1046→1036. Of 171 attempts since the fix, 164 were refusals: "nonce too high" 107, timeouts 57. In the window 2 October 20:27 to 4 October, competitors made 12 liquidations, we made none, and every one was at index 1.

Drift explains the tail of a series, not all of it. The first transaction of a series, with the right nonce, still lands in 2–10 s. And at 20:00 UTC on 3 October we sent 2.6 s before the winner and landed after him. Sending earlier does not mean sitting earlier.

The fix of 4 October: at most two unanswered shots per wallet, and after 15 s of silence the counter is checked against the chain. The fan-out shrank to three nodes; the four I removed gave nothing but noise (500, 429, "internal error", "context canceled"). The repaired probe is waiting for my command: it sends real transactions, so it has not been launched yet.

## What these days taught

- **Silence in the log looks like a calm market.** A counter of ticks per hour in plain sight is cheaper than any investigation afterwards.
- **A rework followed by leaving is a bad plan.** Even a green dashboard can mean "alive but sending nothing".
- **When the tick count is zero, check delivery first.** The model was accurate through all 21 hours.
- **A win is not skill until the cause is known.** The $26.7 came from a block with room for everyone.
- **Sending earlier is not sitting earlier.** Until delivery is understood, tuning lead and delay is wasted.

## Next

The experiment "fresh address against our wallet" on inclusion latency, then one transaction per window instead of a series. Contract addresses, keys and exact filter thresholds do not go here.
