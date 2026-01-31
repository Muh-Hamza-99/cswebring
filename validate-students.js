#!/usr/bin/env node
/**
 * Validates students.json:
 * - Required fields: name, website, year, about
 * - about length <= 50 characters
 * - website is a valid http/https URL
 * - year is a valid year (integer in reasonable range, can be future)
 * - If base file path is provided (CI): at most one new row compared to base
 */

const fs = require('fs');
const path = require('path');

const ABOUT_MAX_LENGTH = 50;
const REQUIRED_FIELDS = ['name', 'website', 'year', 'about'];
const YEAR_MIN = 2000;
const YEAR_MAX = 2100;

function isValidUrl(s) {
  if (typeof s !== 'string' || !s.trim()) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidYear(y) {
  if (typeof y !== 'number' || !Number.isInteger(y)) return false;
  return y >= YEAR_MIN && y <= YEAR_MAX;
}

function loadJson(filePath) {
  const full = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(full)) {
    console.error('File not found:', full);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.error('Invalid JSON in', filePath, ':', e.message);
    process.exit(1);
  }
}

function validateEntries(students, fileLabel) {
  if (!Array.isArray(students)) {
    console.error(fileLabel, 'must be a JSON array');
    process.exit(1);
  }
  let failed = false;
  students.forEach((entry, i) => {
    for (const field of REQUIRED_FIELDS) {
      if (entry[field] === undefined || entry[field] === null) {
        console.error(fileLabel, `entry ${i + 1}: missing required field "${field}"`);
        failed = true;
      }
    }
    if (typeof entry.about === 'string' && entry.about.length > ABOUT_MAX_LENGTH) {
      console.error(
        fileLabel,
        `entry ${i + 1} (${entry.name}): "about" must be ≤ ${ABOUT_MAX_LENGTH} characters (got ${entry.about.length})`
      );
      failed = true;
    }
    if (entry.website !== undefined && !isValidUrl(entry.website)) {
      console.error(
        fileLabel,
        `entry ${i + 1} (${entry.name}): "website" must be a valid http or https URL`
      );
      failed = true;
    }
    if (entry.year !== undefined && !isValidYear(entry.year)) {
      console.error(
        fileLabel,
        `entry ${i + 1} (${entry.name}): "year" must be an integer between ${YEAR_MIN} and ${YEAR_MAX}`
      );
      failed = true;
    }
  });
  if (failed) process.exit(1);
}

const studentsPath = process.argv[2] || 'students.json';
const basePath = process.argv[3]; // optional: base branch's students.json (e.g. in CI)

const students = loadJson(studentsPath);
validateEntries(students, 'students.json');

if (basePath) {
  const base = loadJson(basePath);
  if (!Array.isArray(base)) {
    console.error('Base file must be a JSON array');
    process.exit(1);
  }
  const added = students.length - base.length;
  if (added > 1) {
    console.error(
      `PR adds ${added} rows. Only one new row is allowed per PR.`
    );
    process.exit(1);
  }
  if (added < 0) {
    console.error('PR must not remove existing rows.');
    process.exit(1);
  }
}

console.log('Validation passed.');
