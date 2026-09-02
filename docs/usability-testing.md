# Task-Based Usability Testing Report

**System:** Miracle Exterminating — Service Management System (prototype)
**Method:** Moderated, task-based usability testing with representative users
**Participants:** 3 representative intended users (P1–P3)
**Measures:** task success, time/difficulty, errors, and short anonymised
feedback.

> **Template — partial automated results.** This document is a **template**.
> The automated evidence it links to (unit-test results in
> [test-evidence.md](test-evidence.md)) is real and machine-generated, but the
> participants, task-success observations and feedback below are **placeholders
> that require real task-based usability sessions** with at least three
> representative users before submission.

> **Note.** This report is part of an **automated testing/evaluation pipeline**.
> The evidence PDFs are produced by running:
>
> ```bash
> npm run evidence      # runs the unit tests and rebuilds all evidence PDFs
> npm test              # run the unit tests alone and see the results
> ```
>
> **AI (GitHub Copilot) was used to help create this automation.** The
> accompanying automated unit-test evidence is in [test-evidence.md](test-evidence.md).

---

## 1. Participants (anonymised)

_List at least three representative testers. Keep them anonymised._

| ID | Role represented | Relevant experience | Device/browser |
| --- | --- | --- | --- |
| P1 |  |  |  |
| P2 |  |  |  |
| P3 |  |  |  |

## 2. Scenarios and success criteria

Scenarios use realistic, end-to-end tasks mapped to the prioritised
requirements and the wireframe flows.

| Task | Scenario | Req | Success criterion |
| --- | --- | --- | --- |
| T1 | Log in and reach your dashboard | FR-001 | Reaches dashboard without help |
| T2 | Create a service request for a customer at a given address | FR-002 | Request saved with all required fields |
| T3 | Assign a field worker to that request | FR-003 | Field staff assigned |
| T4 | (Field Worker) Record and submit inspection findings | FR-004 | Findings submitted; status updates |
| T5 | Schedule an appointment from the findings | FR-005 | Appointment saved with a valid future date |
| T6 | (Field Worker) Submit job completion with sign-off | FR-006 | Job marked completed |
| T7 | (Manager) Open the reports and read the key figures | FR-007 | Locates request/inspection/appointment/completion figures |
| T8 | Record payment status for a completed job | CL-008 | Status set to Paid/Not Paid after inspection |

## 3. Results — task success

_Fill from live observation of each tester attempting the tasks._

Legend: ✓ success · ◐ success with difficulty · ✗ failure · — not attempted.

| Task | P1 | P2 | P3 | Success rate | Notes |
| --- | --- | --- | --- | --- | --- |
| T1 Login |  |  |  |  |  |
| T2 Create request |  |  |  |  |  |
| T3 Assign staff |  |  |  |  |  |
| T4 Inspection findings |  |  |  |  |  |
| T5 Schedule appointment |  |  |  |  |  |
| T6 Job completion |  |  |  |  |  |
| T7 Reports |  |  |  |  |  |
| T8 Payment status |  |  |  |  |  |

## 4. Observed difficulties → findings

_Record each difficulty observed, its severity, an anonymised quote, and a
proposed response. §5 and §6 summarise this table._

| ID | Task | Observation | Severity | Feedback (anonymised) | Proposed response |
| --- | --- | --- | --- | --- | --- |
| UF-01 |  |  |  |  |  |
| UF-02 |  |  |  |  |  |
| UF-03 |  |  |  |  |  |
| UF-04 |  |  |  |  |  |
| UF-05 |  |  |  |  |  |

## 5. Iteration log (usability findings)

Maps every major finding to a design/code change, a reasoned deferral, or a
documented limitation. Attach before/after screenshots or commit references for
substantial changes.

| Finding | Decision | Action / change ref | Before → After evidence |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

**Documented limitations (deferred):** _list anything deferred beyond the
prototype and why._

## 6. Summary

_Summarise overall task success, the main issues prioritised for iteration, and
how the findings cross-reference the [heuristic evaluation](heuristic-evaluation.md)
and the [test evidence report](test-evidence.md)._
