# Teaching sample: teach one neuron to find a cutoff

**Target length:** About eight minutes, including pauses and demonstrations. Rehearse and adjust the timing to your delivery.

**Learner outcome:** Explain how changing bias moves a pass/fail cutoff and how a training step can choose a useful direction by comparing loss.

## Recording setup

Use the existing `one-neuron` demo, not the later `pass-fail` version. Open it through the project's local preview server, or use a public deployment after confirming that its settings match.

- Training data: `set-1`.
- Loss: Difference.
- Train: Bias only, weight fixed at 1.
- Activation: Raw sum (linear).
- Learning rate: `0.1`.
- Blended: off.
- Bias: `0` at the beginning.

The highest failing score in this dataset is 55%; the lowest passing score is 65%. At bias `−0.2`, the cutoff is 60%, with 12/12 training examples correct and zero Difference loss. This is a convenient manually chosen checkpoint, not a promised training endpoint.

Keep the canvas, bias control, accuracy, and cost large enough to read. Have the following two lines ready beside the demo:

```js
input = score / 50 - 1;
sum = input + bias;
```

The decision rule is `sum >= 0` for pass. The first lesson does not use sigmoid or train a weight.

## 0:00–0:50 — Start with a question

**On screen:** Show the line of red failing scores and blue passing scores, with bias at zero.

**Say:**

“Suppose I give you some exam scores and tell you which students passed. Can you find a cutoff that separates them?

“These red points are examples labeled fail. These blue points are examples labeled pass. The closest fail is 55%, and the closest pass is 65%.

“You can probably place a cutoff yourself. We’re going to give that same small job to one artificial neuron, and we’ll be able to inspect every calculation it makes.”

**Pause:** Give the viewer a moment to identify the gap. Point at it without moving the control yet.

## 0:50–2:00 — Expose the calculation

**On screen:** Show the two lines of code, then return to the canvas.

**Say:**

“First, the demo rescales the score. Fifty percent becomes zero, zero percent becomes minus one, and one hundred percent becomes plus one. This keeps the input numbers small.

“Then the neuron adds one adjustable number: the bias. That’s the whole calculation for this first example. We are keeping the input weight fixed at one.

“A negative result predicts fail. Zero or a positive result predicts pass. This raw result is a number we use for a decision; it isn’t a probability.

“With bias at zero, the cutoff is 50%. That explains why some of our failing examples are currently being predicted as passes.”

**Pause:** Point to 55%, its actual label, and the predicted background color. Keep the distinction between a data label and a model prediction explicit.

## 2:00–3:20 — Let the viewer make a prediction

**Say before moving the slider:**

“What would happen if I made the bias more negative? Would the cutoff move left or right?”

**Pause:** Wait three to five seconds.

**On screen:** Move bias toward `−0.2`. Show the cutoff approaching 60%.

**Say:**

“It moves right. We are subtracting more from each input, so a student needs a higher score to reach zero.

“Here’s the calculation for our closest fail. A score of 55% becomes 0.1. Add a bias of minus 0.2, and the result is minus 0.1: fail.

“For 65%, the input is 0.3. Add the same bias, and the result is plus 0.1: pass.

“We have found one bias that separates all the examples.”

**On screen:** Point to the accuracy and cost displays. If the slider is approximate, describe its displayed values rather than claiming the bias is exactly `−0.2`.

## 3:20–4:40 — Measure a mistake

**On screen:** Return bias to zero. Show this loss calculation beside the demo:

```js
direction = label === 1 ? 1 : -1;
loss = Math.max(0, -direction * sum);
```

**Say:**

“We adjusted the bias by hand. For training, the program needs a number that measures a mistake.

“For a failing example, we want a negative sum. For a passing example, we want a positive sum. The direction tells us which side is correct.

“This loss is zero when an example is on its correct side. If it’s on the wrong side, we measure how far its sum is past zero. The displayed cost is the average of these losses across the training examples.

“At bias zero, the failing score of 55% produces a positive sum of 0.1, so it contributes a loss of 0.1. Moving the bias down reduces that mistake.”

**Pause:** Follow that one example through the calculation. Do not introduce a second loss function yet.

## 4:40–6:05 — Turn the adjustment into training

**On screen:** Keep the bias at zero. Point to Step, use several steps, then run Learn briefly and stop.

**Say:**

“To choose an update, we can try a tiny change in bias and compare the cost. That gives us a numerical estimate of the slope of the cost: a gradient.

“We update the bias in the direction that reduces the cost. The learning rate controls the size of that update.

“Watch this step. The program is changing the same bias we changed manually, but it is choosing the direction by measuring loss.

“This is a small example of gradient descent. Later, we’ll train more parameters. For large networks, backpropagation computes these gradients much more efficiently than trying parameter changes individually.”

**Pause:** Leave time to watch several updates. Rehearse the learning rate so the motion is visible on the recording.

## 6:05–7:10 — Explain what the result does and does not mean

**On screen:** Stop learning with the cutoff inside the gap. Move the bias to two different positions that keep the cutoff strictly between 55% and 65%.

**Say:**

“Notice that this loss doesn’t insist on a cutoff of exactly 60%. Several positions inside the gap make every example correct and produce zero cost.

“The data gives us a region of valid answers. This particular loss doesn’t prefer the middle. Training can stop once nearby changes no longer improve it.

“We’ve checked the examples used for training. That tells us how well the model fits these labels. To judge how it behaves on new examples, we would evaluate those separately.”

**Recording note:** Avoid placing a failing example exactly on the boundary. At a sum of exactly zero, Difference loss is zero but the decision rule predicts pass. This tie behavior can be discussed later if needed.

## 7:10–8:00 — Give a check and a reason to continue

**Say:**

“One final prediction: if I wanted the cutoff to be 70%, what bias would I need?”

**Pause:** Wait several seconds.

**On screen:** Show `70 / 50 - 1 = 0.4`, then `0.4 + bias = 0`.

**Say:**

“The input at 70% is 0.4, so a bias of minus 0.4 puts the boundary there. That would incorrectly fail our 65% example, which is why the chosen cutoff has to be checked against the labels.

“You’ve now seen the prediction, the mistake measurement, and the parameter update. Next we’ll change what we ask the output to represent, then add a weight so the neuron can change its slope as well as its cutoff.”

## Rehearsal notes

- Speak to the viewer, and pause before revealing the result of a parameter change.
- Explain Difference as a wrong-side penalty; “Difference” is the UI label, not ordinary absolute error.
- Do not promise that switching to squared error, adding a weight, or adding sigmoid alone will solve every dataset.
- A sharp decision boundary in the unblended view is a display of the decision rule. It is not evidence that a sigmoid curve has become infinitely steep.
- Record the sample, then fill its viewing link into the proposal and email draft. The written script itself is not a teaching-video sample.
