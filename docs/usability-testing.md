# Task-Based Usability Testing Report

**System:** Miracle Exterminating — Service Management System (prototype)
**Method:** Moderated, task-based usability testing with representative users
**Participants:** 3 representative intended users (P1–P3)
**Measures:** task success, time/difficulty, errors, and short anonymised
feedback.

> The participant data below are **illustrative sample results** to demonstrate
> the method and format. Replace with your real, anonymised session records
> before submission. No real customer data is used (NFR-006).

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

| ID | Role represented | Relevant experience | Device/browser |
| --- | --- | --- | --- |
| P1 | Admin / office staff | Familiar with booking systems | Chrome desktop |
| P2 | Field Worker | Uses phone in the field | Android browser @ 360 px |
| P3 | Manager (Managing Director) | Reviews operational reports | Edge desktop |

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

Legend: ✓ success · ◐ success with difficulty · ✗ failure · — not attempted.

| Task | P1 | P2 | P3 | Success rate | Notes |
| --- | --- | --- | --- | --- | --- |
| T1 Login | ✓ | ✓ | ✓ | 3/3 | — |
| T2 Create request | ◐ | — | — | 1/1 | P1 unsure save succeeded (no confirmation) |
| T3 Assign staff | ✓ | — | — | 1/1 | — |
| T4 Inspection findings | — | ◐ | — | 1/1 | P2 unsure why Submit was disabled |
| T5 Schedule appointment | ✓ | — | — | 1/1 | — |
| T6 Job completion | — | ◐ | — | 1/1 | P2 missed sign-off field first attempt |
| T7 Reports | — | — | ✓ | 1/1 | No loading indicator on large report |
| T8 Payment status | ✓ | — | — | 1/1 | P1 expected control active before inspection |

Overall: all attempted tasks completed; several completed **with difficulty**,
providing the evidence below.

## 4. Observed difficulties → findings

| ID | Task | Observation | Severity | Feedback (anonymised) | Proposed response |
| --- | --- | --- | --- | --- | --- |
| UF-01 | T2–T6 (keyboard) | Keyboard focus order jumps unexpectedly in forms | Major | "I lost track of where I was tabbing." | Fix focus/tab order (NFR-008). Links to HE-01. |
| UF-02 | All | Focus indicator hard to see | Major | "Couldn't tell which field was selected." | Strengthen focus style. Links to HE-02. |
| UF-03 | T4, T6 (mobile) | Buttons small/close together on 360 px | Minor | "Fat-fingered the wrong button." | Enlarge touch targets (NFR-003). Links to HE-09. |
| UF-04 | T7 | Status colours hard to distinguish | Minor | "Two statuses looked the same colour." | Add labels + AA contrast. Links to HE-07. |
| UF-05 | T7 | Report felt slow with no feedback | Minor | "Wasn't sure it was loading." | Add loading state; verify NFR-001 at scale. Links to HE-08. |
| UF-06 | T2 | No clear confirmation after save | Minor | "Did it save? I clicked again." | Add success confirmation. Links to HE-03. |
| UF-07 | T4 | Not obvious why *Submit* disabled | Major | "Submit was greyed out with no reason." | Inline "findings required" message. Links to HE-05. |
| UF-08 | T2 (simulated failure) | On a save error, user unsure data was kept / how to retry | Major | "Was afraid I'd lost everything." | Preserve input + explicit **Retry** affordance (NFR-002). |

## 5. Iteration log (usability findings)

Maps every major finding to a design/code change, a reasoned deferral, or a
documented limitation. Attach before/after screenshots or commit references for
substantial changes.

| Finding | Decision | Action / change ref | Before → After evidence |
| --- | --- | --- | --- |
| UF-01 Focus order | **Change** | Correct DOM/tab order in form components | _add screenshots / commit_ |
| UF-02 Focus indicator | **Change** | Global visible-focus style | _add screenshots / commit_ |
| UF-07 Submit reason | **Change** | Inline validation message near Submit | _add screenshots / commit_ |
| UF-08 Save retry | **Change** | Preserve entered data + Retry button on failure | _add screenshots / commit_ |
| UF-06 Save confirmation | **Change (next)** | Success toast after save | _pending_ |
| UF-04 Status contrast | **Change (next)** | Label + AA-contrast badges | _pending_ |
| UF-03 Touch targets | **Change (next)** | Larger targets on ≤ 360 px | _pending_ |
| UF-05 Report loading | **Change (next)** | Loading indicator; re-measure NFR-001 at scale | _pending_ |

**Documented limitations (deferred):** full inline help/onboarding (HE-11) and a
comprehensive WCAG 2.2 AA automated + manual audit are deferred beyond the
prototype; tracked for a later iteration and noted as known limitations.

## 6. Summary

Three representative users completed all attempted core tasks, confirming the
end-to-end workflow (FR-001 → FR-007 + payment) is viable. Four **major**
usability issues (UF-01, UF-02, UF-07, UF-08) are prioritised for immediate
iteration; the remainder are scheduled or documented as limitations. Findings
are cross-referenced with the [heuristic evaluation](heuristic-evaluation.md)
and the [test evidence report](test-evidence.md), so each observation is treated
as evidence for iteration rather than hidden.
