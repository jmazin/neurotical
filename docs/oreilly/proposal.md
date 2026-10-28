# Neural Networks You Can See

**Subtitle:** Build intuition through interactive experiments, from one neuron to a small classifier

**Format:** Proposed two-hour live course  
**Level:** Beginner  
**Status:** Draft for Jonathan Mazin's review. Confirm prior O’Reilly instructor status and complete the sample-video and headshot links before submission.

## Instructor and contact information

| Field | Draft |
|---|---|
| Instructor name | Jonathan Mazin |
| Email | jonathan.mazin@gmail.com |
| Time zone | America/Toronto |
| New or returning O’Reilly instructor | [CONFIRM] |
| Company affiliation | Learning Twice — creator and educator |
| Primary website / channel | https://www.youtube.com/@learningtwice |
| LinkedIn | https://www.linkedin.com/in/jonathan-mazin/ |
| GitHub | https://github.com/jmazin |

## Course description

What actually changes when a neural network learns? In this beginner course, developers explore that question through interactive browser experiments and short JavaScript examples. Learners start with a single neuron that predicts exam pass/fail results. They move its cutoff manually, measure its mistakes, and implement a small training loop that adjusts a parameter automatically.

The course then introduces weight, squared error, and sigmoid activation, connecting each concept to a visible change in behavior. Learners distinguish correct classifications from low numerical error, explore decision boundaries with two inputs, and examine why a hidden layer helps with patterns that a single straight boundary cannot separate. The goal is a practical foundation for reading machine-learning code and reasoning about training behavior before working with larger frameworks.

## What learners will learn and how they can apply it

By the end of the course, learners will be able to:

- Implement a single neuron and a finite-difference training step in plain JavaScript.
- Predict how weight, bias, and sigmoid activation affect outputs and decision boundaries.
- Compare classification accuracy with training loss and explain why 100% training accuracy can coexist with nonzero squared error.
- Identify a dataset that a single linear decision boundary cannot separate and explain how a network with a nonlinear hidden layer can represent more complex boundaries.

These skills support reading training code, investigating unexpected model behavior, and preparing for framework-based machine-learning courses.

## This live event is for you because…

- You are a software developer who can read simple code and wants a concrete introduction to neural networks.
- You have used an ML library or watched an introductory explanation but want to connect its terminology to the calculations.
- You prefer to learn by predicting an outcome, changing a parameter, and checking what happened.

The primary audience is developers with no prior machine-learning experience. A secondary audience is technical educators looking for small experiments to explain the fundamentals.

## Prerequisites

- Read basic JavaScript: variables, functions, arrays, conditionals, and loops. Experience in a similar language is sufficient if the learner can follow simple JavaScript examples.
- Work with basic algebra, including substitution into a formula and positive and negative numbers.
- No previous neural-network experience or calculus is required.

## Course preparation

- Have a laptop with a current desktop browser and access to the supplied exercise pages.
- Open the instructor-provided demo and code sandbox before class. Exercise links will be included in the course materials.
- The exercises use vanilla JavaScript and require no ML framework. The code sandbox is a proposed delivery component to prepare before the course runs.

## Course schedule — 120 minutes

| Section | Duration | Presentation | Learner activity and evidence |
|---|---:|---|---|
| One neuron, one cutoff | 15 minutes | Turn a score into an input; compute a raw sum; make a pass/fail decision. Keep weight fixed at 1. | Predict which direction the cutoff moves, then adjust bias to separate the closest fail and pass. |
| Make the neuron learn | 20 minutes | Define wrong-side loss, average it across examples, and estimate a gradient by a small parameter change. | Complete a bias-update exercise and compare small and large learning rates. Explain why this loss can stop anywhere inside the valid gap. |
| Numerical targets and weight | 20 minutes | Switch to squared error with −1/+1 targets. Explain what the changed objective asks the model to do. Add a trainable weight. | On the balanced introductory dataset, compare accuracy and loss; adjust weight and bias to see how slope differs from position. |
| Add sigmoid | 20 minutes | Apply sigmoid to the weighted sum; use 0/1 targets and a 0.5 decision threshold. | Train weight and bias, inspect the gradual color transition, and explain why loss can keep decreasing after all training labels are correct. |
| Two inputs and multiple neurons | 30 minutes | Explore a two-dimensional linear boundary, then a dataset with a curved boundary. Introduce nonlinear hidden units through the supplied classifier. | Try to separate the classes with the simpler model, add a hidden layer, and describe the additional shapes the model can represent. |
| Recap, checks, and next steps | 15 minutes | Connect prediction, loss, gradient, and update; distinguish training performance from performance on new examples. | Answer short prediction questions, discuss an unseen-example thought experiment, and ask questions. |

Questions and discussion are included within each section. Students implement the single neuron and its numerical training step; the multilayer classifier is supplied for exploration. Deriving and implementing full backpropagation is beyond the scope of this session.

## Teaching approach

Each lesson follows the same cycle: predict a result, change one thing, observe the result, and explain the calculation. The visual control and the corresponding line of code appear together. Early examples use a fixed dataset so that changes in loss, activation, and parameter choice have interpretable effects.

The exam-score example uses synthetic labels, and the mushroom-themed classifier uses synthetic two-dimensional points. These are teaching datasets rather than claims about how real exam policies or mushroom identification should work. A sigmoid output is treated as a model score between 0 and 1; that range alone does not establish calibrated probabilities.

## Course follow-up

- [AI and Machine Learning for Coders — Laurence Moroney](https://www.oreilly.com/library/view/ai-and-machine/9781492078180/): continue into framework-based examples.
- [Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd Edition — Aurélien Géron](https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/): develop broader modeling, evaluation, and neural-network skills.

## Instructor bio

Jonathan Mazin is a software engineer and technical educator with more than 20 years of experience building production software. He is the creator of Learning Twice, where he publishes technical tutorials, live builds, and practical software-development lessons. As a former Lead Educator at BrainStation, he taught hundreds of developers through lectures, labs, code reviews, and projects. He currently develops and delivers Apple Developer Academy curriculum as a contract curriculum developer and instructor at Toronto Metropolitan University.

Jonathan holds a Bachelor of Engineering in Computer Engineering from McGill University. He is developing Neurotical, a browser-based learning project that uses interactive visualizations and plain JavaScript to make neural-network calculations visible. His teaching connects a working example to the code and the reasoning behind it.

## Supporting materials

- Existing public project: [Neurotical](https://neurotical.vercel.app/).
- Teaching sample: [ADD LINK TO THE RECORDED SINGLE-NEURON LESSON]. A recording script is provided in [teaching-sample.md](./teaching-sample.md).
- Instructor photo: [ADD A LINK TO A JPG OR PNG HEADSHOT].
- Public source repository: [github.com/jmazin/neurotical](https://github.com/jmazin/neurotical).
- Additional public teaching work: [Learning Twice on YouTube](https://www.youtube.com/@learningtwice).

## Preparation notes — remove before submitting

- This draft follows the [O’Reilly live-course proposal template](https://docs.google.com/document/d/1hDe3pmc8taSPh9pdiGLkTPw21J1lPsoKr-H3dygrYWs/edit). The template allows a maximum of two hours and asks new instructors for teaching-video samples. The proposed eight-minute sample is our choice, not a stated O’Reilly duration requirement.
- Fill the remaining bracketed fields and review the bio for accuracy. Professional background and profile links were drawn from Jonathan's recent résumé, `Jonathan_Mazin_Dynatrace_Resume.docx` (updated September 25, 2026); name and repository ownership also match the connected GitHub profile and local Git history.
- The public root page resolved to the mushroom demo when checked. The `/one-neuron/` and `/pass-fail/` public pages could not be verified through the web tool. Confirm the intended exercise links in a browser before including them in the application. No deployment was performed for this draft.
- Prepare a stable code sandbox, a completed exercise version, and repeatable checkpoints for each lesson. Keep a saved result for the randomly initialized multilayer demonstration so the schedule does not depend on a particular training run.
- The first sample uses `one-neuron`, with its activation/loss/training controls. The current `pass-fail` directory is a later stage with sigmoid and trainable weight and bias.
- Use set-1 for the controlled introduction to squared error. Set-2 can become an optional discussion of class balance and the objective being optimized; do not promise that raw-sum least squares must classify every point correctly.
- Introduce finite differences as a transparent learning tool. Briefly explain that larger networks generally use backpropagation to compute gradients efficiently.
- Keep MNIST as an optional visual next step rather than adding an image-model training exercise to the two-hour scope.
- Review the video already linked in the project README, `https://www.youtube.com/watch?v=ePokoTAbEcY`, before deciding whether it is an appropriate supporting sample. Its contents were not reviewed for this draft.
