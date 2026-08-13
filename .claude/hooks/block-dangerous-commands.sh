#!/bin/bash
# block-dangerous-commands.sh
# Denies destructive shell commands. Registered as a PreToolUse hook on Bash.
# Returns a JSON permission decision on exit 0 instead of using exit 2,
# so Claude receives a structured reason it can act on.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS=(
  'rm -rf /'
  'rm -rf ~'
  'git push --force'
  'git reset --hard'
  'DROP DATABASE'
  'DROP TABLE'
  'TRUNCATE'
)

# Lowercase once so the comparison below is case-insensitive
COMMAND_LC=$(printf '%s' "$COMMAND" | tr '[:upper:]' '[:lower:]')

for pattern in "${DANGEROUS[@]}"; do
  pattern_lc=$(printf '%s' "$pattern" | tr '[:upper:]' '[:lower:]')
  if [[ "$COMMAND_LC" == *"$pattern_lc"* ]]; then
    jq -n --arg p "$pattern" '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: ("Blocked by project hook: command matches \($p). Ask the user to run it manually if it is genuinely required.")
      }
    }'
    exit 0
  fi
done

# No decision: the normal permission flow applies.
exit 0
