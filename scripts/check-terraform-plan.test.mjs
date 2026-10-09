import assert from 'node:assert/strict';
import test from 'node:test';
import { checkPlan } from './check-terraform-plan.mjs';
const plan = (address, type, actions) => ({ resource_changes: [{ address, type, mode: 'managed', change: { actions } }] });
test('edge cutover permits only an in-place update of the existing root distribution', () => {
  assert.deepEqual(checkPlan(plan('aws_cloudfront_distribution.website_cdn_root', 'aws_cloudfront_distribution', ['update']), 'edge'), []);
  for (const actions of [['delete'], ['delete', 'create'], ['create']]) {
    assert.equal(checkPlan(plan('aws_cloudfront_distribution.website_cdn_root', 'aws_cloudfront_distribution', actions), 'edge').length, 1);
  }
  assert.equal(checkPlan(plan('aws_route53_record.website_cdn_root_record', 'aws_route53_record', ['update']), 'edge').length, 1);
  assert.equal(checkPlan(plan('aws_s3_bucket.website_root', 'aws_s3_bucket', ['delete']), 'edge').length, 1);
});
test('runtime permits creation but refuses replacement of persistent resources', () => {
  assert.deepEqual(checkPlan(plan('aws_lambda_function.website', 'aws_lambda_function', ['create']), 'runtime'), []);
  assert.equal(checkPlan(plan('aws_s3_bucket.artifacts', 'aws_s3_bucket', ['delete', 'create']), 'runtime').length, 1);
  assert.equal(checkPlan(plan('aws_lambda_function.website', 'aws_lambda_function', ['delete', 'create']), 'runtime').length, 1);
  assert.deepEqual(checkPlan(plan('aws_lambda_permission.api["preview"]', 'aws_lambda_permission', ['delete', 'create']), 'runtime'), []);
  assert.equal(checkPlan(plan('aws_lambda_permission.api["live"]', 'aws_lambda_permission', ['delete', 'create']), 'runtime').length, 1);
  assert.equal(checkPlan(plan('aws_s3_object.application', 'aws_s3_object', ['delete']), 'runtime').length, 1);
});
