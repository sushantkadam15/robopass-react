# RoboPass

A browser-only password generator built with React and Vite. Create a random
password or a memorable passphrase, customize it, and copy it to your password
manager. The original RoboPass robot and branding are retained.

**[Open RoboPass on GitHub Pages](https://sushantkadam15.github.io/robopass-react/)**

The public site works from any location without Tailscale or the local server.

## Features

- Random passwords from 8–128 characters, defaulting to 20.
- Select uppercase, lowercase, numbers, and symbols. Every selected type is
  included. Optionally exclude look-alike characters.
- Passphrases from 4–10 independently selected words, defaulting to six, using
  a bundled 7,775-entry dictionary adapted from EFF's Large Wordlist.
- Hyphen, space, period, and underscore separators.
- Settings immediately generate a new result; invalid settings clear the result
  and show an actionable error.
- Clipboard success is confirmed only after copying succeeds. On failure, the
  selectable, read-only output remains available for manual copying.
- Fluid layouts, wrapping output that grows to fit, touch-sized controls,
  keyboard navigation, visible focus, labeled fields, live status feedback,
  and support for enlarged text and forced colors.

## Run locally

Use Node.js 24 LTS (`.nvmrc`), or a supported Node release satisfying
`package.json`'s engine requirement.

```sh
nvm install # if you use nvm
npm ci
npm start
```

Vite prints the development URL. No API key, account, database, or backend is
required. All runtime assets, including the word list, are bundled locally;
there are no third-party font or analytics requests.

## Access the local server remotely

The preview on the Ubuntu server is available at:

**[Open RoboPass](https://ubuntu-server-sushant.tail47b0ac.ts.net:8443/)**

Connect your phone or computer to the same Tailscale network as the server,
then open that link in your browser. You can use it from a different location;
you do not need to be on the server's Wi-Fi. The server must remain powered on
and connected to Tailscale. This link is private to the tailnet.

`localhost` always refers to the device running your browser, so opening
`http://localhost:4173` on another device will not reach this server. The HTTPS
link also provides the secure context needed for browser clipboard access.

### Server setup

The preview serves the production files in `build/` using Python 3, with
Tailscale Serve providing HTTPS. Node.js is needed to install dependencies and
build updates, but is not needed to serve an existing build.

To recreate the preview when the local service is not already running, run
these commands on the Ubuntu server:

```sh
cd /home/skadam/robopass-react
npm ci
npm run build
systemd-run --user --unit=robopass-local \
  --description='RoboPass local preview' \
  --property=Restart=on-failure \
  --working-directory="$PWD/build" \
  /usr/bin/python3 -m http.server 4173 --bind 127.0.0.1
sudo tailscale serve --bg --https=8443 http://127.0.0.1:4173
```

The local HTTP server listens on `127.0.0.1:4173`; Tailscale forwards the private
HTTPS URL to it. The service runs in the background independently of the SSH
terminal. It is a transient user service and must be recreated after a reboot.
Tailscale Serve's background configuration persists across reboots.

### Check, update, or stop the preview

```sh
systemctl --user status robopass-local
journalctl --user -u robopass-local -n 30
tailscale serve status
curl --fail http://127.0.0.1:4173/ --output /dev/null
```

After changing the app, run `npm run build` from the repository and refresh
your browser. The preview serves the built files, so source edits alone do not
update it.

To stop the preview and remove its Tailscale proxy:

```sh
sudo tailscale serve --https=8443 off
systemctl --user stop robopass-local
```

## Verify

```sh
npm run lint
npm test
npm run build
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

The browser suite serves the production build, so run the build command first.
CI runs these same checks. Browser failures produce screenshots, traces, and
an HTML report; CI uploads these as artifacts.

Unit/component coverage includes unbiased random-index rejection, bounded
failure, all 15 nonempty character-set combinations, lengths and exclusions,
dictionary integrity, invalid options, missing Web Crypto, settings, and
clipboard success/failure/races.

Browser coverage includes Chromium, Firefox, WebKit, and emulated iPhone,
Android, and iPad profiles. The desktop engines exercise 18 viewport sizes
from 240 to 2,560 CSS pixels wide, including phone landscape, tablet sizes,
and layout breakpoints, using maximum-length passwords and passphrases.
Checks cover overflow, output clipping, keyboard input, clipboard failures,
200% text size, browser errors, external requests/storage, and automated
WCAG A/AA accessibility scans. Device profiles are emulation, not tests on
physical phones or tablets; automated scans do not replace manual assistive
technology testing.

## Generation and privacy

The generator uses `crypto.getRandomValues()` with rejection sampling to avoid
modulo bias. Random-password candidates are drawn from the selected alphabet
and accepted only when every selected character type is present. There is no
predictable suffix or letter-substitution mode. Generation attempts are bounded,
and unavailable secure randomness produces an error rather than a fallback.
Passphrase words are sampled independently with replacement; repeated words
are valid. See [third-party attribution](THIRD_PARTY_NOTICES.md) for the dictionary
source, license, and normalization details.

Passwords are held in React memory and are not sent to a server, logged, or
persisted by RoboPass. Refreshing replaces the current result. Copying places
the value on your device's clipboard. Production hosting should use HTTPS for
clipboard support. Use a unique password for every account, save it in a
password manager, and enable multi-factor authentication where available.

## Build and deploy

### GitHub Pages

The repository's **Settings → Pages → Build and deployment → Source** must
be set to **GitHub Actions**. The public site is served at
<https://sushantkadam15.github.io/robopass-react/>.

The **Verify RoboPass** workflow in `.github/workflows/ci.yml` installs
dependencies, runs lint and unit tests, builds the app, and runs the browser
suite. After those checks pass on a push to `master`, it uploads `build/` and
deploys that artifact to GitHub Pages. Pull requests and other branches run
verification without publishing. The existing relative asset URLs support the
`/robopass-react/` project path.

To republish `master` without a new commit, open **Actions → Verify RoboPass →
Run workflow**, select `master`, and run it. Check that both the verification
and deployment jobs succeed before checking the public site. Deployment progress
and the site URL are also available under **Settings → Pages**.

### Other static hosting

```sh
npm run build
npm run preview
```

Upload the contents of `build/` to static hosting. The output directory is
unchanged from the previous Create React App setup. Relative asset URLs support
both domain-root and subdirectory hosting; there is no client-side routing.
A Git push does not itself confirm that the public site has been deployed.

## Credits

Created by [Sushant Kadam](https://github.com/sushantkadam15), originally inspired
by DynoPass. Passphrase dictionary adapted from the
[Electronic Frontier Foundation](https://www.eff.org/dice).
