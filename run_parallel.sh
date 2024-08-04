#!/bin/bash

# Array to store background process PIDs
pids=()

# Function to kill all child processes
cleanup() {
    echo "Stopping all processes..."
    for pid in "${pids[@]}"; do
        kill -TERM "$pid" 2>/dev/null
    done
    exit 1
}

# Set up trap to catch SIGINT (Ctrl-C) and other termination signals
trap cleanup SIGINT SIGTERM

# Function to run a task and prefix its output while preserving color
run_task() {
    local task_name=$1
    shift
    # Use stdbuf to prevent line buffering and preserve colors
    stdbuf -oL -eL "$@" 2>&1 | sed -u "s/^/[${task_name}] /"
}

# Run tasks in parallel
while (( "$#" )); do
    run_task "$1" $2 &
    pids+=($!)
    shift 2
done

# Wait for all background processes to finish
wait

