#/bin/sh


branch=$(git rev-parse --abbrev-ref HEAD)
echo branch is "$branch"
if [ "$branch" = "master" ]; then
  exec < /dev/tty
  python3 ./scripts/prompt_changes_for_changelog.py
  exec <&-
  python3 ./scripts/set_fastlane_changelog.py
  git add CHANGELOG.md
  git add ios/fastlane/changelog.txt
fi
