#!/bin/bash

function update_secret () {
  echo "Update secret $1 (skip with ctrl-c)"
  npx wrangler secret put "$1"
}

update_secret ARCHIVE_API_HOST
update_secret ARCHIVE_API_SSL