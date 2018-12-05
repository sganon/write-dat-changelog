import {Changelog} from './changelog';
import * as Handlebars from 'handlebars';
import { SemVer } from 'semver';

const templateSrc = `
## {{version}} - {{date}}

{{#each changes}}
{{#if this.length}}
### {{@key}}
{{#each this}}
* {{this}}
{{/each}}

{{/if}}
{{/each}}
`

export const GenerateMarkdown = (version: SemVer, changes: Changelog): string => {
  const template = Handlebars.compile(templateSrc);
  let md = template({
    version,
    changes,
    date: new Date().toISOString().slice(0,10),
  });
  return md;
}