#!/bin/bash

function update_secret () {
  echo "Update secret $1 (skip with ctrl-c)"
  npx wrangler secret put "$1"
}

update_secret ARCHIVE_API_HOST
update_secret ARCHIVE_API_SSL
update_secret ARCHIVE_CLIENT_GCLOUD_SCOPE
update_secret ARCHIVE_CLIENT_GCLOUD_CREDENTIALS