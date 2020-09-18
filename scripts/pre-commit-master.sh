#/bin/sh


branch=$(git rev-parse --abbrev-ref HEAD)
echo branch is "$branch"
if [ "$branch" = "master" ]; then
  exec < /dev/tty
  python3 ./scripts/prompt_changes_for_changelog.py
  exec <&-
  git add CHANGELOG.md
fi
