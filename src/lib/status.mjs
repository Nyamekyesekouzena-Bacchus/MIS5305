// Centralised business statuses, request types and their display colours.
// Single source of truth used by server actions, pages and UI components so
// that status strings and rules are never duplicated as literals (RQ-04).

export const INSPECTION_STATUS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  COMPLETED: "Completed",
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

// An inspection is considered "done" once it has been submitted or completed.
export const DONE_INSPECTION_STATUSES = [
  INSPECTION_STATUS.SUBMITTED,
  INSPECTION_STATUS.COMPLETED,
];

export const REQUEST_TYPE = {
  JOB: "Job",
  CONTRACT: "Contract",
};

// Payment status of a service request (set by admin after the inspection).
export const PAYMENT_STATUS = {
  PAID: "Paid",
  NOT_PAID: "Not Paid",
};

// Valid payment statuses, and the value a request defaults to before one is set.
export const PAYMENT_STATUSES = [PAYMENT_STATUS.NOT_PAID, PAYMENT_STATUS.PAID];
export const DEFAULT_PAYMENT_STATUS = PAYMENT_STATUS.NOT_PAID;

// Bootstrap colour mapping for payment status badges.
export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PAID]: "success",
  [PAYMENT_STATUS.NOT_PAID]: "warning",
};

// Valid contract durations offered in the UI (months).
export const CONTRACT_DURATIONS = [3, 6, 9, 12, 18, 24];

// Bootstrap colour mapping for status badges.
export const STATUS_COLORS = {
  [INSPECTION_STATUS.SCHEDULED]: "secondary",
  [INSPECTION_STATUS.IN_PROGRESS]: "warning",
  [INSPECTION_STATUS.SUBMITTED]: "info",
  [INSPECTION_STATUS.COMPLETED]: "success",
};
