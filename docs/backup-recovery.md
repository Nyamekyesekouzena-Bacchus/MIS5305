# Backup & Recovery Plan (RQ-05)

This document describes the backup, retention, and recovery procedures for the
pest-control service management system. It satisfies non-functional
requirement **RQ-05 (data backup and recoverability)**.

## 1. Scope

| Asset                     | Store                     | Criticality |
| ------------------------- | ------------------------- | ----------- |
| Application database      | PostgreSQL (`mis5305`)    | Critical    |
| Environment secrets       | `.env` (not in git)       | Critical    |
| Application source code   | Git repository            | High        |
| Uploaded static assets    | `public/`                 | Medium      |

The database is the primary asset: it holds users, customers, services,
service requests, inspections, appointments, request classifications, and the
audit / change-log tables.

## 2. Backup schedule & method

- **Frequency:** automated daily full logical backup at 02:00 local time.
- **Method:** `pg_dump` producing a compressed custom-format archive.

  ```bash
  pg_dump \
    --format=custom \
    --file="/var/backups/mis5305/mis5305_$(date +%F).dump" \
    "$DATABASE_URL"
  ```

- **Encryption at rest:** each dump is encrypted with GnuPG before leaving the
  host.

  ```bash
  gpg --encrypt --recipient backups@company.example \
    "/var/backups/mis5305/mis5305_$(date +%F).dump"
  ```

- **Off-site copy:** encrypted archives are synced to object storage in a
  separate region.

## 3. Retention

- Daily backups retained for **30 days**.
- The first backup of each month promoted to a **12-month** archive.
- Backups older than their retention window are purged automatically.

## 4. Recovery procedure (RTO / RPO)

- **Recovery Point Objective (RPO):** ≤ 24 hours (last nightly backup).
- **Recovery Time Objective (RTO):** ≤ 1 hour.

Steps to restore:

1. Retrieve and decrypt the required archive:

   ```bash
   gpg --decrypt mis5305_2025-06-15.dump.gpg > mis5305.dump
   ```

2. Restore into a clean database:

   ```bash
   createdb mis5305_restore
   pg_restore --clean --if-exists --no-owner \
     --dbname=mis5305_restore mis5305.dump
   ```

3. Point `DATABASE_URL` at the restored database (or rename it to `mis5305`).
4. Run `npx prisma migrate status` / `npx prisma db push` to confirm the schema
   matches the application.
5. Start the application and run the smoke tests (`npm test`) plus a manual
   login check for an Admin and a Field Worker account.

## 5. Restore verification (drill)

- A restore drill is performed **monthly** against a throwaway database to
  prove the latest backup is usable.
- The drill validates: row counts for `User`, `Customer`, `ServiceRequest`,
  `Appointment`, and `AuditLog`; a successful login; and that the audit trail
  is intact.
- Drill results (date, backup used, outcome) are recorded in the operations
  log.

## 6. Responsibilities

| Task                     | Owner                |
| ------------------------ | -------------------- |
| Backup monitoring        | Operations / DBA     |
| Monthly restore drill    | Operations / DBA     |
| Secret (`.env`) custody  | System administrator |
| Plan review (quarterly)  | Managing Director    |
