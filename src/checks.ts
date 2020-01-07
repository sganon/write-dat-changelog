import * as fs from 'fs';
import {sync as commandExists} from 'command-exists';

import {PromptModule} from 'inquirer';

const changelogFile = 'CHANGELOG.md';

interface beforeAnswers {
  createFile: boolean;
}

export const BeforeAll = async (prompt:PromptModule): Promise<void> => {
  try {
    if (!commandExists('git')) {
      throw new Error('git is not installed');
    }
    if (!fs.existsSync(changelogFile)) {
      let answers: beforeAnswers = await prompt({
        type: 'confirm',
        name: 'createFile',
        message: `File ${changelogFile} does not exist, would you like to create it`,
      });

      if (answers.createFile) {
        fs.writeFileSync(changelogFile, '# CHANGELOG\n');
      } else {
        throw new Error('Cannot continue without CHANGELOG.md');
      }
    }
  } catch (e) {
    throw e;
  }
}
