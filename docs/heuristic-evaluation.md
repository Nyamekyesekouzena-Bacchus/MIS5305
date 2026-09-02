# Heuristic Evaluation Report

**System:** Miracle Exterminating — Service Management System (prototype)
**Method:** Nielsen's 10 usability heuristics
**Evaluators:** 4 independent evaluators (E1–E4)
**Procedure:** Each evaluator inspected the prototype **independently** against
the ten heuristics, recording issues per screen/task. Findings were then
**aggregated**, de-duplicated, and severity-rated by consensus.

> **Template — partial automated results.** This document is a **template**.
> The automated evidence it links to (unit-test results in
> [test-evidence.md](test-evidence.md)) is real and machine-generated, but the
> heuristic findings, evaluator identities and severity ratings below are
> **placeholders that require a real heuristic-evaluation session** with 3–5
> independent evaluators before submission.

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

## 1. Evaluators and scope

_List each independent evaluator (3–5). Each inspects the prototype
independently before findings are aggregated._

| ID | Background (independent) | Screens/tasks inspected |
| --- | --- | --- |
| E1 |  |  |
| E2 |  |  |
| E3 |  |  |
| E4 |  |  |
| E5 |  |  |

Reference flows (from [wireframes.html](wireframes.html)):
1. Create Customer · 2. Create Service Request · 3. Schedule/Assign Inspection ·
4. Field Staff Inspection Findings · 5. Schedule/Assign Appointment ·
6. Field Staff Job Completion · 7. Manager Reports.

## 2. Severity scale (Nielsen)

| Rating | Meaning |
| --- | --- |
| 0 | Not a usability problem |
| 1 | Cosmetic — fix if time permits |
| 2 | Minor — low priority |
| 3 | Major — high priority, fix soon |
| 4 | Catastrophe — imperative to fix before release |

## 3. Nielsen's 10 heuristics (reference)

H1 Visibility of system status · H2 Match between system and real world ·
H3 User control and freedom · H4 Consistency and standards ·
H5 Error prevention · H6 Recognition rather than recall ·
H7 Flexibility and efficiency of use · H8 Aesthetic and minimalist design ·
H9 Help users recognise, diagnose, recover from errors ·
H10 Help and documentation.

---

## 4. Aggregated findings

_Record each issue found. One row per issue; §5 and §6 summarise this table._

| ID | Screen / task | Heuristic | Severity | Evidence (observation) | Found by | Proposed response |
| --- | --- | --- | --- | --- | --- | --- |
| HE-01 |  |  |  |  |  |  |
| HE-02 |  |  |  |  |  |  |
| HE-03 |  |  |  |  |  |  |
| HE-04 |  |  |  |  |  |  |
| HE-05 |  |  |  |  |  |  |
| HE-06 |  |  |  |  |  |  |
| HE-07 |  |  |  |  |  |  |
| HE-08 |  |  |  |  |  |  |

## 5. Findings by heuristic and severity

_Tally the findings from §4 per heuristic._

| Heuristic | Count | Max severity |
| --- | --- | --- |
| H1 Visibility of status |  |  |
| H2 Match to real world |  |  |
| H3 User control/freedom |  |  |
| H4 Consistency/standards |  |  |
| H5 Error prevention |  |  |
| H6 Recognition vs recall |  |  |
| H7 Flexibility/efficiency |  |  |
| H8 Aesthetic/minimalist |  |  |
| H9 Error recovery |  |  |
| H10 Help/documentation |  |  |

_Note the major (severity 3) and any catastrophe (severity 4) findings and
which to prioritise._

## 6. Iteration mapping (heuristic findings)

_Map each finding to a fix, a deferral, or a documented limitation._

| Finding | Decision | Change ref / limitation |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

Refer to [usability-testing.md](usability-testing.md) for the task-based
findings (UF-xx) that several of these responses feed into.
