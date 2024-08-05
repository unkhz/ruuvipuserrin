#!/bin/bash

# Function to execute a command and print its output with colorized label prefix
run_command() {
  local label="$1"
  local command="$2"
  local color_code="$3"
  eval "$command" 2>&1 | sed -u "s/^/\x1b[${color_code}m[${label}]\x1b[0m /"
}
export -f run_command

# Trap CTRL+C to kill all background processes
trap 'parallel --halt now,fail=1 kill {}' INT

# Process command-line arguments
if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <label1> <command1> [<label2> <command2> ...]"
  exit 1
fi

# Create arrays for labels, commands, and colors
labels=()
commands=()
colors=()

# Loop through arguments and populate arrays
while [[ $# -gt 0 ]]; do
  labels+=("$1")
  commands+=("$2")
  colors+=($((31 + RANDOM % 7)))
  shift 2
done

# Use parallel to run commands
parallel --halt now,fail=1 --line-buffer --link run_command {1} {2} {3} ::: "${labels[@]}" ::: "${commands[@]}" ::: "${colors[@]}"

echo "All commands finished!"
