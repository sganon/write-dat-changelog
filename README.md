# write-dat-changelog
CLI to help creation of your changelog and release tags

## Usage

This CLI provide steps to help you fill your CHANGELOG.md.
You'll need to execute CLI at the root of your git repo. It will then proceed with theses steps:

1. Checks if file `CHANGELOG.md` exists, if not it will prompt you to create it, if you answer no the process will stop.

2. Tries to fetch latest git tag to propose you the three possible version update (major,minor,patch). If there's no git tag you'll need to manually give your version, it need to be sem-ver compliant.

3. It will prompt your for lines to add to changelog, lines are grouped in three category **Added**, **Changed**, and **Removed** (in that order). First you are prompt if you want to add a line in this category, answer yes and you can type the line content, after each content fillng you are again prompt if you want to add a line in the same category, continue to answer yes if you want to add other lines to this category. The first no answer to this question will pass in to the othe category.

4. A preview of the new changelog will be shown to you and you are prompt to confirm override.

5. A git tag of the form v0.0.0 (the semver you choose) is created.
