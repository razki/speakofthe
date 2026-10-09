#!/bin/bash
set -euo pipefail

# Candidate preparation and HTTP smoke checks run before this script.
origin_domain=$(terraform -chdir=terraform/runtime output -raw origin_domain)
function_name=$(terraform -chdir=terraform/runtime output -raw function_name)
candidate_version=$(terraform -chdir=terraform/runtime output -raw candidate_version)
alias_name=$(terraform -chdir=terraform/runtime output -raw live_alias_name)
export TF_VAR_application_origin_domain="$origin_domain"

terraform -chdir=terraform init -backend-config=config/prod -input=false
terraform -chdir=terraform plan -input=false -var-file=vars/prod.tfvars -out=edge.tfplan
terraform -chdir=terraform show -json edge.tfplan > .deploy/edge.tfplan.json
node scripts/check-terraform-plan.mjs .deploy/edge.tfplan.json edge

# These outputs are new to the legacy stack, so read their known planned values
# before the first apply rather than assuming they already exist in remote state.
site_bucket=$(node -e 'const p=require("./.deploy/edge.tfplan.json"); const v=p.planned_values.outputs.site_bucket.value; if(!v) process.exit(1); process.stdout.write(v)')
distribution_id=$(node -e 'const p=require("./.deploy/edge.tfplan.json"); const v=p.planned_values.outputs.cloudfront_distribution_id.value; if(!v) process.exit(1); process.stdout.write(v)')
previous_version=$(aws lambda get-alias --function-name "$function_name" --name "$alias_name" --query FunctionVersion --output text)
aws cloudfront get-distribution-config --id "$distribution_id" > .deploy/edge-before.json
node -e 'const fs=require("node:fs"); const before=require("./.deploy/edge-before.json"); fs.writeFileSync(".deploy/edge-rollback.json",JSON.stringify(before.DistributionConfig))'
node -e 'const fs=require("node:fs"); const [function_name,alias_name,previous_version,candidate_version,distribution_id]=process.argv.slice(1); fs.writeFileSync(".deploy/release.json",JSON.stringify({function_name,alias_name,previous_version,candidate_version,distribution_id},null,2))' "$function_name" "$alias_name" "$previous_version" "$candidate_version" "$distribution_id"
printf 'Previous Lambda version: %s\nCandidate Lambda version: %s\n' "$previous_version" "$candidate_version" >> "$GITHUB_STEP_SUMMARY"

mkdir -p .deploy/assets
tar -xzf .deploy/assets.tar.gz -C .deploy/assets
# Never upload .next/server, source code, environment files or the Lambda ZIP to this public bucket.
# No --delete: old hashed assets stay available to visitors with an existing tab.
aws s3 sync .deploy/assets/_next/static "s3://$site_bucket/_next/static" --cache-control 'public,max-age=31536000,immutable' --only-show-errors
aws s3 sync .deploy/assets "s3://$site_bucket" --exclude '_next/*' --exclude 'service-worker.js' --cache-control 'public,max-age=300' --only-show-errors
aws s3 cp .deploy/assets/service-worker.js "s3://$site_bucket/service-worker.js" --content-type 'application/javascript' --cache-control 'no-store' --only-show-errors

rollback_release() {
  failure_status=$?
  trap - ERR
  set +e
  aws lambda update-alias --function-name "$function_name" --name "$alias_name" --function-version "$previous_version" >/dev/null
  alias_status=$?
  current_etag=$(aws cloudfront get-distribution-config --id "$distribution_id" --query ETag --output text)
  aws cloudfront update-distribution --id "$distribution_id" --if-match "$current_etag" --distribution-config file://.deploy/edge-rollback.json >/dev/null
  edge_status=$?
  if [ "$alias_status" -eq 0 ] && [ "$edge_status" -eq 0 ]; then
    aws cloudfront wait distribution-deployed --id "$distribution_id"
    deployment_status=$?
    rollback_invalidation=$(aws cloudfront create-invalidation --distribution-id "$distribution_id" --paths '/*' --query Invalidation.Id --output text)
    invalidation_status=$?
    if [ "$invalidation_status" -eq 0 ]; then
      aws cloudfront wait invalidation-completed --distribution-id "$distribution_id" --id "$rollback_invalidation"
      invalidation_status=$?
    fi
    if [ "$deployment_status" -eq 0 ] && [ "$invalidation_status" -eq 0 ]; then
      echo 'Promotion failed; previous Lambda alias and CloudFront configuration restored and invalidated. Review the failure before retrying.' >&2
    else
      echo 'Rollback configuration submitted, but propagation or invalidation did not finish. Check AWS before retrying.' >&2
    fi
  else
    echo 'Promotion failed and automatic rollback was incomplete. Restore from .deploy/edge-rollback.json and the recorded previous Lambda version.' >&2
  fi
  exit "$failure_status"
}
trap rollback_release ERR
aws lambda update-alias --function-name "$function_name" --name "$alias_name" --function-version "$candidate_version" >/dev/null
terraform -chdir=terraform apply -input=false edge.tfplan
aws cloudfront wait distribution-deployed --id "$distribution_id"
invalidation_id=$(aws cloudfront create-invalidation --distribution-id "$distribution_id" --paths '/*' --query Invalidation.Id --output text)
aws cloudfront wait invalidation-completed --distribution-id "$distribution_id" --id "$invalidation_id"
SMOKE_BASE_URL="$NEXT_PUBLIC_SITE_URL" SMOKE_ORIGIN="$NEXT_PUBLIC_SITE_URL" SMOKE_CANONICAL="$NEXT_PUBLIC_SITE_URL" node scripts/smoke.mjs
trap - ERR
printf 'Production verified: %s\n' "$NEXT_PUBLIC_SITE_URL" >> "$GITHUB_STEP_SUMMARY"
