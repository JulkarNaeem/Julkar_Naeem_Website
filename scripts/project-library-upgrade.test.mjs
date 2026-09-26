import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, resolveJsonModule: true }
  }).outputText;
  module._compile(javascript, filename);
};

const { initialDocument } = require('../lib/cms-model.ts');
const { upgradeProjectLibrary } = require('../lib/project-library-upgrade.ts');
const previous = require('../lib/project-library-previous.json');

function oldDocument() {
  const document = structuredClone(initialDocument);
  document.projects = document.projects.map(project => ({
    ...project,
    ...structuredClone(previous.find(old => old.code === project.code))
  }));
  return document;
}

test('upgrades unchanged CMS defaults to the approved Notion project library', () => {
  assert.deepEqual(upgradeProjectLibrary(oldDocument()), initialDocument);
});

test('preserves owner edits while replacing only prior approved-media URLs', () => {
  const document = oldDocument();
  const project = document.projects.find(item => item.code === '002');
  project.title = 'Owner-edited title';
  project.summary = 'Owner-edited summary';
  project.visibility = 'archived';
  project.images.push({ name: 'Owner photo', url: 'https://example.com/owner-photo.png' });

  const updated = upgradeProjectLibrary(document).projects.find(item => item.code === '002');
  const approved = initialDocument.projects.find(item => item.code === '002');
  assert.equal(updated.title, 'Owner-edited title');
  assert.equal(updated.summary, 'Owner-edited summary');
  assert.equal(updated.visibility, 'archived');
  assert.equal(updated.images.at(-1).url, 'https://example.com/owner-photo.png');
  assert.deepEqual(updated.images.slice(0, -1), approved.images);
  assert.equal(updated.cover, approved.cover);
});

test('updates the previous hero headline while preserving custom CMS copy', () => {
  const document = oldDocument();
  document.settings.heroLead = 'Fabrication-ready steel detailing for teams that need';
  document.settings.heroAccent = 'clear, coordinated deliverables.';
  assert.equal(upgradeProjectLibrary(document).settings.heroLead, 'Clear steel detailing, from model');
  assert.equal(upgradeProjectLibrary(document).settings.heroAccent, 'to fabrication.');

  document.settings.heroLead = 'My custom headline';
  assert.equal(upgradeProjectLibrary(document).settings.heroLead, 'My custom headline');
  assert.equal(upgradeProjectLibrary(document).settings.heroAccent, 'clear, coordinated deliverables.');
});
