---
id: regression-testing
term: Regression Testing
aliases:
  - eval regression suite
type: workflow
domains: [evaluation, tooling]
adoption: established
trend: steady
summary: Re-running a fixed set of test cases after a model or prompt change to catch unintended drops in quality.
relationships:
  - type: used-in
    target: benchmark
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Change a prompt, switch model versions, or tweak a setting, and something that used to work well can quietly stop working. Regression testing catches this by keeping a fixed set of known test cases and automatically re-checking them every time something changes, so a new problem gets caught immediately instead of showing up as a surprise complaint from a user.

It's the same idea as regression testing in traditional software, just applied to prompts and model behavior instead of code.

## Technical

A regression suite is a curated, fixed set of inputs (often including past failure cases) with expected outputs or scoring criteria, re-run automatically whenever a model version, prompt, or system component changes. Results are compared against a baseline to flag regressions before deployment. Well-maintained regression suites grow over time as new edge cases and past failures are added to prevent them from recurring silently.

## Examples

- Re-running a saved set of tricky prompts after switching to a new model version
- Adding a past customer-reported failure to the suite so it never regresses silently
- Comparing pass rates on a regression suite before and after a prompt change
