// Automated tests for the centralised business rules (RQ-04) and the
// acceptance criteria they enforce. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  INSPECTION_STATUS,
  APPOINTMENT_STATUS,
  DONE_INSPECTION_STATUSES,
  REQUEST_TYPE,
  CONTRACT_DURATIONS,
  STATUS_COLORS,
  PAYMENT_STATUS,
  PAYMENT_STATUSES,
} from "../src/lib/status.mjs";
import {
  parseScheduledDate,
  parseScheduledAt,
  parseAssigneeIds,
  isInspectionDone,
  canScheduleAppointment,
  validateRequestFields,
  canSubmitInspection,
  canCompleteJob,
  validateRequestType,
  contractEndDate,
  validatePaymentStatus,
  scheduleWindow,
} from "../src/lib/validation.mjs";
import { hashPassword, verifyPassword } from "../src/lib/password.mjs";

const NOW = new Date("2025-06-15T12:00:00");

test("status constants are the single source of truth", () => {
  assert.equal(INSPECTION_STATUS.SCHEDULED, "Scheduled");
  assert.equal(INSPECTION_STATUS.SUBMITTED, "Submitted");
  assert.equal(APPOINTMENT_STATUS.COMPLETED, "Completed");
  assert.deepEqual(DONE_INSPECTION_STATUSES, ["Submitted", "Completed"]);
  assert.equal(REQUEST_TYPE.JOB, "Job");
  assert.equal(REQUEST_TYPE.CONTRACT, "Contract");
  assert.ok(STATUS_COLORS.Completed);
});

test("parseScheduledDate rejects empty, invalid and past dates", () => {
  assert.deepEqual(parseScheduledDate("", NOW), { error: "missing" });
  assert.deepEqual(parseScheduledDate("not-a-date", NOW), { error: "invalid" });
  assert.deepEqual(parseScheduledDate("2020-01-01", NOW), { error: "past" });
  const ok = parseScheduledDate("2025-12-01", NOW);
  assert.ok(ok.date instanceof Date);
});

test("parseScheduledAt rejects empty, invalid and past datetimes", () => {
  assert.deepEqual(parseScheduledAt("", NOW), { error: "missing" });
  assert.deepEqual(parseScheduledAt("nope", NOW), { error: "invalid" });
  assert.deepEqual(parseScheduledAt("2020-01-01T09:00", NOW), { error: "past" });
  const ok = parseScheduledAt("2025-12-01T09:00", NOW);
  assert.ok(ok.date instanceof Date);
});

test("parseScheduledAt rejects an earlier time on the same day", () => {
  // NOW is 2025-06-15T12:00 — an earlier time today must be rejected.
  assert.deepEqual(parseScheduledAt("2025-06-15T09:00", NOW), { error: "past" });
  // A later time today is allowed.
  const later = parseScheduledAt("2025-06-15T15:00", NOW);
  assert.ok(later.date instanceof Date);
  // The current minute is still allowed even though NOW carries seconds.
  const nowWithSeconds = new Date("2025-06-15T12:00:30");
  const current = parseScheduledAt("2025-06-15T12:00", nowWithSeconds);
  assert.ok(current.date instanceof Date);
});

test("parseAssigneeIds keeps only positive integers", () => {
  assert.deepEqual(parseAssigneeIds(["1", "2", "x", "-3", "0"]), [1, 2]);
  assert.deepEqual(parseAssigneeIds(undefined), []);
});

test("scheduleWindow brackets a time by the given window (minutes)", () => {
  const at = new Date("2025-06-15T12:00:00");
  const { start, end } = scheduleWindow(at, 120);
  assert.equal(start.toISOString(), new Date("2025-06-15T10:00:00").toISOString());
  assert.equal(end.toISOString(), new Date("2025-06-15T14:00:00").toISOString());
  // A booking one hour away falls inside a 120-minute window (a clash)...
  const near = new Date("2025-06-15T13:00:00");
  assert.ok(near >= start && near <= end);
  // ...while one three hours away falls outside it (no clash).
  const far = new Date("2025-06-15T15:30:00");
  assert.ok(far > end);
});

test("isInspectionDone reflects submitted/completed only", () => {
  assert.equal(isInspectionDone("Submitted"), true);
  assert.equal(isInspectionDone("Completed"), true);
  assert.equal(isInspectionDone("Scheduled"), false);
  assert.equal(isInspectionDone("In Progress"), false);
});

test("canScheduleAppointment enforces classification and job single-slot", () => {
  assert.deepEqual(canScheduleAppointment({ requestType: null }), {
    ok: false,
    reason: "notype",
  });
  assert.deepEqual(
    canScheduleAppointment({ requestType: { type: "Job" }, existingCount: 1 }),
    { ok: false, reason: "job" }
  );
  assert.deepEqual(
    canScheduleAppointment({ requestType: { type: "Job" }, existingCount: 0 }),
    { ok: true }
  );
  assert.deepEqual(
    canScheduleAppointment({
      requestType: { type: "Contract" },
      existingCount: 5,
    }),
    { ok: true }
  );
});

test("validateRequestFields requires customer, service, description, location (FR-002)", () => {
  assert.equal(
    validateRequestFields({
      customerId: 1,
      serviceId: 1,
      description: "d",
      location: "L",
    }),
    true
  );
  assert.equal(
    validateRequestFields({
      customerId: 1,
      serviceId: 1,
      description: "d",
      location: "",
    }),
    false
  );
});

test("canSubmitInspection requires findings (FR-004 AC2)", () => {
  assert.equal(canSubmitInspection({ findings: "roaches found" }), true);
  assert.equal(canSubmitInspection({ findings: "   " }), false);
  assert.equal(canSubmitInspection({ findings: "" }), false);
});

test("canCompleteJob requires customer sign-off (FR-006 AC3)", () => {
  assert.equal(canCompleteJob({ customerSignOff: "Jane Doe" }), true);
  assert.equal(canCompleteJob({ customerSignOff: "  " }), false);
  assert.equal(canCompleteJob({ customerSignOff: "" }), false);
});

test("validateRequestType enforces inspection gate, valid type and duration", () => {
  assert.deepEqual(
    validateRequestType({ type: "Job", inspectionDone: false }),
    { error: "locked" }
  );
  assert.deepEqual(
    validateRequestType({ type: "Nope", inspectionDone: true }),
    { error: "invalid" }
  );
  assert.deepEqual(
    validateRequestType({
      type: "Contract",
      durationMonths: 5,
      inspectionDone: true,
    }),
    { error: "duration" }
  );
  assert.deepEqual(
    validateRequestType({ type: "Job", inspectionDone: true }),
    { ok: true, type: "Job", durationMonths: null }
  );
  assert.deepEqual(
    validateRequestType({
      type: "Contract",
      durationMonths: 12,
      inspectionDone: true,
    }),
    { ok: true, type: "Contract", durationMonths: 12 }
  );
  for (const d of CONTRACT_DURATIONS) {
    assert.equal(
      validateRequestType({
        type: "Contract",
        durationMonths: d,
        inspectionDone: true,
      }).ok,
      true
    );
  }
});

test("contractEndDate adds the duration in months", () => {
  const end = contractEndDate(new Date("2025-01-15"), 6);
  assert.equal(end.getMonth(), 6); // July (0-based)
  assert.equal(contractEndDate(null, 6), null);
});

test("validatePaymentStatus is gated by inspection and restricted to Paid/Not Paid", () => {
  assert.equal(PAYMENT_STATUS.PAID, "Paid");
  assert.equal(PAYMENT_STATUS.NOT_PAID, "Not Paid");
  assert.deepEqual(PAYMENT_STATUSES, ["Not Paid", "Paid"]);

  assert.deepEqual(
    validatePaymentStatus({ status: "Paid", inspectionDone: false }),
    { error: "locked" }
  );
  assert.deepEqual(
    validatePaymentStatus({ status: "Bogus", inspectionDone: true }),
    { error: "invalid" }
  );
  assert.deepEqual(
    validatePaymentStatus({ status: "Paid", inspectionDone: true }),
    { ok: true, status: "Paid" }
  );
  assert.deepEqual(
    validatePaymentStatus({ status: "Not Paid", inspectionDone: true }),
    { ok: true, status: "Not Paid" }
  );
});

test("password hashing round-trips and rejects wrong password (FR-001 AC5)", async () => {
  const hash = await hashPassword("s3cret!");
  assert.notEqual(hash, "s3cret!");
  assert.equal(await verifyPassword("s3cret!", hash), true);
  assert.equal(await verifyPassword("wrong", hash), false);
});
