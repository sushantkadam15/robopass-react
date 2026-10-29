import { afterEach, describe, expect, it, vi } from 'vitest';
import words from '../assets/eff-large-wordlist.json';
import { CHARACTER_SETS, DEFAULT_SETTINGS, generatePassword, randomIndex } from './PasswordGeneratorFunction';

afterEach(() => vi.unstubAllGlobals());

describe('secure random selection', () => {
  it('rejects the incomplete interval instead of introducing modulo bias', () => {
    const getRandomValues = vi.fn()
      .mockImplementationOnce((buffer) => { buffer[0] = 2 ** 32 - 1; return buffer; })
      .mockImplementationOnce((buffer) => { buffer[0] = 13; return buffer; });
    vi.stubGlobal('crypto', { getRandomValues });
    expect(randomIndex(10)).toBe(3);
    expect(getRandomValues).toHaveBeenCalledTimes(2);
  });

  it.each([0, -1, 1.5, NaN, Infinity, 2 ** 32 + 1])('rejects invalid selection size %s', (size) => {
    expect(() => randomIndex(size)).toThrow('selection size is invalid');
  });

  it('bounds rejection retries', () => {
    const getRandomValues = vi.fn((buffer) => { buffer[0] = 2 ** 32 - 1; return buffer; });
    vi.stubGlobal('crypto', { getRandomValues });
    expect(() => randomIndex(10)).toThrow('Secure generation failed');
    expect(getRandomValues).toHaveBeenCalledTimes(128);
  });

  it('fails closed without Web Crypto and never falls back to Math.random', () => {
    vi.stubGlobal('crypto', undefined);
    const fallback = vi.spyOn(Math, 'random');
    expect(() => generatePassword()).toThrow('Secure randomness is unavailable');
    expect(fallback).not.toHaveBeenCalled();
  });
});

describe('random passwords', () => {
  const keys = Object.keys(CHARACTER_SETS);
  const combinations = Array.from({ length: 15 }, (_, index) => index + 1);

  it.each(combinations)('honors exact length and selected types for combination %i', (mask) => {
    const selection = Object.fromEntries(keys.map((key, index) => [key, Boolean(mask & (1 << index))]));
    const selected = keys.filter((key) => selection[key]);
    const alphabet = selected.map((key) => CHARACTER_SETS[key]).join('');
    for (const length of [8, 20, 128]) {
      const result = generatePassword({ ...DEFAULT_SETTINGS, ...selection, length });
      expect(result).toHaveLength(length);
      expect([...result].every((character) => alphabet.includes(character))).toBe(true);
      for (const key of selected) {
        expect([...result].some((character) => CHARACTER_SETS[key].includes(character))).toBe(true);
      }
    }
  });

  it('excludes look-alike characters', () => {
    for (let i = 0; i < 20; i += 1) {
      expect(generatePassword({ ...DEFAULT_SETTINGS, length: 128, excludeConfusing: true }))
        .not.toMatch(/[Il1O0o|]/);
    }
  });

  it.each([7, 129, 0, -1, 8.5, NaN, Infinity, '20'])('rejects invalid length %s', (length) => {
    expect(() => generatePassword({ ...DEFAULT_SETTINGS, length })).toThrow('between 8 and 128');
  });

  it('rejects empty character selections', () => {
    const selection = Object.fromEntries(keys.map((key) => [key, false]));
    expect(() => generatePassword({ ...DEFAULT_SETTINGS, ...selection })).toThrow('at least one');
  });

  it('bounds attempts to satisfy character requirements', () => {
    vi.stubGlobal('crypto', { getRandomValues: (buffer) => { buffer[0] = 0; return buffer; } });
    expect(() => generatePassword()).toThrow('Could not satisfy those settings');
  });

  it('rejects unknown modes', () => {
    expect(() => generatePassword({ ...DEFAULT_SETTINGS, mode: 'unknown' })).toThrow('supported generation mode');
  });
});

describe('memorable passphrases', () => {
  it('uses a large unique dictionary with unambiguous separators', () => {
    expect(words).toHaveLength(7775);
    expect(new Set(words).size).toBe(words.length);
    expect(words.every((word) => /^[a-z]+$/.test(word))).toBe(true);
  });

  it.each(['-', ' ', '.', '_'])('honors word count and separator %j', (separator) => {
    for (const wordCount of [4, 6, 10]) {
      const phrase = generatePassword({ mode: 'passphrase', wordCount, separator });
      const selected = phrase.split(separator);
      expect(selected).toHaveLength(wordCount);
      expect(selected.every((word) => words.includes(word))).toBe(true);
    }
  });

  it.each([0, 3, 11, 4.5, NaN, '6'])('rejects invalid word count %s', (wordCount) => {
    expect(() => generatePassword({ mode: 'passphrase', wordCount, separator: '-' })).toThrow('between 4 and 10');
  });

  it('rejects ambiguous or unsupported separators', () => {
    expect(() => generatePassword({ mode: 'passphrase', wordCount: 6, separator: '' })).toThrow('supported word separator');
  });
});
