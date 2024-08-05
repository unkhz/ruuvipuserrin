#!/bin/bash

# Function to execute a command and print its output with colorized label prefix
run_command() {
  local command="$1"
  local label="$2"
  local color_code=$((31 + $(($RANDOM % 7))))
  # Use a subshell to prefix each line of output with the colorized label
  (
    eval "$command" 2>&1 | while IFS= read -r line; do
      # Use printf instead of echo for reliable escape sequence interpretation
      printf "\e[${color_code}m[%s]\e[0m %s\n" "$label" "$line"
    done
  ) &
}

# Trap CTRL+C to kill all background processes
trap 'kill $(jobs -p); echo "Interrupted by CTRL+C"' INT

# Process command-line arguments
if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <label1> <command1> [<label2> <command2> ...]"
  exit 1
fi

# Use a regular array to store label-color pairs (works on both macOS and Linux)
label_colors=()

# Loop through arguments and run commands in parallel
for i in $(seq 1 2 $#); do
  if [[ $((i % 2)) -eq 1 ]]; then
    label="$1"
    shift
    command="$1"
    shift

    # Assign a color to the label if not already assigned
    color_assigned=false
    for j in "${!label_colors[@]}"; do
      if [[ "${label_colors[$j]}" == "$label" ]]; then
        color_assigned=true
        break
      fi
    done

    if ! $color_assigned; then
      color_code=$((31 + $(($RANDOM % 7))))
      label_colors+=("$label")
      label_colors+=("$color_code")
    fi

    run_command "$command" "$label"
  fi
done

# Wait for all background processes to finish
wait

echo "All commands finished!"