---
status: in progress
---

# Grant-planning demographic and skills report

Authorized 10 October 2026. User requested Administrator dashboard/report showing voluntary disability types, demographic features, skills and support peculiarities, with downloads to inform grant applications. This extends wave 5; remaining visual review will include the new Reports content.

## Dashboard purpose

Help administrators describe the recorded cohort, identify expressed learning/access/resource needs and prepare evidence for grant proposals. Current data is a local fictional demonstration, not a nationwide participant registry or evidence of employment/income impact. No demographic category determines course access or grant eligibility.

## Wireframe specification

Administration → Reports retains activity metrics and adds grant planning: cohort/disclosure/skills/support cards; disability/gender/location/access/language/device/internet/goals breakdown tables; separate self-reported skills, demonstrated foundation-course skills, interests and enrolments; optional identifiable learner detail roster; aggregate CSV and separately selected detailed CSV exports. A gender pie chart presents mutually exclusive disclosure categories, including missing answers and geography-only samples. Horizontal bars present disability, skills and access/support counts with labelled values and text/table alternatives. Multi-select categories are not pie slices. A visible summary table immediately below the KPIs shows disclosure coverage, recorded learning and submitted support with explicit denominators. Tables have captions, definitions and mobile scrolling where needed. Include generation time/source scope and missing-data coverage.

User additionally requested charts and a direct downloadable PDF. Keep Download grant-planning PDF near the dashboard heading for the currently selected aggregate cohort. The PDF mirrors KPI cards, the summary table, pie/bar charts and full breakdown tables, with definitions, page numbers and generation date. Generate locally; no remote upload or new dependency. The PDF omits the identifiable roster; detailed learner information is a separate explicitly selected CSV.

## Metric definitions

- Grain is one named profile in the selected report scope/state. Primary User and explicitly loaded fictional geographic examples remain distinct.
- Disability/gender are voluntary self-reports, not medical verification. Blank answers mean not disclosed; explicit decline is retained separately.
- Geographic examples have location only; demographic/skill data is not collected, never guessed.
- Multi-select categories count each profile once per selected category. Category sums may exceed the cohort denominator.
- Existing skills and evidence are self-reported/unverified. Demonstrated skills derive only from completed enrolments and retained course versions; foundation learning does not establish observed trade competence.
- Support needs come from submitted checklists; separate available resources and reviewed/provided/receipt outcome records. Recorded grants remain simulated amounts, not executed transactions.
- Age, education and employment status are not currently collected; no statistics are invented for them.

## Filters

Reuse report scope (all / User / fictional geographic samples), plus state/FCT selection for grant planning. Filtered cohort counts and exports must match. Identifiable view/export controls are separate and reset disclosure/export selection on scope/state changes or leaving the report.

## Alert and interpretation rules

Show clear empty/no-matching and not-disclosed/not-collected labels. Report disclosure coverage so missing answers cannot be read as absence of disability. Explain overlapping categories and lack of recorded learning evidence for geographic samples. Default aggregate CSV contains categories/counts, no names/contact/free-text personal narratives. Explicit detailed CSV contains entered learner details; use fictional information in this demo. Existing anonymous demo-summary export remains unchanged.

## Work items

- [x] Data derivation, aggregation, scope/state consistency and CSV helpers.
- [x] Dashboard and separately selected detailed roster/export.
- [x] Accessible charts and actual PDF download, with rendered PDF layout inspection.
- [x] Model tests for denominator/missingness/retained skill provenance/export boundaries/CSV injection.
- [x] Browser test for scopes, consent reset, downloads, mobile, accessibility and zero POST.
- [x] Independent privacy/data-correctness review and corrections.
- [x] Preflight and production CSP.
- [x] Final reporting regressions.
- [ ] Guided eye test for the new Reports charts and PDF.
- [x] Update handoff, validation and report definitions.

## Ownership and gate

Main agent owns integration/documentation/final review. Executor owns new report derivation/component/model test/browser script. Preserve all user changes, shared schema 2 recovery and existing grant/learning gates. No new dependency, backend, real-user account, publication or financial integration is part of this extension.

Baseline: 76 model tests, eleven browser scripts, TypeScript/build/CSP and independent wave 5 review passed. Wave 5 eye-test steps 1–4 accepted; Step 5 is revisited with this requested extension.

Design decision: grouped exports use known response categories for free-text device/internet/language/availability and unknown disclosure choices; unsupported entries remain “Other recorded response” rather than exposing a narrative. Original entered text remains available in selected detailed learner export. Key charts form a compact grid; complete breakdown tables remain expandable. Identifiable roster reveal and detailed export selection are independent and reset on cohort changes.

Independent initial review found raw location/authored course labels could enter grouped exports and hidden Administration panels retained export selection across role switching. Canonical location names are derived from the existing pinned atlas (37 states/FCT, 774 LGAs); seed learning labels are whitelisted in grouped charts/PDF/CSV, with original entries retained in selected detailed exports. Administration reporting components now unmount when leaving the role. Correction tests and final independent recheck pass with no remaining material findings.

## 10 October validation checkpoint

`npm.cmd run preflight` passes all 84 model tests, TypeScript and production build. Production CSP smoke passes with dashboard/PDF button assertions. Dedicated grant-planning browser checks pass five axe audits, downloads, scope/state filters, separate disclosure/export choices, role-exit reset, empty/mobile layouts and zero POST/page errors. The three-page PDF was rendered with PyMuPDF; all pages inspected with no clipping or overlap. Artifacts: `output/pdf/grant-planning-report.pdf`, `output/pdf/grant-planning-review/page-1.png` through page-3.png, and desktop/mobile screenshots under `output/playwright/`.

The consolidated twelve-script suite passed its first nine scripts before the legacy reporting test matched two completion summaries. Its locator now targets the exact original summary; reporting and the remaining two scripts now pass. All twelve browser scripts have passing results on the final source. No application failure occurred. User visual acceptance for the new Reports charts/PDF remains pending; prior eye-test steps 1–4 remain accepted.

## Chart and PDF presentation refinement

User requested pie/bar charts and useful summary tables below the KPIs on both the dashboard and PDF. Implemented: gender pie with percentages, multi-select bars, visible coverage/learning/support summary table below KPIs and a prominent PDF download beside the heading. Matching PDF now has four A4 pages with KPI cards, summary table, labelled pie/bar charts and remaining breakdown tables. Preflight passes 84 tests, TypeScript and production build. Targeted grant browser passes five accessibility audits, summary placement/pie percentage/button assertions, privacy resets, filters and mobile overflow checks. All four PDF pages rendered and inspected; no clipping or split chart panels. Existing privacy, filter and denominator definitions remain in force. User visual acceptance remains pending.

## Geographic and editorial PDF redesign

User requested a richer professional PDF with country/state mapping, intentional spacing and arrangement, meaningful tables/charts/diagrams. Planned report uses the pinned Nigeria atlas, recorded state/LGA totals, clear data-coverage distinctions and coherent page sections. Five geography-only sample profiles have no gender collection; this is distinct from an explicit prefer-not-to-say answer. No additional demographic data is invented. Implemented as five deliberate report sections: executive briefing and evidence table; Nigeria geographic footprint with actual state polygons, labels, legend and state/LGA count/share tables; voluntary demographics/access with User-only denominators and a separate missing-information table; skills/support charts with a recorded enrolment-to-completion diagram; additional planning category tables. PDF demographic and skill charts exclude geography-only samples from their User denominators; geography and appendix tables use all selected profiles, explicitly labelled. Atlas failure stops PDF generation and offers CSV instead of a misleading map. Validation: 84 model tests, TypeScript/build, five clean grant-browser accessibility audits, all/User/sample/state/empty PDF downloads, safe atlas-failure handling and production CSP actual PDF download with local atlas GET 200. All five populated report pages rendered and inspected, including geographic labels and table spacing. Final header refinement changes narrow column labels to Count. User visual review remains pending.
