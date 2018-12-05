import { PromptModule, Question } from "inquirer";
import { resolve } from "url";

const recursivePrompt = (prompt: PromptModule, type: string, lines: string[],finished: boolean): Promise<string[]> => {
  return new Promise((resolve, reject)  => {
    if (finished) {
      resolve(lines);
    }
    const firstQ: Question = {
      type: 'confirm',
      name: 'adding',
      message: `Would you like to add a "${type}" line`,
    };
    const secondQ: Question = {
      type: 'input',
      name: 'line',
      message: 'Content of the line:',
    }
    
    return prompt(firstQ)
      .then((answers: {adding: boolean}): Promise<any> => {
        if (!answers.adding) {
          return Promise.resolve();
        } else {
          return prompt(secondQ)
        }
      })
      .then((answers: {line: string;}) => {
        if (answers === undefined) {
          return recursivePrompt(undefined, type, lines, true);
        }
        if (answers.line) {
          lines.push(answers.line);
        }
        return recursivePrompt(prompt, type, lines, false);
      })
      .then(lines => {
        return resolve(lines);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export const ChangelogPrompt = (prompt: PromptModule): Promise<Changelog> => {
  return new Promise((resolve, reject) => {
    let changes: Changelog = {
      Added: [],
      Changed: [],
      Removed: [],
    };
    recursivePrompt(prompt, 'Added', [], false)
    .then(lines => {
      changes.Added = lines;
      return recursivePrompt(prompt, 'Changed', [], false);
    })
    .then(lines => {
      changes.Changed = lines;
      return recursivePrompt(prompt, 'Removed', [], false);
    })
    .then(lines => {
      changes.Removed = lines;
      resolve(changes);
    })
    .catch(err => {
      reject(err);
    });
  });
}

export interface Changelog {
  Added: string[];
  Changed: string[];
  Removed: string[];
}
