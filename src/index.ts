import * as Inquirer from 'inquirer';
import { SemVer } from 'semver';
import * as ReplaceInFile from 'replace-in-file';
import * as fs from 'fs';
import { exec } from 'child_process';

import { BeforeAll } from './checks';
import { VersionPrompt } from './version';
import { ChangelogPrompt } from './changelog';
import { GenerateMarkdown } from './templating';

const prompt = Inquirer.createPromptModule();

let version: SemVer;
let newChangelog: string;

BeforeAll(prompt)
  .then(() => {
    return VersionPrompt(prompt);
  })
  .then((v) => {
    version = v;
    return ChangelogPrompt(prompt);
  })
  .then(changes => {
    const md = GenerateMarkdown(version, changes);
    const buf = fs.readFileSync('./CHANGELOG.md');
<<<<<<< Updated upstream
    console.log(buf.toString());
=======
>>>>>>> Stashed changes
    newChangelog = buf.toString().replace(/# CHANGELOG\n*/g, `# CHANGELOG\n${md}`);
    return prompt({
      type: 'confirm',
      name: 'override',
      message: `Override CHANGELOG.md with:\n${newChangelog}`
    });
  })
  .then((answers: { override: boolean }) => {
    if (answers.override) {
      fs.writeFileSync('./CHANGELOG.md', Buffer.from(newChangelog));
      console.log(`Creating git tag v${version.version}`);
      exec(`git tag v${version.version}`, (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
      });
    } else {
      throw new Error('Aborting process');
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });