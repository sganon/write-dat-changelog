import * as fs from 'fs';
import * as Inquirer from 'inquirer';

import { ExecPromise } from './utils';
import { BeforeAll } from './checks';
import { VersionPrompt } from './version';
import { ChangelogPrompt } from './changelog';
import { GenerateMarkdown } from './templating';

(async () => {
  try {
    const prompt = Inquirer.createPromptModule();

    // performs some checks and creates changelog if does not exist 
    await BeforeAll(prompt);
    // asks for desired new version
    let version = await VersionPrompt(prompt);
    // asks for changelog content
    let changes = await ChangelogPrompt(prompt);

    // generates and writes new changelog
    const md = GenerateMarkdown(version, changes);
    const buf = fs.readFileSync('./CHANGELOG.md');
    let newChangelog = buf.toString().replace(/# CHANGELOG\n*/g, `# CHANGELOG\n${md}`);
    // asks confirmation before writing new changelog
    let { override } = await prompt({
      type: 'confirm',
      name: 'override',
      message: `Override CHANGELOG.md with:\n${newChangelog}`,
    })
    if (!override) {
      throw new Error('Aborting process');
    }

    fs.writeFileSync('./CHANGELOG.md', Buffer.from(newChangelog));
    console.log(`Creating git tag v${version.version} on new commit`);
    await ExecPromise(`git commit --allow-empty -m "release: v${version}"`);
    await ExecPromise(`git tag v${version.version}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
