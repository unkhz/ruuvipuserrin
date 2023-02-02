#!/bin/bash

set -euo pipefail

dockerfile=$1

if [ ! -f "$dockerfile" ]; then
  echo "Setting up temporalio cluster to run $dockerfile"
  git clone https://github.com/temporalio/docker-compose.git ./dist
fi

docker compose -f $dockerfile pull