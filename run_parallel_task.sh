#!/bin/bash

tasks=($@)
args=()
for task in "${tasks[@]}"; do
  args+=("$task" "task $task")
done
./run_parallel.sh "${args[@]}"
