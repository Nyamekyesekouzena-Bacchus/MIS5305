// Centralised, pure validation and business-rule helpers (RQ-04).
// These functions contain no I/O so they are fully unit-testable and are the
// single source of truth for the rules enforced by the server actions.

import {
  DONE_INSPECTION_STATUSES,
  REQUEST_TYPE,
  CONTRACT_DURATIONS,
  PAYMENT_STATUSES,
  APPOINTMENT_WINDOW_MINUTES,
} from "./status.mjs";

// Parse a "YYYY-MM-DD" date string; must be valid and not in the past.
export function parseScheduledDate(value, now = new Date()) {
  if (!value) return { error: "missing" };
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { error: "invalid" };

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  if (date < today) return { error: "past" };

  return { date };
}

// Parse a "YYYY-MM-DDTHH:mm" datetime-local string; must be valid, not past.
// Because this carries a time-of-day, it is compared against the current
// moment (not midnight) so an earlier time on the same day is rejected.
export function parseScheduledAt(value, now = new Date()) {
  if (!value) return { error: "missing" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { error: "invalid" };

  // Truncate "now" to the start of the current minute so selecting the current
  // minute is still allowed (datetime-local has minute precision).
  const cutoff = new Date(now);
  cutoff.setSeconds(0, 0);
  if (date < cutoff) return { error: "past" };

  return { date };
}

// Normalise raw assignee id values into a list of positive integers.
export function parseAssigneeIds(values) {
  return (values ?? [])
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
}

// Half-open time window [start, end] centred on an appointment's start time,
// used by the technician-availability check so a clash is any other booking
// within `windowMinutes` on either side (rather than an exact-minute match).
export function scheduleWindow(date, windowMinutes = APPOINTMENT_WINDOW_MINUTES) {
  const ms = windowMinutes * 60 * 1000;
  return {
    start: new Date(date.getTime() - ms),
    end: new Date(date.getTime() + ms),
  };
}

// An inspection is "done" once submitted or completed.
export function isInspectionDone(status) {
  return DONE_INSPECTION_STATUSES.includes(status);
}

// Whether an appointment may be scheduled for a request.
// Requires the request to be classified; a Job may hold only one appointment.
export function canScheduleAppointment({ requestType, existingCount = 0 }) {
  if (!requestType) return { ok: false, reason: "notype" };
  if (requestType.type === REQUEST_TYPE.JOB && existingCount >= 1) {
    return { ok: false, reason: "job" };
  }
  return { ok: true };
}

// Service request required fields (FR-002 AC2 incl. location).
export function validateRequestFields({
  customerId,
  serviceId,
  description,
  location,
}) {
  return Boolean(customerId && serviceId && description && location);
}

// Inspection may only be *submitted* once findings are recorded (FR-004 AC2).
export function canSubmitInspection({ findings }) {
  return Boolean(findings && String(findings).trim());
}

// A job may only be *completed* once the customer has signed off (FR-006 AC3).
export function canCompleteJob({ customerSignOff }) {
  return Boolean(customerSignOff && String(customerSignOff).trim());
}

// Request-type classification rules (FR: Job/Contract after inspection done).
export function validateRequestType({ type, durationMonths, inspectionDone }) {
  if (!inspectionDone) return { error: "locked" };
  if (type !== REQUEST_TYPE.JOB && type !== REQUEST_TYPE.CONTRACT) {
    return { error: "invalid" };
  }
  if (type === REQUEST_TYPE.CONTRACT) {
    const months = Number(durationMonths);
    if (!CONTRACT_DURATIONS.includes(months)) return { error: "duration" };
    return { ok: true, type, durationMonths: months };
  }
  return { ok: true, type, durationMonths: null };
}

// Compute a contract end date from its start date and duration in months.
export function contractEndDate(startDate, durationMonths) {
  if (!startDate || !durationMonths) return null;
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + Number(durationMonths));
  return end;
}

// Payment status rules: an admin may only set it once the inspection is done,
// and the value must be one of the allowed statuses (Paid / Not Paid).
export function validatePaymentStatus({ status, inspectionDone }) {
  if (!inspectionDone) return { error: "locked" };
  if (!PAYMENT_STATUSES.includes(status)) return { error: "invalid" };
  return { ok: true, status };
}
