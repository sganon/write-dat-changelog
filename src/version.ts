import { PromptModule, Question } from "inquirer";
import { SemVer, valid, clean } from 'semver';

import { ExecPromise } from './utils';

export const VersionPrompt = async (prompt: PromptModule): Promise<SemVer> => {
  try {
    let stdout = await ExecPromise(`git tag --sort=committerdate | tail -1`)
    let question: Question = {
      name: 'newVersion',
    }
    let verMaj = new SemVer(clean(stdout));
    let verMin = new SemVer(clean(stdout));
    let verPatch = new SemVer(clean(stdout));
    question.choices = [verMaj.inc("major").raw, verMin.inc("minor").raw, verPatch.inc("patch").raw];
    question.type = 'list';
    question.message = 'Which version would you like to update to';

    let { newVersion } = await prompt(question);
    if (!valid(newVersion)) {
      throw new Error(`Version ${newVersion} is not a correct semantic version please refers to: https://semver.org/`);
    }
    return new SemVer(newVersion);
  } catch (e) {
    throw e;
  }
}
