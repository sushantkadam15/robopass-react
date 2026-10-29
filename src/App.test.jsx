import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

const passwordField = () => screen.getByRole('textbox', { name: 'Your password' });
const feedback = () => screen.getByRole('status', { name: 'Generator feedback' });

describe('RoboPass user flow', () => {
  it('starts with a read-only 20-character password and usable defaults', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Small robot.');
    expect(passwordField().value).toHaveLength(20);
    expect(passwordField()).toHaveAttribute('readonly');
    expect(screen.getByRole('radio', { name: 'Random password' })).toBeChecked();
    expect(screen.getByRole('slider', { name: 'Password length' })).toHaveValue('20');
  });

  it('generates a password with keyboard activation', async () => {
    const user = userEvent.setup();
    render(<App />);
    screen.getByRole('button', { name: 'Generate password' }).focus();
    await user.keyboard(' ');
    expect(passwordField().value).toHaveLength(20);
    expect(feedback()).toHaveTextContent('New password generated.');
  });

  it('shows validation and recovers when a character type is selected again', async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const name of [/Uppercase/, /Lowercase/, /Numbers/, /Symbols/]) {
      await user.click(screen.getByRole('checkbox', { name }));
    }
    expect(screen.getByRole('alert')).toHaveTextContent('Select at least one character type.');
    expect(passwordField()).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Copy password' })).toBeDisabled();
    await user.click(screen.getByRole('checkbox', { name: /Numbers/ }));
    expect(passwordField().value).toMatch(/^\d{20}$/);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('switches to passphrases and applies separators', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('radio', { name: 'Memorable passphrase' }));
    const phrase = screen.getByRole('textbox', { name: 'Your passphrase' });
    expect(phrase.value.split('-')).toHaveLength(6);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Word separator' }), ' ');
    expect(phrase.value.split(' ')).toHaveLength(6);
    expect(screen.queryByRole('slider', { name: 'Password length' })).not.toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Number of words' })).toHaveValue('6');
  });

  it('waits for successful clipboard writing and resets feedback on generation', async () => {
    const user = userEvent.setup();
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockReturnValue(pending);
    render(<App />);
    const value = passwordField().value;
    await user.click(screen.getByRole('button', { name: 'Copy password' }));
    expect(write).toHaveBeenCalledWith(value);
    expect(screen.getByRole('button', { name: 'Copying…' })).toBeDisabled();
    expect(feedback()).not.toHaveTextContent('Copied!');
    await act(async () => { finish(); await pending; });
    expect(feedback()).toHaveTextContent('Copied!');
    await user.click(screen.getByRole('button', { name: 'Generate password' }));
    expect(feedback()).not.toHaveTextContent('Copied!');
  });

  it('provides a manual fallback when clipboard permission is denied', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'));
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Copy password' }));
    expect(feedback()).toHaveTextContent('Could not copy.');
    expect(feedback()).not.toHaveTextContent('Copied!');
    expect(passwordField().value).toHaveLength(20);
  });

  it('ignores a stale clipboard result after settings change', async () => {
    const user = userEvent.setup();
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    vi.spyOn(navigator.clipboard, 'writeText').mockReturnValue(pending);
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Copy password' }));
    await user.click(screen.getByRole('checkbox', { name: /Symbols/ }));
    await act(async () => { finish(); await pending; });
    expect(feedback()).not.toHaveTextContent('Copied!');
    expect(screen.getByRole('button', { name: 'Copy password' })).toBeEnabled();
  });

  it('fails visibly when secure randomness is unavailable', () => {
    vi.stubGlobal('crypto', undefined);
    try {
      render(<App />);
      expect(screen.getByRole('alert')).toHaveTextContent('Secure randomness is unavailable');
      expect(passwordField()).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Copy password' })).toBeDisabled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
