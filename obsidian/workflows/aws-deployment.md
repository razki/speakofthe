---
tags: [workflow, deployment, aws]
updated: 2026-10-09
---

# AWS deployment

The replacement is prepared locally; **no AWS deployment or live Terraform plan
has been run**. The owner confirmed that AWS keys already live in GitHub and
selected those credentials for deployment. No AWS access checks or credential
inspection are requested. Local validation does not establish live state or
cutover results.

## Runtime and existing infrastructure

Next 16.2.0 standalone output runs on Node 22 through the Lambda Web Adapter
ZIP layer. The runtime stack creates a private, versioned release bucket, Lambda,
its execution role/log group and two HTTP APIs in `eu-central-1`. The preview API
invokes the published candidate version; the live API invokes the stable `live`
alias. Subsequent runtime applies leave the alias version for explicit promotion.

The existing CloudFront distribution, S3 website/redirect/log buckets, ACM and
Route 53 records remain. Production switches only the root distribution's
application behavior to the live HTTP API: HTML, RSC, metadata and API requests
bypass caching; `_next/static/*` and `assets/*` use the existing S3 origin.
Canonical URLs remain `https://speakofthe.com`; the existing www redirect remains.

`terraform/` retains AWS provider `~> 3.35.0` and state key
`static/configuration/speakofthe`. `terraform/runtime/` uses provider `6.20.0`
and separate key `runtime/speakofthe`. Both use the existing S3 state bucket and
DynamoDB lock table. CI pins Terraform **1.13.5**; do not merge these states or
upgrade the legacy provider as part of this cutover.

## GitHub deployment configuration

- Use Node **22**, Yarn **1.22.22** and the committed lockfile. CI builds the
  Lambda ZIP on Linux; Windows `--stage-only` output is only a local smoke aid.
- Configure the GitHub `production` environment; required reviewers are
  recommended before enabling deployment. `CONTACT_EMAIL` is a required
  environment secret, supplied to Terraform as `TF_VAR_contact_email` and then
  to Lambda at runtime. Build/local CI smoke uses a dummy address, never the real
  value. Terraform state and saved plans contain this sensitive runtime value.
- The selected approach uses the existing GitHub `AWS_ACCESS_KEY_ID` and
  `AWS_SECRET_ACCESS_KEY` secrets; leave `AWS_DEPLOY_ROLE_ARN` unset for that
  workflow path. No local AWS profile, credential retrieval or access preflight
  is needed for this preparation. OIDC remains an optional future alternative
  using `AWS_DEPLOY_ROLE_ARN` with a configured repository/environment trust.
- Deployment uses access to the existing S3/DynamoDB state, runtime Lambda/API/IAM
  resources (including passing the runtime role), logs, private release artifacts,
  static S3 uploads and CloudFront updates/invalidations, plus legacy-plan reads.
  These are the workflow's requirements, not a claim of live permission testing.

The old stack was built with Terraform 0.14; CI now uses 1.13.5. Preserve a secure
pre-upgrade state backup/object version before a deployment writes upgraded state.
Keep lineage, backend key and locking. A newer state format may not be readable
by the former Terraform version. Normal CI uses the existing backend; do not
replace state with an empty file or use `init -migrate-state`, `state push` or
`force-unlock` as generic error fixes. No remote-state inspection or backup
operation has been performed during this local preparation.

## Candidate first, then production

`.github/workflows/deploy.yml` validates pull requests and pushes to `master` or
`codex/**`. Automatic AWS promotion occurs only for a push to **master** when
repository variable `AWS_DEPLOY_ENABLED` is exactly `true`. Leave it unset while
preparing the migration. Manual dispatch offers `validate`, `runtime` and
`production`; production dispatch is restricted to master.

1. Run validation on the replacement branch: lint, deployment tests, Next build,
   Linux ZIP packaging, standalone smoke and backend-disabled validation of both
   Terraform stacks. Preserve the state backup when carrying out the upgrade.
2. Dispatch **runtime** on the reviewed branch. This creates/updates the candidate
   runtime without changing the public distribution. The workflow guards and
   applies the runtime plan, then tests its preview HTTP API using the canonical
   Origin header. Verify pages, assets, crawler routing and contact reveal.
3. After candidate review, merge to **master** and dispatch **production** (or
   deliberately enable automatic deployment). A fresh candidate must pass again.
   The edge plan guard permits only an in-place update of
   `aws_cloudfront_distribution.website_cdn_root`; unexpected resource changes,
   replacements or deletion block promotion. Inspect the actual authorized plan;
   the guard cannot establish that account state matches this checkout.
4. Promotion uploads static assets without `--delete`, retains old hashed assets,
   moves the live alias, applies the guarded edge plan, waits for CloudFront,
   invalidates its cache and smoke-tests the canonical site. No DNS change or
   bucket destruction is part of this release.

## Packaging, recovery and script catalog

| File | Responsibility |
|------|----------------|
| `scripts/package-lambda.mjs` | Creates `.deploy/function.zip` and `assets.tar.gz`; copies standalone, `public` and `.next/static`, excludes every `.env*`, and bounds runtime size. The ZIP belongs only in the private release bucket. |
| `scripts/lambda-run.sh` | Starts Node on the adapter port and prepares writable `/tmp/next-cache`. |
| `scripts/check-terraform-plan.mjs` | Blocks unexpected edge mutations and destructive runtime changes; release artifact/permission replacements are the narrow runtime exceptions. |
| `scripts/smoke.mjs` | Checks routes/canonicals, human/robot HTML, `/contact` redirect, worker headers, chunks, video byte ranges and reveal responses without printing the address. |
| `scripts/promote.sh` | Promotes the verified candidate and performs edge cutover, invalidation, final smoke and failure recovery. |
| `public/service-worker.js` | Retires the legacy CRA worker at its exact URL: skip waiting, delete only scoped CRA/Workbox precaches, unregister and refresh already-controlled same-origin windows. No fetch handler or new registration. |

Before alias/edge changes, promotion saves `.deploy/edge-before.json` (the full
CloudFront configuration and ETag), `edge-rollback.json` (configuration only) and
`release.json` (function, alias, previous/candidate versions and distribution).
On promotion failure it restores the previous alias and distribution config using
a fresh ETag, then checks propagation/invalidation results. It reports incomplete
recovery explicitly; do not assume the rollback succeeded from job failure alone.
A failure-only GitHub artifact retains these three recovery files for seven days;
it excludes Terraform plans and secret-bearing state. Static uploads are retained.
Keep recovery evidence private; `.deploy` is ignored by Git. Never
upload source, `.next/server`, environment files, state/plans or the Lambda ZIP
to the public website bucket. If failure requires manual recovery, use the saved
previous Lambda version and CloudFront configuration, then reconcile Terraform's
view with the real distribution before retrying. Do not erase state to hide drift.

The cleanup worker is served with `Cache-Control: no-store`; the deployment
uploads its S3 copy with the same header. It preserves unrelated caches and does
not claim new visitors. Keep this compatibility URL available for returning
visitors after replacing CRA.

## Validation and references

Final local checks pass: 12 deployment tests, lint, Next production build,
Terraform formatting/backend-disabled validation of both stacks, actionlint
1.7.12 and Bash syntax. The staged standalone runtime is about 22 MiB. Its full
HTTP smoke on port 3004 passed, including RSC content type, pages/canonicals,
robot routing, video 206 byte ranges, worker no-store and contact 400/403/405
behavior; the revealed address was absent from initial HTML. These are local
results, not an AWS runtime, permission or live-plan validation. AWS deployment remains pending; branch validation does not access AWS.

The packaging follows the [official Lambda Web Adapter Next ZIP example](https://github.com/aws/aws-lambda-web-adapter/tree/main/examples/nextjs-zip)
and [Next standalone output guidance](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
See [[environment-variables]], [[api-architecture]] and [[decisions-log]] ADR-0018.
