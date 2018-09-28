/**
 * Copyright 2018, Google, Inc.
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

/**
 * This application demonstrates how to perform basic operations on buckets with
 * the Google Cloud Storage API.
 *
 * For more information, see the README.md under /storage and the documentation
 * at https://cloud.google.com/storage/docs.
 */

'use strict';
function setRetentionPolicy(bucketName, retentionReriod) {
  // [START storage_set_retention_policy]
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();
  storage
    .bucket(bucketName)
    .setRetentionPeriod(retentionReriod)
    .then(() => {
      console.log(
        `Bucket ${bucketName} retention period``set for ${retentionReriod} seconds`
      );
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END storage_set_retention_policy]
}

function removeRetentionPolicy(bucketName) {
  // [START storage_remove_retention_policy]
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();
  storage
    .bucket(bucketName)
    .getMetadata()
    .then(metadata => {
      console.log('metadata', metadata);
      // console.log(
      //   'Unable to remove retention period as retention policy is locked.')

      return storage
        .bucket(bucketName)
        .removeRetentionPeriod()
        .then(() => {
          console.log(`Removed bucket ${bucketName} retention policy`);
        });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END storage_remove_retention_policy]
}

function lockRetentionPolicy(bucketName) {
  // [START storage_lock_retention_policy]
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();
  // get_bucket gets the current metageneration value for the bucket,
  // required by lock_retention_policy.
  storage
    .bucket(bucketName)
    .getMetadata()
    .then(metadata => {
      console.log('metadata', metadata);

      // Warning: Once a retention policy is locked it cannot be unlocked
      // and retention period can only be increased.
      return storage
        .bucket(bucketName)
        .lock(metadata.metageneration)
        .then(() => {
          console.log(`Retention policy for ${bucketName} is now locked`);
          // console.log(
          //   `Retention policy effective as of ${bucket.retention_policy_effective_time}`
          // );
        });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END storage_lock_retention_policy]
}

require(`yargs`)
  .demand(1)
  .command(
    `set-retention-policy <bucket> <period>`,
    `Defines a retention policy on a given bucket.`,
    {},
    opts => setRetentionPolicy(opts.bucket, opts.period)
  )
  .example(
    `node $0 set-retention-policy my-bucket 5`,
    `Defines a retention policy of 5 seconds on a "my-bucket".`
  )
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/storage/docs`)
  .help()
  .strict().argv;
