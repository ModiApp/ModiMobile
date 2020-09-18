import os
from datetime import datetime


def prompt_user_for_changelog():
    print("If there are notable changes made in this commit, please specify them:")

    changes = []
    change = input("Enter a change: (press enter to enter more, q to stop) ")
    while change != 'q':
        changes.append(change)
        change = input(
            "Enter a change: (press enter to enter more, q to stop) ")

    add_changes_to_changelog(changes)


def add_changes_to_changelog(changes: [str]):
    if len(changes) == 0:
        return

    changelog_path = 'CHANGELOG.md'
    ensure_file_exists(changelog_path)

    previous_content = open(changelog_path, 'r').read()

    with open(changelog_path, 'w') as changelog:
        header = f"### {str(datetime.now()).split('.')[0]}"
        new_content = '\n- ' + '\n- '.join(changes) + '\n'
        footer = '___' + '\n\n'

        changelog.write(header)
        changelog.write(new_content)
        changelog.write(footer)
        changelog.write(previous_content)


def ensure_file_exists(filepath: str):
    if not os.path.exists(filepath):
        open(filepath, 'w').close()


if __name__ == '__main__':
    branch = os.popen('git rev-parse --abbrev-ref HEAD').read().strip()

    if branch == 'master':
        prompt_user_for_changelog()
