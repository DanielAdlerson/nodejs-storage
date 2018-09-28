/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require(`path`);
const {Storage} = require(`@google-cloud/storage`);
const test = require(`ava`);
const tools = require(`@google-cloud/nodejs-repo-tools`);
const uuid = require(`uuid`);

const storage = new Storage();
const cwd = path.join(__dirname, `..`);
const bucketName = `nodejs-storage-samples-${uuid.v4()}`;
const bucket = storage.bucket(bucketName);
const cmd = `node buckets.js`;

test.before(tools.checkCredentials);
test.before(async () => {
  await bucket.create();
});

test.after.always(async () => {
  try {
    await bucket.delete();
  } catch (err) {} // ignore error
});

test.beforeEach(tools.stubConsole);
test.afterEach.always(tools.restoreConsole);

test.serial(`should set a retention policy on a bucket`, async t => {
  const results = await tools.runAsyncWithIO(
    `${cmd} set-retention-policy ${bucketName}`,
    cmd
  );
  t.regex(
    results.stdout + results.stderr,
    new RegExp(`Bucket ${bucketName} created.`)
  );
  const [exists] = await bucket.exists();
  t.true(exists);
});
