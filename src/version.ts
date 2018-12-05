import { exec } from 'child_process';
import { PromptModule, Question } from "inquirer";
import { cpus } from 'os';
import { SemVer, valid } from 'semver';

export const VersionPrompt = (prompt: PromptModule): Promise<SemVer> => {
  return new Promise((resolve, reject) => {
    exec('git describe --tags', (err, stdout, stderr) => {
      let question: Question = {
        name: 'newVersion',
      }
      if (!err) {
        let verMaj = new SemVer(stdout);
        let verMin = new SemVer(stdout);
        let verPatch = new SemVer(stdout);
        question.choices = [verMaj.inc("major").raw, verMin.inc("minor").raw, verPatch.inc("patch").raw];
        question.type = 'choice';
        question.message = 'Which version would you like to update to';
      } else {
        question.type = 'input';
        question.message = 'We were unable to detect previous version, please set new version manually:';
      }
      prompt(question)
      .then((answers: versionAnswers) => {
        if (!valid(answers.newVersion)) {
          return reject(`Version ${answers.newVersion} is not a correct semantic version please refers to: https://semver.org/`);
        }
        resolve(new SemVer(answers.newVersion));
      })
      .catch(err => {
        reject(err);
      });
    });
  });
}

interface versionAnswers {
  newVersion: string;
}