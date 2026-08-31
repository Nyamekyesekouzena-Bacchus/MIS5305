import { db } from "@/lib/db";

// Human-readable name for the acting user.
function actorName(user) {
  if (!user) return "System";
  const full = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return full || user.username || "Unknown";
}

// Record a sensitive change to the audit log (RQ-07). Best-effort: auditing
// failures must never block the primary action, so errors are swallowed.
export async function recordAudit({ entity, entityId, action, detail, user }) {
  try {
    await db.auditLog.create({
      data: {
        entity,
        entityId: entityId ?? null,
        action,
        detail: detail ?? null,
        changedBy: actorName(user),
      },
    });
  } catch (err) {
    console.error("Failed to write audit log", err);
  }
}
