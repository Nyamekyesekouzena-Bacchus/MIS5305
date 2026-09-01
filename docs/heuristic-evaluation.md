# Heuristic Evaluation Report

**System:** Miracle Exterminating — Service Management System (prototype)
**Method:** Nielsen's 10 usability heuristics
**Evaluators:** 4 independent evaluators (E1–E4)
**Procedure:** Each evaluator inspected the prototype **independently** against
the ten heuristics, recording issues per screen/task. Findings were then
**aggregated**, de-duplicated, and severity-rated by consensus.

> The findings below are **illustrative sample data** to demonstrate the
> method and format. Replace evaluator names and observations with your real
> session records before submission.

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

| ID | Background (independent) | Screens/tasks inspected |
| --- | --- | --- |
| E1 | UX practitioner | All 7 flows |
| E2 | Software engineer (not on build team) | Flows 2–6 |
| E3 | Accessibility specialist | All 7 flows |
| E4 | Domain user (pest-control operations) | Flows 1–7 |

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

| ID | Screen / task | Heuristic | Severity | Evidence (observation) | Found by | Proposed response |
| --- | --- | --- | --- | --- | --- | --- |
| HE-01 | Global — keyboard nav | H4, and NFR-008 | 3 | Focus order in some forms jumps out of visual order; hard to follow with keyboard only. | E1, E3 | Set explicit tab order / DOM order in forms. → tracked as **UF-01**. |
| HE-02 | Global — focus indicator | H1 | 3 | Focus ring is faint on several controls; keyboard users lose their place. | E3 | Strengthen visible focus style site-wide. → **UF-02**. |
| HE-03 | Save actions (create/edit) | H1 | 2 | After *Save*, no explicit success confirmation; user unsure it worked. | E1, E4 | Add a success toast / inline confirmation after save. |
| HE-04 | Service request form | H5 | 2 | Past dates can be typed before being rejected on submit; no inline guard. | E2 | Disable past dates in the picker (server rule already blocks). |
| HE-05 | Inspection submit | H9 | 3 | "Submit" is blocked when findings empty but the reason is not obvious near the button. | E2, E4 | Inline message beside Submit explaining findings are required. |
| HE-06 | Payment status | H6 | 2 | Not obvious that status is locked until inspection is done; control appears active. | E1 | Disable + tooltip "available after inspection" until unlocked. |
| HE-07 | Status badges | H4 | 2 | Colour-only status coding; low contrast for two states (NFR-008). | E3 | Add text label + raise contrast to WCAG AA. → **UF-04**. |
| HE-08 | Reports | H1 | 2 | Large report can take ~1.6 s with no loading indicator; looks stalled. | E1 | Add a loading state; verify against NFR-001 at scale. → **UF-05**. |
| HE-09 | Mobile @ 360 px | H7 | 2 | Some primary buttons are below comfortable touch-target size. | E4 | Increase touch targets / spacing on small screens. → **UF-03**. |
| HE-10 | Delete customer/service | H3 | 3 | Destructive delete lacks a clear confirm step in one path. | E2, E4 | Ensure `ConfirmModal` on every destructive action. |
| HE-11 | Global | H10 | 1 | No inline help/tooltips for first-time users of specialist fields. | E4 | Add brief field hints; defer full help to a later iteration. |
| HE-12 | Error messages | H9 | 1 | Some server errors show generic text without next step. | E2 | Make key messages actionable (what to do next). |

## 5. Findings by heuristic and severity

| Heuristic | Count | Max severity |
| --- | --- | --- |
| H1 Visibility of status | 3 | 3 |
| H3 User control/freedom | 1 | 3 |
| H4 Consistency/standards | 3 | 3 |
| H5 Error prevention | 1 | 2 |
| H6 Recognition vs recall | 1 | 2 |
| H7 Flexibility/efficiency | 1 | 2 |
| H9 Error recovery | 2 | 3 |
| H10 Help/documentation | 1 | 1 |

Severity 3 (major): HE-01, HE-02, HE-05, HE-10 → prioritised for the next
iteration. No severity-4 (catastrophe) issues found.

## 6. Iteration mapping (heuristic findings)

| Finding | Decision | Change ref / limitation |
| --- | --- | --- |
| HE-01, HE-02, HE-07 | **Fix now** — accessibility (NFR-008) | UF-01, UF-02, UF-04 |
| HE-05, HE-10 (delete confirm) | **Fix now** — error prevention/control | Enforce ConfirmModal; inline submit guidance |
| HE-03, HE-04, HE-06, HE-08, HE-09, HE-12 | **Fix next iteration** | Scheduled after accessibility fixes |
| HE-11 (inline help) | **Defer** — low severity | Documented limitation: full help system out of prototype scope |

Refer to [usability-testing.md](usability-testing.md) for the task-based
findings (UF-xx) that several of these responses feed into.
