import { PromptModule, Question } from "inquirer";

const recursivePrompt = async (prompt: PromptModule, type: string, lines: string[],finished: boolean): Promise<string[]> => {
  try {
    if (finished) {
      return (lines);
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
    let { adding } = await prompt(firstQ);
    if (!adding) {
      return (lines);
    }
    let { line } = await prompt(secondQ);
    if (line === undefined) {
      await recursivePrompt(undefined, type, lines, true);
    } else {
      if (line) {
        lines.push(line);
      }
      await recursivePrompt(prompt, type, lines, false);
    }
    return lines;
  } catch (e) {
    throw e;
  }
}

export const ChangelogPrompt = async (prompt: PromptModule): Promise<Changelog> => {
  try {
    let changes: Changelog = {
      Added: [],
      Changed: [],
      Removed: [],
    };
    changes.Added = await recursivePrompt(prompt, 'Added', [], false);
    changes.Changed = await recursivePrompt(prompt, 'Changed', [], false);
    changes.Removed = await recursivePrompt(prompt, 'Removed', [], false);
    return changes
  } catch (e) {
    throw e;
  }
}

export interface Changelog {
  Added: string[];
  Changed: string[];
  Removed: string[];
}
