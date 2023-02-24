#!/bin/bash

function update_secret () {
  echo "Update secret $1 (skip with ctrl-c)"
  gcloud secrets create "$1" 2&>/dev/null
  read -rs SECRET_VALUE && printf '%s' "$SECRET_VALUE"|gcloud secrets versions add "$1" --data-file=-
}

update_secret PG_HOST
update_secret PG_PORT
update_secret PG_DB
update_secret PG_USER
update_secret PG_PASSWORD
update_secret PG_CERT
