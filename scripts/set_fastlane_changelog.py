with open('CHANGELOG.md') as changelog:
    changelog_lines = changelog.read().splitlines()
    most_recent_changes = changelog_lines[1: changelog_lines.index('___')]

    with open('ios/fastlane/changelog.txt', 'w') as fastlane_changelog:
        fastlane_changelog.write('\n'.join(most_recent_changes))
