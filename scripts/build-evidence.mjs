// Full evidence pipeline (one command):
//   1. Runs the unit test suite and captures the real TAP output.
//   2. Injects the live results (pass/fail per test + summary) into
//      docs/test-evidence.md between the TEST-RESULTS markers.
//   3. Regenerates all three evidence PDFs from the Markdown.
//
// Usage: node scripts/build-evidence.mjs   (or: npm run evidence)
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { renderAll } from "./md2pdf.mjs";

const EVIDENCE_MD = "docs/test-evidence.md";
const START = "<!-- TEST-RESULTS:START -->";
const END = "<!-- TEST-RESULTS:END -->";

// Maps a test-name substring to the requirement(s) it traces to.
const TRACE = [
  ["status constants", "NFR-004"],
  ["parseScheduledDate", "FR-005"],
  ["parseScheduledAt", "FR-005"],
  ["parseAssigneeIds", "FR-003"],
  ["isInspectionDone", "FR-004"],
  ["canScheduleAppointment", "FR-005"],
  ["validateRequestFields", "FR-002"],
  ["canSubmitInspection", "FR-004"],
  ["canCompleteJob", "FR-006"],
  ["validateRequestType", "Classification"],
  ["contractEndDate", "Classification"],
  ["validatePaymentStatus", "Payment (CL-008)"],
  ["password hashing", "FR-001 / NFR-007"],
];
function traceFor(name) {
  const hit = TRACE.find(([k]) => name.includes(k));
  return hit ? hit[1] : "—";
}

// 1) Run the tests with the TAP reporter and capture output.
console.log("Running unit tests…");
const run = spawnSync(
  "node",
  ["--test", "--test-reporter=tap", "tests/"],
  { encoding: "utf8" }
);
const tap = `${run.stdout || ""}\n${run.stderr || ""}`;

// 2) Parse TAP: top-level "ok N - name" / "not ok N - name" lines.
const results = [];
for (const line of tap.split("\n")) {
  const m = line.match(/^(ok|not ok)\s+(\d+)\s+-\s+(.*)$/);
  if (!m) continue;
  const name = m[3].replace(/\s+#.*$/, "").trim();
  if (!name || name.toLowerCase().startsWith("subtest")) continue;
  results.push({ pass: m[1] === "ok", name });
}
const total = results.length;
const passed = results.filter((r) => r.pass).length;
const failed = total - passed;

// 3) Build the Markdown block.
const stamp = new Date().toISOString().replace("T", " ").slice(0, 16);
const rows = results
  .map(
    (r, i) =>
      `| ${i + 1} | ${r.name} | ${r.pass ? "pass" : "**FAIL**"} | ${traceFor(
        r.name
      )} |`
  )
  .join("\n");

const verdict =
  failed === 0
    ? `**Result:** ${passed}/${total} pass. These verify the acceptance-level ` +
      `rules independently of the UI, satisfying the NFR-004 requirement that ` +
      `"test cases shall verify all in-scope acceptance" for the centralised rules.`
    : `**Result:** ${passed}/${total} pass, ${failed} FAILED — see the rows ` +
      `marked FAIL above. Address failures before deployment.`;

const block = `${START}
_Generated automatically by \`npm run evidence\` on ${stamp} (UTC). Do not edit
by hand between the markers._

Command:

\`\`\`bash
npm test
\`\`\`

Latest run:

\`\`\`
# tests ${total}
# pass ${passed}
# fail ${failed}
\`\`\`

| # | Test | Result | Traces to |
| --- | --- | --- | --- |
${rows}

${verdict}
${END}`;

// 4) Splice the block into the report.
const md = readFileSync(EVIDENCE_MD, "utf8");
const s = md.indexOf(START);
const e = md.indexOf(END);
if (s === -1 || e === -1) {
  console.error(`Markers not found in ${EVIDENCE_MD}`);
  process.exit(1);
}
const updated = md.slice(0, s) + block + md.slice(e + END.length);
writeFileSync(EVIDENCE_MD, updated);
console.log(`Injected results into ${EVIDENCE_MD} (${passed}/${total} pass).`);

// 5) Regenerate all PDFs.
console.log("Generating PDFs…");
renderAll();

// 6) Exit non-zero if any test failed (so CI/graders notice).
if (failed > 0) process.exit(1);
console.log("Evidence build complete.");
