import * as fs from 'fs';
import {sync as commandExists} from 'command-exists';

import {PromptModule} from 'inquirer';

const changelogFile = 'CHANGELOG.md';

interface beforeAnswers {
  createFile: boolean;
}

export const BeforeAll = (prompt:PromptModule): Promise<void> => {
  return new Promise((resolve, reject) => {
      if (!commandExists('git')) {
        return reject('Please install git')
      }
      if (!fs.existsSync(changelogFile)) {
        return prompt({
          type: 'confirm',
          name: 'createFile',
          message: `File ${changelogFile} does not exist, would you like to create it`,
        })
        .then((answers: beforeAnswers) => {
          if (answers.createFile) {
            fs.writeFileSync(changelogFile, '# CHANGELOG\n');
            resolve();
          } else {
            return reject(`Please retry after creating file ${changelogFile}`);
          }
        })
        .catch(err => {
          reject(err);
        });
      }
      resolve();
  });
}
