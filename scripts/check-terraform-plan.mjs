import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function checkPlan(plan, mode) {
  const problems = [];
  for (const resource of plan.resource_changes || []) {
    if (resource.mode === 'data') continue;
    const actions = resource.change?.actions || [];
    if (actions.every(action => action === 'no-op' || action === 'read')) continue;
    if (mode === 'edge') {
      if (resource.address !== 'aws_cloudfront_distribution.website_cdn_root' || actions.length !== 1 || actions[0] !== 'update') {
        problems.push(`${resource.address}: ${actions.join(',')}`);
      }
    } else if (actions.includes('delete')) {
      // A candidate's version-scoped invoke permission is recreated each release.
      // Artifact objects are content-addressed and stored in a versioned private bucket.
      const disposableReleaseResource = actions.includes('create') && [
        'aws_s3_object.application',
        'aws_lambda_permission.api["preview"]',
      ].includes(resource.address);
      if (!disposableReleaseResource) problems.push(`${resource.address}: ${actions.join(',')}`);
    }
  }
  return problems;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [file, mode] = process.argv.slice(2);
  if (!file || !['edge', 'runtime'].includes(mode)) throw new Error('Usage: check-terraform-plan.mjs PLAN.json edge|runtime');
  const problems = checkPlan(JSON.parse(await readFile(file, 'utf8')), mode);
  if (problems.length) throw new Error(`Unreviewed infrastructure changes blocked:\n${problems.join('\n')}`);
  console.log(`${mode} plan passed the replacement/deletion guard.`);
}
