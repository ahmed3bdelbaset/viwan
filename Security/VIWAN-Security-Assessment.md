# VIWAN — Threat-Oriented Application Security Assessment

**Assessment date:** 2026-09-06  
**Audited snapshot:** `viwan-final-immersive.zip`  
**SHA-256:** `81087343014277cecc643adf33d9a685c1ec6d6fefb55a3e42681f63f64fef20`  
**Framework:** Next.js App Router 16.3.3 / React 19.2.4  
**Overall production risk:** **Critical — Block production deployment until P0 findings are remediated**

> This was an audit-only phase. No project source file was changed. The only created artifact is this report, outside the project directory.

---

# Executive Summary

The project has a well-structured visual frontend, but the server-side security boundary is not production-ready. The most serious issue is a fail-open admin authentication design: two login endpoints contain public fallback credentials, while the session-signing key also falls back to a public constant or the admin password. If the deployment omits one or more environment variables, an internet attacker can authenticate directly or forge an admin cookie and gain full administrative control.

Separately, three endpoints disclose all stored contact and consultation records without authentication, and two `/api/admin/*` endpoints allow unauthenticated state changes. The upload pipeline trusts the multipart MIME value and original extension, allowing active same-origin content such as SVG/HTML to reach `/public/uploads`, and gallery upload has no aggregate file-count or request quota. Public forms also have no application-level throttling, payload limits, anti-automation, retention controls, or transactional persistence; each request rewrites the entire JSON database synchronously.

The audited artifact already contains `data/db.json` with two contact records and two consultation records containing fields for names, emails, phone numbers, messages/notes, and timestamps. The file is mode `0644`, is not excluded by `.gitignore`, and is packaged into the distributable ZIP. The ZIP also includes `.env` (currently empty of secrets), showing that the packaging process does not exclude secret-bearing files.

**Immediate conclusion:** do not expose the current build to the public internet with the admin APIs enabled. Address F-01 through F-07 first, rotate any credentials already used with this code, remove exposed records from artifacts/history, and only then proceed to lower-severity hardening.

## Finding totals

| Severity | Count |
|---|---:|
| Critical | 1 |
| High | 6 |
| Medium | 5 |
| Low | 3 |
| Informational | 1 |
| **Total** | **16** |

---

# Scope and Method

## Reviewed scope

- 77 application/data files under `app`, `components`, `hooks`, `lib`, and `data`.
- 16,781 lines of TypeScript/TSX.
- All 20 App Router API route handlers.
- Frontend form and admin-dashboard data flows.
- `data/db.json`, `data/studio-admin.json`, and filesystem persistence.
- Authentication, session creation/verification, authorization guards, uploads, public static delivery, secrets, configuration, lockfiles, and external integrations.
- `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `.env`, `.env.example`, `.gitignore`, `next.config.mjs`, and `tsconfig.json`.
- Google Analytics, Vercel Analytics, Google Maps iframes, social links, and all server-side `fetch`/filesystem/crypto usage.

## Methodologies used

- OWASP Top 10 and OWASP API Security Top 10.
- OWASP ASVS concepts for authentication, session management, access control, validation, files/resources, configuration, logging, and data protection.
- CWE mapping where applicable.
- STRIDE threat modeling.
- Source-to-sink review of untrusted input.
- Trust-boundary and business-flow analysis.
- Dependency-lock review plus official advisory verification.

## Limitations

- This was a source/configuration review, not a penetration test against a deployed URL.
- Cloud IAM, CDN/WAF rules, TLS termination, reverse-proxy behavior, production environment variables, secret-manager policy, object-storage policy, backups, CI/CD permissions, and runtime logs were not supplied and therefore cannot be attested.
- A live `npm audit` was attempted against an isolated copy of the lockfiles, but the sandbox could not resolve `registry.npmjs.org`. Official Next.js/React advisories and exact lockfile versions were reviewed instead. A connected SCA run remains mandatory in Phase 3.
- No destructive request, live credential test, malware upload, or production data access was performed.

---

# Architecture, Data Flow, and Trust Boundaries

## Architecture

1. **Public browser/UI**
   - Public pages, projects, contact forms, consultation flow, careers form, maps, and analytics.
2. **Next.js Route Handlers**
   - Public writes: `/api/contact`, `/api/public/contact`, `/api/consultation`.
   - Public reads: `/api/settings`, `/api/public/site-config`.
   - Admin login/session: `/api/admin/auth`, `/api/admin/login`, `/api/admin/me`, `/api/admin/logout`.
   - Admin CRUD: projects, team, gallery, upload, site configuration.
   - Legacy/shadow admin routes: `/api/admin/data`, `/api/admin/settings`, `/api/admin/inbox`.
3. **Persistence boundary**
   - `data/db.json` stores projects, jobs, contacts, consultations, and settings.
   - `data/studio-admin.json` stores team, gallery metadata, and site configuration.
   - `public/uploads` stores uploaded files on the same web origin.
4. **External services**
   - Google Tag Manager/GA4 script.
   - Vercel Analytics.
   - Google Maps iframe.
   - Social/WhatsApp links.
   - No webhook receiver or server-side third-party API integration was found.

## Principals and authorization model

- **Anonymous internet user:** may browse and submit forms.
- **Single global admin:** authenticated by one email/password pair and a signed cookie.
- No customer accounts, tenant model, object ownership model, role hierarchy, or RBAC implementation exists. Because the current design is explicitly single-admin, the absence of tenant-level IDOR checks is not itself reported as a vulnerability. The actual missing function-level authorization is reported in F-02 and F-03.

## Key data flows

- Public contact/consultation JSON → route handler → `readDb()` → array prepend → full `writeDb()` to `data/db.json`.
- Admin credentials → one of two login handlers → `setAdminSession()` → `viwan_admin_token` cookie.
- Admin cookie → repeated per-route `getAdminSession()` checks → CRUD operations.
- Multipart upload → `request.formData()` → `saveUploadedImage()` → same-origin `/public/uploads` → gallery/project/team references.
- Admin site configuration → `data/studio-admin.json` → unauthenticated `/api/public/site-config` → public iframe/contact rendering.

## Trust boundaries

| Boundary | Data crossing it | Primary threats |
|---|---|---|
| Internet → public APIs | PII, free text, dates, enums | Abuse, oversized input, data poisoning, DoS |
| Browser → admin login | Email/password | Brute force, default credentials, spoofing |
| Admin cookie → admin APIs | Signed bearer-equivalent session | Forgery, replay, CSRF, missing authorization |
| Next.js process → JSON files | PII and business state | Disclosure, races, corruption, non-durable writes |
| Upload API → public origin | Attacker-controlled bytes | Active content, stored XSS, disk exhaustion |
| Site → Google/Vercel services | Page/navigation metadata | Third-party trust and privacy |

## STRIDE summary

| STRIDE category | Relevant findings |
|---|---|
| Spoofing | F-01, F-04, F-08 |
| Tampering | F-03, F-05, F-09, F-10 |
| Repudiation | F-12 |
| Information disclosure | F-02, F-07 |
| Denial of service | F-05, F-06, F-10 |
| Elevation of privilege | F-01, F-03 |

---

# Phase 1 — Security Audit Findings

## F-01

**Severity:** Critical  
**Title:** Fail-open admin authentication and predictable session-signing key  
**Mappings:** OWASP A07 Identification and Authentication Failures; OWASP API2 Broken Authentication; CWE-798, CWE-321, CWE-1392, CWE-287; STRIDE Spoofing/Elevation of Privilege

**Description:** The application silently falls back to a public admin email/password when environment variables are absent. The session HMAC key separately falls back to `ADMIN_PASSWORD` and finally to a public constant. Authentication therefore becomes fail-open under a common deployment mistake, and authentication secrets are not cryptographically separated.

**Affected Components:**

- `app/api/admin/auth/route.ts:4-5, 14-22`
- `app/api/admin/login/route.ts:4-5, 14-25`
- `lib/admin-session.ts:12-23`
- `.env.example:1-8` (documents only GA, not required admin secrets)

**Evidence:** Both login handlers define `ADMIN_EMAIL || "admin@viwan.studio"` and `ADMIN_PASSWORD || "viwan_admin_2026"`. `getSessionSecret()` returns `ADMIN_SESSION_SECRET || ADMIN_PASSWORD || "viwan-local-session-secret"`. The HMAC format is fully derivable from `lib/admin-session.ts:26-34`.

**Attack Scenario:** If production starts without the expected environment variables, an attacker signs in using the repository-visible fallback credentials. Alternatively, using the public fallback signing key, the attacker constructs a valid payload containing any email and a future expiry, signs it with HMAC-SHA256, and sends it as `viwan_admin_token`.

**Impact:** Complete admin takeover: project/team/site-data modification or deletion, upload access, gallery manipulation, and access to authenticated endpoints. F-05 can then be chained to host active same-origin content.

**Root Cause:** Convenience development defaults were embedded in production code; startup configuration is not validated; authentication and session signing are duplicated/coupled rather than managed through one fail-closed security service.

**Recommended Fix:** Remove all credential/key fallbacks. Validate required secrets at server startup and fail deployment when missing/weak. Use a dedicated high-entropy session key independent of the password, preferably a managed identity/auth library or stateful server-side sessions. Store only a strong password hash if local credentials remain. Consolidate the two login endpoints and rotate any credentials/keys ever used with this code.

**Verification:**

- Production startup fails when any required secret is absent or weak.
- The former default email/password always returns 401.
- A cookie signed with the former fallback string returns 401 on every admin endpoint.
- Password and session-key rotation tests pass.
- A repository-wide scan finds no fallback credentials or signing keys.

---

## F-02

**Severity:** High  
**Title:** Unauthenticated disclosure of contact and consultation PII  
**Mappings:** OWASP A01 Broken Access Control; OWASP API5 Broken Function Level Authorization; CWE-862, CWE-200; STRIDE Information Disclosure

**Description:** Multiple GET routes return full contact and consultation collections without any session check. These records contain names, emails, phone numbers, messages/notes, timestamps, project details, and statuses.

**Affected Components:**

- `app/api/admin/data/route.ts:4-13` → `GET /api/admin/data`
- `app/api/contact/route.ts:43-46` → `GET /api/contact`
- `app/api/consultation/route.ts:41-44` → `GET /api/consultation`
- `lib/db.ts:10-38` defines the PII fields

**Evidence:** None of the three handlers imports or invokes `getAdminSession()`. `/api/admin/data` explicitly returns `contacts` and `consultations`; the other routes return their full arrays. The audited data file contains two contact and two consultation records.

**Attack Scenario:** An unauthenticated attacker requests any of these endpoints directly and enumerates all current records. Repeated polling captures future submissions as the database grows.

**Impact:** PII breach, exposure of project budgets/intent and consultation notes, phishing/social-engineering material, privacy/compliance exposure, and reputational damage.

**Root Cause:** Read methods were added to public form routes and a legacy admin aggregation route without a default-deny authorization boundary.

**Recommended Fix:** Remove public collection GET methods unless explicitly required. Put necessary admin reads behind one centralized `requireAdmin` guard, return minimum-data DTOs, add pagination, `Cache-Control: private, no-store`, and authorization tests for every method—not merely every file.

**Verification:** Anonymous and malformed-session requests receive 401/403 with no records. Authenticated admin requests return only approved fields. Route-matrix tests cover every exported method. Caches/CDN never store admin responses.

---

## F-03

**Severity:** High  
**Title:** Unauthenticated administrative state-changing endpoints  
**Mappings:** OWASP A01; OWASP API5; CWE-862, CWE-285; STRIDE Tampering/Elevation of Privilege

**Description:** Two routes under `/api/admin` modify persistent business state without authentication or authorization. Input is also not allowlisted.

**Affected Components:**

- `app/api/admin/settings/route.ts:4-15` → `POST /api/admin/settings`
- `app/api/admin/inbox/route.ts:4-22` → `POST /api/admin/inbox`
- `components/site/cairo-map-card.tsx:28-40` consumes settings through `/api/settings`

**Evidence:** Neither route imports `getAdminSession()`. The settings route merges the entire request body into `db.settings`. The inbox route accepts caller-controlled `id`, `type`, and arbitrary `status`, then persists the result.

**Attack Scenario:** Any internet user posts altered map/contact/business settings or changes inquiry/consultation workflow statuses. The attacker can mark leads as handled, hide operational urgency, or repeatedly corrupt public-facing configuration.

**Impact:** Site defacement/misdirection, lead loss, business-process tampering, false status changes, and integrity loss.

**Root Cause:** Shadow/legacy admin APIs remained reachable after a newer protected dashboard/API set was introduced; authorization is manually repeated rather than default-deny.

**Recommended Fix:** Delete unused routes. If functionality is still required, route it through the existing authenticated admin service, enforce a strict schema and status-transition allowlist, add CSRF/origin controls, and log actor/action/target/outcome.

**Verification:** Anonymous calls to every state-changing admin method fail before body parsing or persistence. Invalid fields/status transitions return 400/409. Valid authenticated operations work and produce audit events. A route inventory confirms there are no unguarded `/api/admin/*` methods except login/logout by design.

---

## F-04

**Severity:** High  
**Title:** Unlimited brute force against duplicate admin login endpoints  
**Mappings:** OWASP A07; OWASP API2/API4; CWE-307; STRIDE Spoofing

**Description:** Both login endpoints perform direct credential comparison with no per-IP or per-account throttling, progressive delay, temporary lockout, bot control, or failed-login alerting. Duplicated endpoints double policy drift and attack surface.

**Affected Components:**

- `app/api/admin/auth/route.ts:7-28`
- `app/api/admin/login/route.ts:7-31`
- `package.json:6-10` has no security/rate-limit service or script

**Evidence:** The handlers parse JSON and immediately compare strings. No rate-limiter, client-IP policy, failure counter, 429 response, or audit event exists anywhere in the API code.

**Attack Scenario:** After F-01 is fixed, an attacker continuously submits password guesses across both endpoints, distributes attempts across IPs, or targets a leaked password list without triggering a server-side control.

**Impact:** Admin account takeover, resource consumption, and no reliable detection trail.

**Root Cause:** Authentication was implemented as two thin route handlers rather than one hardened authentication domain service with shared abuse controls.

**Recommended Fix:** Consolidate login to one endpoint. Add distributed, proxy-aware limits keyed by trusted client IP and a normalized/hashed account identifier, progressive backoff, bounded temporary lockout, generic responses, and structured security events. Consider phishing-resistant MFA for production admin access.

**Verification:** Threshold tests return 429 with correct retry behavior; account/IP dimensions both apply; success resets only the correct counters; distributed-instance tests share state; headers cannot spoof the trusted client IP; valid login and recovery flows still work.

---

## F-05

**Severity:** High  
**Title:** File-upload validation permits active same-origin content and unbounded gallery batches  
**Mappings:** OWASP A05/A08; CWE-434, CWE-79, CWE-770; STRIDE Tampering/DoS

**Description:** Upload validation trusts the client-supplied multipart MIME string and only checks that it begins with `image/`. For MIME values outside a short map, it preserves the original filename extension. Files are written verbatim under `public/uploads`, where the application serves them from its trusted origin. The gallery endpoint accepts an unlimited number of files per request, each up to 15 MB.

**Affected Components:**

- `lib/upload.ts:5-32`
- `app/api/admin/upload/route.ts:7-27`
- `app/api/admin/gallery/route.ts:20-54`
- Public delivery from `public/uploads`

**Evidence:** `file.type.startsWith("image/")` is the only type gate; bytes/magic numbers are never inspected or decoded. Extension selection falls back to `path.extname(file.name)`. `fs.writeFile()` stores the original bytes. `getAll("files")` is processed in a loop without count or aggregate-size limits.

**Attack Scenario:** An authenticated attacker—or an unauthenticated attacker chaining F-01—sends a multipart part with a crafted `image/*` MIME and an HTML/SVG extension/body. The returned `/uploads/...` URL is served on the VIWAN origin and can be shared or embedded. A second path submits many 15 MB files to exhaust memory/disk.

**Impact:** Stored/same-origin script execution or trusted-origin phishing, credentialed requests from an admin browser, persistent malicious content, and storage/availability exhaustion.

**Root Cause:** Validation relies on attacker-controlled metadata; uploads and application pages share the same origin; there is no normalization/re-encoding, quarantine, quota, or aggregate request policy.

**Recommended Fix:** Allowlist required raster formats, verify file signatures and decoder output, re-encode to a generated safe format/extension, reject SVG and active formats unless sanitized by a mature policy, cap dimensions/count/aggregate bytes, and store untrusted media in isolated object storage on a separate origin with safe `Content-Type`, `Content-Disposition`, `nosniff`, malware scanning, quotas, and lifecycle rules.

**Verification:** Tests with MIME/extension mismatches, HTML, SVG script, polyglots, malformed images, oversized dimensions, excessive file count, and aggregate overflow are rejected. Valid JPEG/PNG/WebP files are re-encoded and render correctly. Uploaded responses cannot execute script or receive admin cookies.

---

## F-06

**Severity:** High  
**Title:** Public form APIs allow automated resource exhaustion and unbounded data poisoning  
**Mappings:** OWASP API4 Unrestricted Resource Consumption; OWASP API6 Unrestricted Access to Sensitive Business Flows; CWE-400, CWE-770, CWE-20; STRIDE DoS/Tampering

**Description:** Three public write endpoints have no application-level rate limiting, bot control, payload/field-length limits, strict schema, duplicate suppression, or retention bound. Each accepted request prepends to an unbounded array and synchronously rewrites the complete JSON database.

**Affected Components:**

- `app/api/contact/route.ts:4-36`
- `app/api/public/contact/route.ts:13-46`
- `app/api/consultation/route.ts:4-34`
- `lib/db.ts:128-152`

**Evidence:** Only presence checks are performed. No `Content-Length` policy, schema library, `maxLength`, limiter, CAPTCHA/honeypot, idempotency key, queue, or cap exists. `writeDb()` calls `JSON.stringify()` and `fs.writeFileSync()` for the full dataset on every submission.

**Attack Scenario:** A bot sends many valid-looking requests containing very long strings. Database size grows while each subsequent write becomes more expensive, blocking the Node.js event loop and filling disk. The same campaign floods the admin workflow with fake leads.

**Impact:** Site/API downtime, disk exhaustion, increased latency, corrupted lead quality, operational overload, and possible loss of legitimate submissions.

**Root Cause:** Browser validation was treated as sufficient, and a local JSON demo store was retained as a production write path without abuse controls.

**Recommended Fix:** Introduce strict shared server schemas with field/type/enum/length limits, request-size enforcement before parsing where the platform permits, distributed IP/fingerprint rate limits, bot defense/honeypot, idempotency/duplicate detection, durable queued persistence, quotas/retention, and monitoring. Preserve accessibility and do not rely solely on CAPTCHA.

**Verification:** Boundary and oversized-input tests, distributed-rate-limit tests, burst/load tests, duplicate tests, and recovery tests pass. Legitimate submissions remain usable. Disk/database growth and p95 latency remain bounded under the defined abuse model.

---

## F-07

**Severity:** High  
**Title:** PII is stored in plaintext project files and shipped in the release artifact  
**Mappings:** OWASP A02 Cryptographic Failures; CWE-312, CWE-922; STRIDE Information Disclosure

**Description:** Contact and consultation records are persisted as plaintext inside the project directory. The audited files are mode `0644`, are not excluded by `.gitignore`, and `data/db.json` is included in the distributed ZIP. The packaging process also includes `.env`, which is empty now but may contain secrets in another environment.

**Affected Components:**

- `data/db.json`
- `data/studio-admin.json`
- `.gitignore`
- `viwan-final-immersive.zip`
- `lib/db.ts:7-8, 128-152`

**Evidence:** `data/db.json` contains two contacts and two consultations with PII-shaped fields; file mode is `0644`. The release archive lists `.env`, `.env.example`, `data/db.json`, and `data/studio-admin.json`. `.gitignore` has no rule for runtime data files.

**Attack Scenario:** A developer, contractor, CI artifact consumer, compromised build worker, backup reader, or container user obtains the source/release artifact and reads submitted PII. A future populated `.env` could be leaked by the same packaging process.

**Impact:** PII/secret exposure, excessive data distribution, weak retention control, and privacy/compliance risk independent of the HTTP authorization flaws.

**Root Cause:** Runtime data, seed/demo data, source code, and build artifacts are not separated; filesystem permissions and artifact allowlists are not defined.

**Recommended Fix:** Migrate PII to a managed persistent database with least-privilege credentials, encryption at rest, backups, retention/deletion policy, and access logging. Remove runtime records from source/artifacts and history; use synthetic fixtures for development. Build artifacts from an allowlist and explicitly exclude `.env*` and runtime data. Use restrictive local permissions for any temporary files.

**Verification:** Fresh artifacts contain no `.env*` or runtime PII. Secret/PII scanning passes in repository history and CI outputs. Database roles, encryption, backup restore, retention deletion, and access logs are tested. Previously exposed credentials are rotated and real records are handled under an incident/privacy process if applicable.

---

## F-08

**Severity:** Medium  
**Title:** Admin sessions cannot be revoked or rotated and remain replayable for 24 hours  
**Mappings:** OWASP A07; ASVS session management; CWE-613, CWE-294; STRIDE Spoofing

**Description:** The admin cookie is a self-contained HMAC token with only `email` and `expiresAt`. There is no `iat`, random session ID, server-side record, token version, credential-version check, idle timeout, rotation, or revocation list. Logout only removes the browser copy.

**Affected Components:** `lib/admin-session.ts:4-84`; `app/api/admin/logout/route.ts:4-6`; `app/api/admin/login/route.ts:34-36`

**Evidence:** `SESSION_TTL_SECONDS` is 24 hours. Verification checks only signature, non-empty email, and expiry. No session store is consulted. `clearAdminSession()` deletes the cookie without invalidating a copied token.

**Attack Scenario:** An attacker who obtains a valid cookie replays it from another browser for the remainder of the 24-hour lifetime, including after the legitimate admin logs out. Depending on key configuration, changing the password/email may not invalidate it.

**Impact:** Prolonged admin takeover window and inability to terminate a compromised session reliably.

**Root Cause:** Stateless token convenience was chosen without lifecycle/revocation requirements appropriate to a privileged admin account.

**Recommended Fix:** Use opaque high-entropy server-side sessions or signed tokens with a server-side session/version record. Add absolute and idle expiry, rotation after authentication/privilege events, revocation on logout/credential change, session inventory, and secure cookie prefixing where deployment allows. Keep existing `HttpOnly`, production `Secure`, `SameSite=Strict`, and `Path=/` controls.

**Verification:** A copied token fails immediately after logout/revocation/password change; idle and absolute expiry tests pass; rotation invalidates the predecessor safely; concurrent legitimate sessions follow the chosen policy.

---

## F-09

**Severity:** Medium  
**Title:** Consultation business rules are enforced only by the UI and can be bypassed  
**Mappings:** OWASP API6; CWE-840, CWE-20; STRIDE Tampering

**Description:** The client presents a fixed project-type/time selection, but the server accepts arbitrary strings and optional/unvalidated dates/times. It does not reject past dates, unsupported time windows, duplicate requests, or unavailable slots, and it has no idempotency semantics.

**Affected Components:**

- `app/consultation/page.tsx:30-38, 348-436`
- `app/api/consultation/route.ts:6-29`

**Evidence:** The route checks only `name`, `email`, `phone`, and `projectType`. It converts `preferredDate`, `preferredTime`, and `projectType` to strings without enum/date/time validation or availability lookup.

**Attack Scenario:** An attacker bypasses the UI and posts arbitrary project types, malformed/past dates, unsupported time values, and repeated requests for the same identity/slot, degrading the scheduling/triage process.

**Impact:** Polluted booking data, duplicate or impossible requests, staff time loss, and unreliable downstream scheduling decisions.

**Root Cause:** Business invariants live in client markup instead of an authoritative domain service/database transaction.

**Recommended Fix:** Define server-owned enums and date/time rules, normalize timezone, reject past/closed slots, implement idempotency and duplicate policy, and—if the flow represents confirmed capacity—reserve slots transactionally with conflict responses. Keep client options generated from the same shared contract.

**Verification:** Direct API tests reject invalid enums, past dates, malformed dates, unavailable slots, and duplicate/idempotency replays; valid localized requests still succeed; timezone boundary tests pass.

---

## F-10

**Severity:** Medium  
**Title:** Non-transactional filesystem persistence permits lost updates and identifier collisions  
**Mappings:** CWE-362, CWE-400; STRIDE Tampering/DoS

**Description:** API handlers use independent read-modify-write cycles against shared JSON files with no lock, compare-and-swap, transaction, or multi-instance coordination. Contact/consultation IDs use millisecond timestamps; both contact endpoints can generate the same `cs-<timestamp>` value.

**Affected Components:**

- `lib/db.ts:128-152`
- `lib/studio-admin-store.ts:62-92`
- All route call sites shown by `readDb()/writeDb()` and `readStudioAdminData()/writeStudioAdminData()`
- `app/api/contact/route.ts:18`
- `app/api/public/contact/route.ts:29`
- `app/api/consultation/route.ts:18`

**Evidence:** `writeDb()` writes directly to the shared file; the second store uses atomic rename but no concurrency/version control. Public identifiers derive only from `Date.now()`. Every mutation writes a full in-memory snapshot.

**Attack Scenario:** Concurrent requests on multiple processes/serverless instances read the same old state and then overwrite one another. Closely timed contact submissions can share an ID, making later status updates ambiguous. Under load, partial operational failure can trigger fallback-to-initial-data behavior.

**Impact:** Silent loss of legitimate leads, overwritten admin changes, ambiguous records, inconsistent business state, and possible database reset/rollback behavior.

**Root Cause:** A local demo filesystem store was used as a shared production database without transactional semantics.

**Recommended Fix:** Move to a durable transactional database with UUID/ULID primary keys, uniqueness constraints, optimistic concurrency or transactions, and idempotency keys. If a temporary file store must remain, add process-safe locking/version checks, atomic writes for both files, strict corruption handling, and never silently replace production state with demo data.

**Verification:** Parallel-write tests across multiple processes preserve every record; collision tests pass; stale-version writes return a conflict/retry; corruption causes a fail-safe alert rather than an implicit reset; backup/restore is tested.

---

## F-11

**Severity:** Medium  
**Title:** Security headers and browser isolation policy are absent at application level  
**Mappings:** OWASP A05 Security Misconfiguration; CWE-693, CWE-1021

**Description:** `next.config.mjs` defines no response-header policy. No code configures CSP, HSTS, `X-Content-Type-Options`, frame restrictions, Referrer-Policy, or Permissions-Policy. This materially increases the impact of F-05 and leaves deployment protection dependent on undocumented infrastructure defaults.

**Affected Components:** `next.config.mjs:1-12`; all HTML/API/static responses; Google Analytics and Maps integration policy

**Evidence:** Repository-wide search found none of the named headers or any `headers()` configuration. Uploaded content is served on the same origin without an application-defined `nosniff`/CSP boundary.

**Attack Scenario:** Active uploaded content or a future injection executes with fewer restrictions; pages can be framed where infrastructure does not block it; browser capabilities and referrer data are broader than necessary.

**Impact:** Higher XSS/clickjacking impact, data leakage through referrers, and inconsistent security across hosting environments.

**Root Cause:** Browser security policy was not modeled as part of the application deployment contract.

**Recommended Fix:** Add a tested header policy: CSP with explicit Google/Vercel/Maps allowances and nonces/hashes where needed, `frame-ancestors`, HSTS in HTTPS production, `nosniff`, strict referrer policy, Permissions-Policy, and reduced technology disclosure. Apply stricter download/static rules to untrusted media or isolate it by origin.

**Verification:** Automated header tests and a browser CSP report-only rollout show no unexpected violations; clickjacking test fails to frame protected pages; uploaded active content cannot execute; analytics/maps continue to work through explicit allowlists.

---

## F-12

**Severity:** Medium  
**Title:** Security-relevant actions are not auditable or monitored  
**Mappings:** OWASP A09 Security Logging and Monitoring Failures; CWE-778; STRIDE Repudiation

**Description:** The application records no structured events for login success/failure, rate-limit decisions, session creation/revocation, admin CRUD, settings changes, uploads/deletions, or PII reads. Only a few generic `console.error` calls exist.

**Affected Components:** All API routes; specifically `app/api/admin/*`, `app/api/contact/route.ts:38`, `app/api/consultation/route.ts:36`, `lib/db.ts:143`, `lib/studio-admin-store.ts:82`

**Evidence:** Repository search found no audit logger, request/trace ID, security event schema, alerting integration, or monitoring SDK.

**Attack Scenario:** An attacker brute-forces or uses F-01/F-03 and changes data. Operators have no reliable actor/time/source/target trail and cannot determine scope or trigger timely alerts.

**Impact:** Delayed detection, weak incident response, inability to prove administrative actions, and increased breach dwell time.

**Root Cause:** Logging was treated as error debugging rather than a security control and business audit trail.

**Recommended Fix:** Add centralized structured security logging with request IDs, trusted source context, actor/session identifier, action, object, result, and reason code. Redact credentials, cookies, message bodies, and unnecessary PII. Forward to durable monitoring, alert on brute force/admin anomalies, and define retention/access controls.

**Verification:** Tests assert expected events and redaction; failed/successful auth and each mutation produce correlated entries; alerts trigger in staging; log access and retention are reviewed; injected newline/structured-log payloads cannot forge entries.

---

## F-13

**Severity:** Low  
**Title:** Cookie-authenticated mutations lack explicit Origin/CSRF validation  
**Mappings:** OWASP A01; CWE-352

**Description:** Admin mutation routes rely on the cookie’s `SameSite=Strict` flag and browser CORS defaults. They do not validate `Origin`, Fetch Metadata headers, or a CSRF token. `SameSite=Strict` is a valuable control, but does not cover every same-site sibling-domain/deployment scenario.

**Affected Components:** Cookie-authenticated POST/PUT/DELETE handlers under `app/api/admin/*`; `lib/admin-session.ts:70-78`

**Evidence:** No route or shared guard checks `Origin`, `Sec-Fetch-Site`, or an anti-CSRF value. The admin client sends only cookies and normal content types.

**Attack Scenario:** If an untrusted sibling subdomain is considered same-site, or hosting topology weakens the assumed cookie boundary, it can submit a credentialed simple request to a state-changing endpoint. Current unauthenticated endpoints are already covered by F-03.

**Impact:** Unauthorized admin state changes under deployment-specific preconditions.

**Root Cause:** CSRF defense is implicit and not expressed as a tested server policy.

**Recommended Fix:** Keep `SameSite=Strict`, and add centralized exact-origin/host validation plus Fetch Metadata policy for unsafe methods; use a CSRF token where cross-origin legitimate flows require it. Reject unsupported content types and ensure proxy host headers are trusted correctly.

**Verification:** Cross-origin and same-site-sibling test pages cannot mutate state; missing/mismatched Origin/CSRF values fail; allowed production origins and normal dashboard operations remain functional.

---

## F-14

**Severity:** Low  
**Title:** Dependency resolution is non-reproducible and automated SCA is absent  
**Mappings:** OWASP A06 Vulnerable and Outdated Components; supply-chain control gap

**Description:** Both npm and pnpm lockfiles are present, but they resolve materially different versions and `package.json` declares neither `packageManager` nor engines. There is no audit/update policy or CI security script. Different build systems can therefore ship different dependency graphs and security patch levels.

**Affected Components:** `package.json`, `package-lock.json`, `pnpm-lock.yaml`, CI/CD (not supplied)

**Evidence:** npm resolves, for example, `@base-ui/react 1.8.0`, `lucide-react 1.41.0`, `shadcn 4.21.0`, and `tailwind-merge 3.6.0`; pnpm resolves `1.5.0`, `1.17.0`, `4.19.0`, and `3.4.0` respectively. `packageManager` and `engines` are absent. Scripts contain only `dev`, `build`, and `start`.

**Attack Scenario:** CI, local development, and production use different package managers/graphs. A patched version in one environment does not guarantee the deployed graph is patched, and vulnerable transitive packages can enter without a blocking check.

**Impact:** Supply-chain drift, inconsistent builds, delayed vulnerability detection, and uncertain incident scope.

**Root Cause:** No single reproducible dependency-management and SCA policy was selected.

**Recommended Fix:** Select one package manager and lockfile, pin its version via `packageManager`, define supported Node versions, remove stale lockfiles/dependencies, use frozen-lock installs, and add Dependabot/Renovate plus npm/pnpm audit or an equivalent SCA/SBOM gate with a documented exception policy.

**Verification:** Clean builds on developer/CI/production resolve the same graph hash; frozen-lock install succeeds; SCA/SBOM runs on every change; a deliberately vulnerable test dependency fails the gate; production image contains only required runtime dependencies.

**Dependency advisory note:** No confirmed vulnerable direct Next.js version was identified in this snapshot. Next.js 16.3.3 is the official 2026-08 security release that patches the two critical August issues. Earlier React Server Component DoS fixes were included in Next.js 16.3.0 and later. The standalone vulnerable `react-server-dom-*` packages were not present as lockfile entries. This does not replace a complete connected SCA scan of all 422 lockfile package entries.

---

## F-15

**Severity:** Low  
**Title:** Production builds explicitly ignore TypeScript errors and have no test/typecheck gate  
**Mappings:** OWASP A05 Security Misconfiguration; CWE-693

**Description:** Next.js is configured to build even when TypeScript reports errors, and `package.json` has no typecheck, lint, test, or security-check script. Security-sensitive contract/guard mistakes can therefore reach production without a blocking signal.

**Affected Components:** `next.config.mjs:3-7`; `package.json:6-10`; `tsconfig.json`

**Evidence:** `typescript.ignoreBuildErrors` is `true`. Available scripts are only `dev`, `build`, and `start`.

**Attack Scenario:** A future change breaks an authorization return type, session contract, or validation schema; CI still produces a deployable artifact, hiding the regression.

**Impact:** Increased probability of shipping exploitable regressions and inconsistent runtime behavior.

**Root Cause:** Build availability was prioritized over fail-closed quality/security gates.

**Recommended Fix:** Remove `ignoreBuildErrors`, add explicit typecheck/lint/test/security scripts, and make them required CI checks. Do not weaken strictness to make the build pass; fix or safely isolate genuine errors.

**Verification:** A deliberate type error blocks CI/build; all current code passes the chosen TypeScript version; authorization/validation tests are required; production builds cannot bypass the gate.

---

## F-16

**Severity:** Informational  
**Title:** Careers flow simulates success while discarding the application  
**Mappings:** Business integrity/availability observation; CWE-840 context

**Description:** The careers form does not call a backend. It waits with `setTimeout()`, displays success, and clears the applicant’s data. This is not a direct attacker-controlled vulnerability, but it is a production business-flow integrity problem and creates false assurance to users.

**Affected Components:** `app/careers/page.tsx:78-100` and careers form UI

**Evidence:** The submit handler comment states that feedback is simulated; no careers endpoint, email integration, queue, or persistence exists.

**Attack Scenario:** No attacker is required. A candidate submits an application, receives success, but VIWAN never receives the data. Attackers could also exploit the public claim operationally by encouraging victims to use a nonfunctional channel.

**Impact:** Lost applications, reputational damage, and inability to audit candidate consent/submission. This is informational because it does not independently grant unauthorized access.

**Root Cause:** A prototype interaction was left enabled as a production-looking workflow.

**Recommended Fix:** Either label/disable the flow until operational, or implement a secure server-side submission pipeline with consent, validation, anti-abuse, retention, delivery confirmation, and privacy controls. Do not silently redirect careers PII into the contact database.

**Verification:** End-to-end tests prove successful submissions reach the approved destination exactly once; delivery failure is shown honestly; privacy/retention and abuse controls are tested.

---

# Confirmed Controls / Negative Findings

These checks are included to avoid reporting generic vulnerabilities without evidence:

- **SQL injection:** no SQL database or query builder exists in the audited code; no SQL injection sink was found.
- **Command injection:** no `child_process`, shell execution, `eval`, or `new Function` usage was found.
- **SSRF:** no server-side request uses a user-controlled destination. `mapEmbedUrl` is loaded by the browser, so it is not an SSRF sink.
- **Path traversal:** upload filenames are generated with UUIDs and deletion uses `path.basename`; no demonstrated traversal to arbitrary filesystem paths was found. Upload content validation remains vulnerable under F-05.
- **Text-based XSS:** React escapes stored text, and no user-controlled `dangerouslySetInnerHTML` sink was found. The only such sink interpolates the deployment-controlled GA ID. Active-file XSS is covered by F-05.
- **CORS:** no permissive `Access-Control-Allow-Origin` policy was found.
- **Session-cookie baseline:** `HttpOnly`, production `Secure`, `SameSite=Strict`, `Path=/`, HMAC-SHA256, and `timingSafeEqual` are positive controls.
- **Protected modern admin routes:** projects, team, gallery, upload, site config, and `/api/admin/me` call `getAdminSession()`. The missing routes are specifically listed in F-02/F-03.
- **IDOR/BOLA:** no multi-user/tenant resource ownership model exists. The current failure is missing function-level authorization, not a proven cross-tenant object-ownership bypass.
- **Webhooks/external server integrations:** no webhook receiver or server-side third-party API client was found.
- **Framework version:** Next.js 16.3.3 is the patched August 2026 security release; this review did not falsely flag earlier fixed Next.js CVEs.

---

# Remediation Priority Plan

## P0 — Emergency containment before public deployment (same day)

1. Fix F-01; remove defaults, fail startup, rotate admin password/session key.
2. Disable or protect F-02/F-03 endpoints at the edge immediately; preferably delete unused legacy routes.
3. Remove PII and `.env*` from artifacts; assess whether any artifact was shared and rotate/notify as required (F-07).
4. Temporarily disable uploads or restrict them to a trusted network until F-05 is fixed.

## P1 — Prevent takeover and abuse (1–3 days)

5. Implement one centralized admin authentication/authorization service and route-matrix tests.
6. Add login throttling and security events (F-04/F-12).
7. Add public form schemas, rate limits, body/field bounds, anti-bot controls, and retention limits (F-06).
8. Replace active same-origin uploads with normalized/isolated media storage (F-05).
9. Add revocable session lifecycle and production MFA decision (F-08).

## P2 — Data and business integrity (first sprint)

10. Migrate JSON persistence to a transactional durable database (F-07/F-10).
11. Enforce consultation domain rules and idempotency (F-09).
12. Add CSP/security headers and explicit CSRF/origin policy (F-11/F-13).
13. Add durable, redacted audit logging and alerts (F-12).

## P3 — Supply chain and SDLC hardening (same sprint)

14. Select one package manager/lockfile and add connected SCA/SBOM gating (F-14).
15. Re-enable blocking TypeScript checks and add test/lint/security CI gates (F-15).
16. Replace or clearly disable the simulated careers workflow (F-16).

---

# Phase 2 — Independent Remediation Prompts

Each prompt below is self-contained and ready to send to a coding agent.

## Repair Prompt — F-01

```text
أنت تعمل على مشروع VIWAN المبني بـ Next.js App Router. أصلح Finding F-01: وجود admin credentials افتراضية ومفتاح session قابل للتوقع/مشتق من كلمة المرور.

قبل التعديل: (1) افحص بالكامل app/api/admin/auth/route.ts وapp/api/admin/login/route.ts وlib/admin-session.ts وملفات env/config وكل مستهلك للمصادقة، (2) ارسم data flow والاعتمادات من login إلى cookie إلى جميع admin APIs، (3) نفّذ أقل تغيير آمن يحافظ على السلوك الصحيح، (4) لا تنشئ نظام أمان موازياً ولا تكرر functionality موجودة، (5) التزم بالمعمارية الحالية وClean Architecture وseparation of concerns، (6) لا تعمل hardcode لأي secret/credential/config حساس، (7) أضف/حدّث tests للحالة الطبيعية وحالات الهجوم، (8) ابحث عن نفس النمط في كل المشروع، (9) شغّل build وtypecheck وtests وsecurity checks، (10) اختم بملخص ما تغير ولماذا وما تم اختباره.

المطلوب تحديداً:
- احذف كل fallback لقيم ADMIN_EMAIL وADMIN_PASSWORD وADMIN_SESSION_SECRET.
- أنشئ validation مركزي fail-closed لإعدادات السيرفر؛ production startup يجب أن يفشل إذا كانت القيم مفقودة/ضعيفة.
- اجعل session secret مستقلاً وعالي العشوائية، ولا تستخدم كلمة المرور كمفتاح توقيع.
- وحّد login endpoint واحذف/حوّل endpoint المكرر دون كسر dashboard.
- إن بقي local password auth، خزّن hash قوي (Argon2id أو بديل مناسب) لا كلمة مرور صريحة، أو استخدم مزود auth موثوقاً.
- خطط لتدوير أي credentials/keys قديمة.

Acceptance criteria: القيم الافتراضية القديمة لا تعمل، cookie موقعة بالمفتاح القديم تفشل، غياب secret يمنع التشغيل، وكل admin route لا يعمل إلا بجلسة صحيحة.
```

## Repair Prompt — F-02

```text
أصلح F-02 في VIWAN: كشف contact/consultation PII بدون authentication من GET /api/admin/data وGET /api/contact وGET /api/consultation.

قبل التعديل: (1) افحص handlers وlib/db.ts والـdashboard وكل المستهلكين، (2) افهم data flow وdependencies واحتياجات القراءة الحقيقية، (3) نفّذ أقل تغيير آمن بلا كسر للسلوك، (4) أعد استخدام auth/authorization المركزي ولا تنشئ نظاماً موازياً، (5) حافظ على Clean Architecture وseparation of concerns، (6) لا hardcode أسراراً، (7) أضف tests طبيعية وهجومية، (8) افحص كل GET/collection route مشابه، (9) شغّل build/typecheck/tests/security checks، (10) قدم ملخصاً واضحاً للتغييرات والاختبارات.

احذف طرق GET غير المطلوبة أو احمها بـ requireAdmin افتراضي-deny. طبّق minimum-data DTOs وpagination وCache-Control: private, no-store. اختبر anonymous/no-cookie/forged/expired/valid session، وتأكد أن response غير المصرح لا يحتوي حتى على count أو record metadata.
```

## Repair Prompt — F-03

```text
أصلح F-03: POST /api/admin/settings وPOST /api/admin/inbox يعدلان الحالة بدون authorization.

قبل التعديل: (1) افحص المسارين وكل route إداري وواجهات settings/inbox، (2) افهم تدفق البيانات والـdependencies، (3) استخدم أقل تغيير آمن، (4) لا تنشئ auth موازياً بل استخدم الحارس المركزي، (5) التزم بالمعمارية وClean Architecture، (6) لا hardcode أسراراً أو إعدادات حساسة، (7) أضف tests طبيعية وهجومية، (8) افحص كل endpoint مشابه، (9) شغّل build/typecheck/tests/security checks، (10) لخص ما تغير وما تم اختباره.

حدد أولاً هل المسارات legacy وغير مستخدمة؛ احذفها إن أمكن. وإلا أضف authorization قبل body parsing، strict allowlist schema، enums صحيحة للstatus، وقواعد transition تمنع الحالات غير القانونية، مع audit event لكل تعديل. Acceptance criteria: anonymous/forged requests لا تغير الملف، الحقول الزائدة/الحالات غير المعروفة تُرفض، والعمليات الصحيحة للـadmin تبقى عاملة.
```

## Repair Prompt — F-04

```text
أصلح F-04: غياب rate limiting وanti-brute-force عن admin login مع وجود endpointين متكررين.

قبل التعديل: (1) افحص login/session/proxy/deployment assumptions بالكامل، (2) افهم data flow والـdependencies، (3) نفّذ أقل تغيير آمن، (4) لا تكرر auth functionality، (5) التزم بالمعمارية وseparation of concerns، (6) لا hardcode secrets أو proxy ranges، (7) أضف tests للحالات الطبيعية والهجومية، (8) ابحث عن كل auth endpoint مشابه، (9) شغّل build/typecheck/tests/security checks، (10) قدم ملخصاً واختبارات واضحة.

وحّد endpoint، ثم أضف limiter موزعاً مناسباً للبيئة بمفتاحين: trusted client IP وnormalized+hashed account identifier، مع progressive backoff و429/Retry-After وسياسة bounded lockout ورسائل عامة. لا تثق عشوائياً في X-Forwarded-For؛ وثّق proxy trust حسب منصة النشر. سجّل failures/successes بشكل redacted وأضف تنبيهاً. اختبر التوزيع على أكثر من instance، spoofed headers، reset الصحيح بعد النجاح، وعدم lockout دائم للمستخدم الشرعي.
```

## Repair Prompt — F-05

```text
أصلح F-05: upload pipeline يثق في MIME/extension ويسمح active same-origin content وgallery batches غير محدودة.

قبل التعديل: (1) افحص lib/upload.ts ومساري upload/gallery وكل rendering/deletion/storage flow، (2) افهم data flow والـdependencies، (3) نفّذ أقل تغيير آمن بلا كسر للصور الحالية، (4) لا تنشئ upload system موازياً إذا توجد abstraction قابلة للتقوية، (5) حافظ على Clean Architecture، (6) لا hardcode credentials/bucket secrets، (7) أضف tests طبيعية وهجومية، (8) افحص كل file input/storage path مشابه، (9) شغّل build/typecheck/tests/security/SCA checks، (10) لخص التغييرات والاختبارات.

طبّق allowlist للأنواع المطلوبة، تحقق من magic bytes ومن نجاح decoder، أعد encode للصورة باسم وامتداد مولدين، ارفض SVG/HTML/active formats ما لم توجد sanitization موثوقة، وحدد dimensions/file count/per-file+aggregate bytes. الأفضل نقل untrusted media إلى object storage/origin منفصل مع Content-Type وContent-Disposition وnosniff وquota/lifecycle/malware scan. اختبر MIME spoofing، extension mismatch، SVG script، HTML، polyglot، malformed images، decompression/dimension bombs، many-file batch، valid JPEG/PNG/WebP، والحذف الآمن.
```

## Repair Prompt — F-06

```text
أصلح F-06: public contact/consultation APIs تسمح spam وresource exhaustion وunbounded payloads.

قبل التعديل: (1) افحص /api/contact و/api/public/contact و/api/consultation وlib/db.ts وكل frontend consumer، (2) افهم data flow والـdependencies، (3) نفّذ أقل تغيير آمن، (4) وحّد validation/abuse controls ولا تنشئ أنظمة متكررة، (5) التزم بالمعمارية وseparation of concerns، (6) لا hardcode limits الحساسة إن كانت deployment config، (7) أضف tests طبيعية وهجومية، (8) افحص كل public write endpoint مشابه، (9) شغّل build/typecheck/tests/load/security checks، (10) لخص ما تغير وما تم اختباره.

أنشئ server schemas صارمة للtypes/lengths/enums/email/phone/date، ارفض الحقول الزائدة عند الحاجة، حدّد request body size، أضف distributed rate limiting وhoneypot/bot defense مناسباً مع accessibility، idempotency/duplicate policy، retention/quota، وpersistence لا تعيد كتابة ملف كامل. لا تعتمد على client validation أو CAPTCHA وحده. اختبر boundary values، oversized JSON، bursts، distributed requests، duplicate replay، false positives، وavailability تحت load.
```

## Repair Prompt — F-07

```text
أصلح F-07: تخزين PII في data/*.json وشحنها مع artifact وشحن .env ضمن ZIP.

قبل التعديل: (1) افحص persistence وseed/demo data و.gitignore وpackaging/deployment/backup paths، (2) افهم data lifecycle والـdependencies، (3) نفّذ أقل migration آمن دون فقد بيانات، (4) لا تنشئ قاعدة بيانات موازية بلا خطة انتقال واحدة، (5) التزم بـClean Architecture وفصل repository layer، (6) لا hardcode DB credentials/secrets، (7) أضف tests للقراءة/الكتابة/migration والسيناريوهات الهجومية، (8) افحص كل artifact/data file مشابه، (9) شغّل build/tests/security/secret+PII scans، (10) قدم ملخصاً وخطة migration/rollback واختبارات.

انقل PII إلى managed durable database بصلاحيات least privilege وتشفير وretention/deletion/backups/audit. استخدم synthetic fixtures فقط في المصدر. استبعد .env* وruntime data من repo/artifacts عبر allowlist packaging، واضبط local temp permissions. لا تحذف سجلات حقيقية بلا export/approval. أضف CI secret/PII scan، وافحص history/artifacts السابقة وحدد الحاجة لتدوير أسرار أو incident/privacy handling.
```

## Repair Prompt — F-08

```text
أصلح F-08: admin session stateless لمدة 24 ساعة ولا يمكن revoke/rotate/replay protection.

قبل التعديل: (1) افحص lib/admin-session.ts وكل login/logout/guard consumers، (2) افهم session lifecycle والـdependencies، (3) نفّذ أقل تغيير آمن مع migration للجلسات، (4) لا تنشئ نظام session موازياً، (5) التزم بالمعمارية وseparation of concerns، (6) لا hardcode keys أو TTL حساس، (7) أضف tests طبيعية وهجومية، (8) افحص كل cookie/token مشابه، (9) شغّل build/typecheck/tests/security checks، (10) لخص التصميم والتغييرات والاختبارات.

استخدم opaque random server-side sessions أو token مرتبطاً بسجل session/version قابل للإلغاء. أضف absolute+idle expiry وrotation وrevocation عند logout/password change/incident، واحفظ خصائص cookie الآمنة الحالية مع __Host- prefix إن سمحت البيئة. اختبر stolen-token replay بعد logout، rotation race، expiry، multi-session policy، secret rotation، وsession fixation.
```

## Repair Prompt — F-09

```text
أصلح F-09: تجاوز business rules في consultation scheduling عبر استدعاء API مباشرة.

قبل التعديل: (1) افحص consultation UI/API/data model وأي calendar integration مخطط، (2) افهم data flow والـdependencies، (3) نفّذ أقل تغيير آمن دون كسر UX، (4) اجعل domain rules مصدراً واحداً ولا تكررها، (5) التزم بـClean Architecture، (6) لا hardcode business-sensitive schedules/secrets؛ استخدم config/domain data، (7) أضف tests طبيعية وهجومية، (8) افحص flows مشابهة، (9) شغّل build/tests/security checks، (10) لخص القواعد والتغييرات والاختبارات.

عرّف server-owned enums وقواعد timezone/date/time، ارفض past/invalid/closed values، طبّق idempotency وduplicate policy، وإذا كان الحجز يؤكد capacity فاستخدم transaction/unique constraint و409 conflict. ولّد خيارات الواجهة من contract مشترك. اختبر direct API bypass، malformed dates، timezone boundaries، duplicate concurrent bookings، unsupported project type، والطلب الصحيح.
```

## Repair Prompt — F-10

```text
أصلح F-10: read-modify-write غير transactional على JSON وDate.now IDs قابلة للتصادم.

قبل التعديل: (1) افحص lib/db.ts وlib/studio-admin-store.ts وكل call sites، (2) افهم concurrency/multi-instance data flow، (3) نفّذ أقل migration آمن، (4) لا تنشئ stores متوازية دائمة، (5) استخدم repository abstraction وClean Architecture، (6) لا hardcode DB credentials، (7) أضف concurrency/corruption tests، (8) افحص كل identifier/write path مشابه، (9) شغّل build/tests/load/security checks، (10) قدم ملخصاً وخطة migration/rollback والاختبارات.

انتقل إلى durable transactional DB مع UUID/ULID وunique constraints وtransactions/optimistic locking/idempotency. إن لزم حل مؤقت، طبّق process-safe lock/version checks وatomic writes للملفين، ولا ترجع demo data بصمت عند corruption. اختبر parallel writers عبر processes، stale writes، duplicate IDs، crash mid-write، corruption، backup/restore.
```

## Repair Prompt — F-11

```text
أصلح F-11: غياب CSP وباقي security headers.

قبل التعديل: (1) افحص next.config.mjs وlayout وGA/Vercel Analytics/Maps/uploads وكل external origin، (2) ارسم resource/data flow، (3) نفّذ policy تدريجية بأقل تغيير آمن، (4) لا تكرر header systems بين route/config/platform، (5) التزم بالمعمارية، (6) لا hardcode secrets/nonces، (7) أضف header/browser tests طبيعية وهجومية، (8) افحص كل response/static origin، (9) شغّل build/E2E/security checks، (10) لخص السياسة والاستثناءات والاختبارات.

ابدأ CSP Report-Only ثم enforce باستخدام nonce/hash مناسب للinline GA؛ اسمح فقط بالمصادر المطلوبة. أضف frame-ancestors، HSTS في HTTPS production، X-Content-Type-Options: nosniff، Referrer-Policy، Permissions-Policy، وضوابط منفصلة للmedia غير الموثوقة. اختبر analytics/maps وadmin/public pages، framing، inline script، uploaded active content، وCSP reports.
```

## Repair Prompt — F-12

```text
أصلح F-12: غياب security audit logging/monitoring.

قبل التعديل: (1) افحص كل auth/admin/public-write route وdata model، (2) افهم request/session/data flow، (3) نفّذ أقل تغيير آمن عبر logger مركزي، (4) لا تكرر logging ad hoc، (5) التزم بالمعمارية وseparation of concerns، (6) لا تسجل secrets/cookies/passwords أو PII غير لازمة ولا hardcode sink credentials، (7) أضف tests للأحداث والredaction والهجوم، (8) افحص كل action مشابه، (9) شغّل build/tests/security checks، (10) لخص event schema والتنبيهات والاختبارات.

سجل request ID وactor/session pseudonymous ID وtrusted source وaction/object/result/reason، وأرسل الأحداث إلى durable restricted sink. أضف alerts للbrute force والتغييرات الحساسة والرفع غير الطبيعي. اختبر newline/log injection، redaction، correlation، sink failure، retention/access policy، وعدم تسريب body/credentials.
```

## Repair Prompt — F-13

```text
أصلح F-13: عدم وجود explicit CSRF/Origin policy للعمليات المعتمدة على cookie.

قبل التعديل: (1) افحص cookie settings وكل unsafe admin method وproxy/origin topology، (2) افهم data flow والـdependencies، (3) نفّذ أقل تغيير آمن، (4) ضع policy مركزية لا حراساً متكررة، (5) التزم بالمعمارية، (6) لا hardcode origins الحساسة؛ استخدم validated deployment config، (7) أضف browser/integration tests طبيعية وهجومية، (8) افحص كل cookie-authenticated mutation، (9) شغّل build/tests/security checks، (10) لخص السياسة والاختبارات.

احتفظ بـSameSite=Strict، وأضف exact Origin/Host validation وFetch Metadata policy للunsafe methods، وارفض content types غير المتوقعة. استخدم CSRF token إذا كانت هناك cross-origin flows شرعية. تعامل صحيحاً مع trusted proxy headers. اختبر cross-origin، same-site sibling، missing/null Origin، malformed host، valid production origin، وdashboard regressions.
```

## Repair Prompt — F-14

```text
أصلح F-14: وجود npm/pnpm lockfiles متعارضة وغياب reproducible SCA policy.

قبل التعديل: (1) افحص package.json والlockfiles وCI/deployment/import usage، (2) افهم dependency graph والـdependencies، (3) نفّذ أقل تغيير آمن دون ترقيات عشوائية، (4) لا تنشئ pipelines متكررة، (5) التزم بمعمارية المشروع، (6) لا hardcode registry credentials/tokens، (7) أضف tests/checks لسلسلة التوريد، (8) افحص dependencies غير المستخدمة/transitive risks، (9) شغّل clean frozen install/build/tests/SCA/SBOM، (10) لخص النسخ والتغييرات والنتائج.

اختر package manager واحداً، اضبط packageManager وNode engines، احذف lockfile القديم، استخدم frozen lock، أزل dependencies غير المستخدمة، وأضف Dependabot/Renovate وSCA/SBOM gate وسياسة exceptions. لا تعتبر audit clean إذا تعذر الاتصال؛ fail أو سجّل exception صريحاً. تحقق أن clean environments تنتج graph hash واحداً وأن production يحتوي runtime dependencies فقط.
```

## Repair Prompt — F-15

```text
أصلح F-15: next.config يتجاهل TypeScript build errors ولا توجد quality/security gates.

قبل التعديل: (1) افحص next.config.mjs وtsconfig/package scripts وكل أخطاء البناء الحالية، (2) افهم أثرها على data flow والـdependencies، (3) أصلح بأقل تغيير آمن دون تعطيل functionality، (4) لا تنشئ configs متوازية أو bypass جديداً، (5) التزم بالمعمارية وClean Architecture، (6) لا hardcode config حساس، (7) أضف/حدّث tests للحالة الطبيعية والsecurity regression، (8) افحص كل suppression مشابه، (9) شغّل clean build/typecheck/lint/tests/security checks، (10) لخص ما أصلح وما تم اختباره.

احذف ignoreBuildErrors، أضف scripts واضحة لـtypecheck/lint/test/security، واجعلها required CI gates. لا تخفض strictness لمجرد تمرير البناء. Acceptance criteria: type error متعمد يفشل pipeline، والكود الحالي يمر بدون suppressions واسعة.
```

## Repair Prompt — F-16

```text
عالج F-16: careers form يعرض success بدون إرسال أو حفظ الطلب.

قبل التعديل: (1) افحص careers UX وكل نماذج/قنوات التواصل والخصوصية، (2) افهم data flow والـdependencies، (3) نفّذ أقل تغيير آمن، (4) لا تعيد استخدام contact store بشكل غير مناسب ولا تنشئ pipeline مكرر، (5) التزم بـClean Architecture، (6) لا hardcode mail/API/storage secrets، (7) أضف tests طبيعية وفشل/abuse، (8) افحص كل simulated submission مشابه، (9) شغّل build/tests/security checks، (10) لخص التغييرات والاختبارات.

إما عطّل/وسّم النموذج بوضوح حتى تتوفر القناة، أو نفّذ endpoint وتسليم موثوق مع validation وrate limit وconsent وretention وidempotency وdelivery failure handling. لا تعرض success إلا بعد قبول durable أو acknowledged delivery. اختبر النجاح مرة واحدة، failure الصريح، duplicate، abuse، والخصوصية.
```

---

# Phase 3 — Security Verification / Re-Audit Plan

## 1. Scope freeze and evidence

- Re-audit the exact remediation commit/artifact; record commit ID, SBOM, lockfile hash, image digest, and environment class.
- Confirm all F-01–F-16 changes through code diff and architecture review.
- Verify no new duplicate auth, storage, validation, or upload paths were introduced.

## 2. Authentication and session tests

- Missing/weak environment configuration must fail closed.
- Test former defaults, forged signatures, malformed payloads, expiry boundary, key rotation, logout revocation, credential change, session fixation, replay, idle timeout, and concurrent sessions.
- Test login throttling by IP and normalized account, distributed instances, spoofed forwarding headers, recovery from lockout, and MFA if enabled.

## 3. Authorization route matrix

- Enumerate every route and every exported HTTP method automatically.
- For each admin operation test: no cookie, random cookie, expired/revoked cookie, valid admin, wrong role if roles are added, and method/content-type variants.
- Verify body parsing and side effects never occur before authorization.
- Verify collection reads return no PII to anonymous callers and are `private, no-store`.

## 4. File upload adversarial suite

- MIME/extension mismatch, HTML, scripted SVG, polyglot, malformed/truncated image, oversized bytes, excessive dimensions, decompression bomb, duplicate filename, path tricks, many-file batch, aggregate-size overflow, malware test file where policy permits, and deletion authorization.
- Confirm re-encoding strips active metadata/content.
- Confirm media origin receives no admin cookies and sends strict content headers.

## 5. Public API abuse/load testing

- Schema boundary tests for all fields and unknown properties.
- Burst, sustained, distributed, and low-and-slow rate-limit tests.
- Large body/long string tests before and after parsing.
- Bot/honeypot false-positive and accessibility checks.
- Idempotency/duplicate tests and storage-retention behavior.
- Measure CPU, memory, DB connections, disk/object-storage growth, p95/p99 latency, and recovery.

## 6. Business logic and concurrency

- Past/invalid date, unsupported service/time, timezone/DST boundary, unavailable slot, duplicate booking, and simultaneous reservation tests.
- Parallel writes across multiple application instances; verify no lost update and uniqueness constraints hold.
- Test legal and illegal status transitions for inquiries/consultations.
- Validate rollback, retry, backup restore, and corruption handling.

## 7. Data protection and privacy

- Scan repository, Git history, CI logs, images, Docker layers, source maps, and downloadable artifacts for PII and secrets.
- Verify DB least privilege, encryption at rest/in transit, backup encryption, retention deletion, data export/deletion procedures, and audit access.
- Confirm old credentials are rotated and previously distributed artifacts are revoked/removed where possible.

## 8. Browser security

- Automated assertions for CSP, HSTS, `nosniff`, frame policy, Referrer-Policy, Permissions-Policy, cache headers, and cookie attributes.
- Run CSP report-only telemetry before enforcement, then regression-test GA, Vercel Analytics, Maps, images, admin UI, and print flows.
- Attempt cross-origin and same-site-sibling CSRF under real production domain topology.

## 9. Injection and sink regression

- Repeat repository-wide sink analysis for `dangerouslySetInnerHTML`, URL/script sinks, filesystem paths, server-side `fetch`, SQL/query APIs, shell execution, template rendering, and redirects.
- Re-test text output escaping and URL/protocol allowlists.
- If a real SQL database is introduced, add parameterization tests and database permission review.
- If webhooks/integrations are added, test signatures, replay windows, SSRF, egress allowlists, and secret rotation.

## 10. Dependency and SDLC verification

- Perform connected SCA against the selected frozen lockfile and container/image, generate SBOM, and review critical/high transitive advisories.
- Confirm Next.js remains on a currently supported patched release using official security advisories.
- Run secret scanning, SAST, lint, typecheck, unit/integration/E2E tests, and production build as mandatory CI gates.
- Verify dependency graph reproducibility across local, CI, and production builds.

## 11. Logging and incident readiness

- Confirm login, authorization denial, session revocation, PII read, admin mutation, upload, rate-limit, and validation events are generated and correlated.
- Verify no passwords, cookies, full request bodies, or excess PII are logged.
- Trigger staging alerts and test on-call routing, retention, access control, clock synchronization, and incident playbooks.

## Exit criteria

Production may be reconsidered only when:

1. F-01 through F-07 are verified closed with automated tests and manual abuse testing.
2. No anonymous endpoint discloses PII or performs admin state changes.
3. Uploaded attacker-controlled bytes cannot execute on an authenticated application origin.
4. Sessions are revocable and login/public write flows are throttled.
5. PII is absent from source/release artifacts and stored in a durable protected system.
6. Connected SCA/SBOM, build, typecheck, tests, header checks, and route-authorization matrix all pass.
7. Medium/Low residual risks have an owner, deadline, and documented acceptance approved by the system owner.
