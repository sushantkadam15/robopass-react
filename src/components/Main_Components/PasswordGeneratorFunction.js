import words from '../assets/eff-large-wordlist.json';

export const DEFAULT_SETTINGS = Object.freeze({
  mode: 'password', length: 20,
  uppercase: true, lowercase: true, numbers: true, symbols: true,
  excludeConfusing: false, wordCount: 6, separator: '-',
});

export const CHARACTER_SETS = Object.freeze({
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
});

const UINT32_RANGE = 2 ** 32;
const MAX_ATTEMPTS = 128;
const CONFUSING = /[Il1O0o|]/g;

// Discard the incomplete interval so every allowed index is equally likely.
export function randomIndex(size) {
  if (!Number.isInteger(size) || size < 1 || size > UINT32_RANGE) {
    throw new Error('The random selection size is invalid.');
  }
  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Secure randomness is unavailable. Use an up-to-date browser over HTTPS.');
  }
  const limit = UINT32_RANGE - (UINT32_RANGE % size);
  const buffer = new Uint32Array(1);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    globalThis.crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % size;
  }
  throw new Error('Secure generation failed. Please try again.');
}

export function generatePassword(settings = DEFAULT_SETTINGS) {
  if (settings.mode === 'passphrase') {
    if (!Number.isInteger(settings.wordCount) || settings.wordCount < 4 || settings.wordCount > 10) {
      throw new Error('Choose between 4 and 10 words.');
    }
    if (!['-', ' ', '.', '_'].includes(settings.separator)) {
      throw new Error('Choose a supported word separator.');
    }
    return Array.from({ length: settings.wordCount }, () => words[randomIndex(words.length)])
      .join(settings.separator);
  }
  if (settings.mode !== 'password') throw new Error('Choose a supported generation mode.');
  if (!Number.isInteger(settings.length) || settings.length < 8 || settings.length > 128) {
    throw new Error('Choose a length between 8 and 128 characters.');
  }
  const groups = Object.entries(CHARACTER_SETS)
    .filter(([key]) => settings[key])
    .map(([, characters]) => settings.excludeConfusing ? characters.replace(CONFUSING, '') : characters);
  if (groups.length === 0) throw new Error('Select at least one character type.');
  const alphabet = groups.join('');

  // Sample full candidates, then require each chosen type. This avoids fixed
  // character positions and keeps accepted passwords uniformly distributed.
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const candidate = Array.from({ length: settings.length }, () => alphabet[randomIndex(alphabet.length)]).join('');
    if (groups.every((group) => [...candidate].some((character) => group.includes(character)))) {
      return candidate;
    }
  }
  throw new Error('Could not satisfy those settings. Please try again.');
}
