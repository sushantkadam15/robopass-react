import { useLayoutEffect, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, generatePassword } from './PasswordGeneratorFunction';

function createResult(settings) {
  try {
    return { value: generatePassword(settings), error: '' };
  } catch (error) {
    return { value: '', error: error.message };
  }
}

export default function PasswordGenApp() {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [result, setResult] = useState(() => createResult(DEFAULT_SETTINGS));
  const [copyStatus, setCopyStatus] = useState('');
  const [copying, setCopying] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const copyVersion = useRef(0);
  const generationCount = useRef(0);
  const outputRef = useRef(null);
  const isPassphrase = settings.mode === 'passphrase';

  useLayoutEffect(() => {
    const element = outputRef.current;
    function resize() {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }
    resize();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(resize);
    observer.observe(element.parentElement);
    return () => observer.disconnect();
  }, [result.value]);

  function regenerate(nextSettings = settings) {
    copyVersion.current += 1;
    setCopying(false);
    setCopyStatus('');
    const next = createResult(nextSettings);
    setResult(next);
    generationCount.current += 1;
    setAnnouncement(next.error ? '' : `New ${nextSettings.mode} generated. Generation ${generationCount.current}.`);
  }

  function updateSettings(changes) {
    const next = { ...settings, ...changes };
    setSettings(next);
    regenerate(next);
  }

  async function copyPassword() {
    const version = ++copyVersion.current;
    setCopying(true);
    setCopyStatus('');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(result.value);
      if (version === copyVersion.current) setCopyStatus('Copied! Paste it into your password manager.');
    } catch {
      if (version === copyVersion.current) {
        setCopyStatus('Could not copy. Select the password above and copy it manually.');
      }
    } finally {
      if (version === copyVersion.current) setCopying(false);
    }
  }

  return (
    <section className="generator" aria-labelledby="generator-heading">
      <div className="generator-heading">
        <span className="eyebrow">YOUR NEXT PASSWORD STARTS HERE</span>
        <h2 id="generator-heading" tabIndex={-1}>Let’s make a good one.</h2>
        <p>Made on your device. Ready in a click.</p>
      </div>
      <fieldset className="mode-picker">
        <legend className="sr-only">Generation mode</legend>
        {['password', 'passphrase'].map((mode) => (
          <label key={mode}>
            <input type="radio" name="mode" value={mode} checked={settings.mode === mode}
              onChange={() => updateSettings({ mode })} />
            <span>{mode === 'password' ? 'Random password' : 'Memorable passphrase'}</span>
          </label>
        ))}
      </fieldset>
      <div className="password-output">
        <label htmlFor="generated-password">{isPassphrase ? 'Your passphrase' : 'Your password'}</label>
        <textarea ref={outputRef} id="generated-password" className="password-value" value={result.value} readOnly
          rows={3} spellCheck={false} autoComplete="off" autoCapitalize="off" autoCorrect="off"
          aria-describedby="password-summary" />
        <p id="password-summary" className="password-summary">
          {result.value ? `${result.value.length} characters${isPassphrase ? ` · ${settings.wordCount} random words` : ''}` : 'No password generated'}
        </p>
      </div>
      <div className="generator-actions">
        <button type="button" className="button button-primary" onClick={() => regenerate()}>
          <span aria-hidden="true">↻</span> Generate {isPassphrase ? 'passphrase' : 'password'}
        </button>
        <button type="button" className="button button-secondary" onClick={copyPassword}
          disabled={!result.value || copying}>
          {copying ? 'Copying…' : 'Copy password'}
        </button>
      </div>
      <div className="feedback">
        {result.error && <p className="error" role="alert">{result.error}</p>}
        <p role="status" aria-label="Generator feedback" aria-live="polite" aria-atomic="true">{copyStatus || announcement}</p>
      </div>
      <fieldset className="settings">
        <legend>Make it yours</legend>
        {isPassphrase ? (
          <>
            <div className="setting-heading">
              <label htmlFor="word-count">Number of words</label>
              <output htmlFor="word-count">{settings.wordCount}</output>
            </div>
            <input id="word-count" type="range" min="4" max="10" value={settings.wordCount}
              onChange={(event) => updateSettings({ wordCount: Number(event.target.value) })} />
            <div className="range-limits" aria-hidden="true"><span>4 words</span><span>10 words</span></div>
            <label className="select-setting" htmlFor="separator">
              Word separator
              <select id="separator" value={settings.separator}
                onChange={(event) => updateSettings({ separator: event.target.value })}>
                <option value="-">Hyphen (-)</option><option value=" ">Space</option>
                <option value=".">Period (.)</option><option value="_">Underscore (_)</option>
              </select>
            </label>
            <p className="setting-help">Six words is a useful starting point. More words add more possible combinations.</p>
          </>
        ) : (
          <>
            <div className="setting-heading">
              <label htmlFor="password-length">Password length</label>
              <output htmlFor="password-length">{settings.length}</output>
            </div>
            <input id="password-length" type="range" min="8" max="128" value={settings.length}
              onChange={(event) => updateSettings({ length: Number(event.target.value) })} />
            <div className="range-limits" aria-hidden="true"><span>8 characters</span><span>128 characters</span></div>
            <p className="setting-help">Use 16 or more characters when the website allows it.</p>
            <div className="character-options">
              {[
                ['uppercase', 'Uppercase', 'A–Z'], ['lowercase', 'Lowercase', 'a–z'],
                ['numbers', 'Numbers', '0–9'], ['symbols', 'Symbols', '!@#'],
              ].map(([key, label, example]) => (
                <label className="checkbox-setting" key={key}>
                  <input type="checkbox" checked={settings[key]}
                    onChange={(event) => updateSettings({ [key]: event.target.checked })} />
                  <span>{label}<small>{example}</small></span>
                </label>
              ))}
            </div>
            <label className="checkbox-setting exclude-option">
              <input type="checkbox" checked={settings.excludeConfusing}
                onChange={(event) => updateSettings({ excludeConfusing: event.target.checked })} />
              <span>Exclude look-alike characters<small>Such as I, l, 1, O, 0 and o</small></span>
            </label>
          </>
        )}
      </fieldset>
      <p className="privacy-note"><span aria-hidden="true">✓</span> Generated locally. Never sent to a server or saved by RoboPass.</p>
    </section>
  );
}
