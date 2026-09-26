# GTA FM

A redesigned, unofficial player for the Grand Theft Auto radio streams hosted by [gtaradio.net](https://gtaradio.net).

It's a static site (plain HTML, CSS and JS, with no build step), so it runs as-is on GitHub Pages.

## What it uses

| Endpoint | Purpose |
| --- | --- |
| `https://audio.gtaradio.net/<game>/<station>` | Icecast MP3 stream for each station (128 kbps, 32 kHz mono) |
| `https://audio.gtaradio.net/status-json.xsl` | Live track title and listener count for every station (polled every 15 s) |

| `https://gtaradio.net/build/games/assets/<file>.jpg` | Station cover art, loaded straight from gtaradio.net (see `COVERS` in `app.js`) |

The cover file names include a build hash, so they can change when gtaradio.net redeploys. If a cover fails to load, the app shows a coloured badge instead. To refresh the names, open a game page on gtaradio.net and copy the new file names from its `audio-*.js` bundle into `COVERS`.

The stream and status endpoints send `Access-Control-Allow-Origin: *`, so they work from any domain.

Game ids are `3`, `vc`, `sa`, `lcs`, `vcs` and `4`. Station ids are listed in the `GAMES` table in `app.js`.

## Features

- 6 games and 70 stations
- Live "now playing" titles and listener counts
- Slide-up drawer with a real-time spectrum visualizer (Web Audio API)
- Tuning static when you switch stations
- Auto-reconnect when a stream drops
- Lock-screen / media-key controls (Media Session API)
- Shareable links such as `#sa/radio-los-santos`
- Remembers your last station and volume
- Keyboard: `Space` plays/pauses, `←`/`→` change station, `↑`/`↓` change volume, `V` opens the visualizer, `1`–`6` switch game
- A different look for each game, and a mobile layout

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "GTA FM"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then open the repository on GitHub and go to **Settings → Pages**. Under **Source**, pick **Deploy from a branch**, then select `main` and `/ (root)`. The site goes live at `https://<you>.github.io/<repo>/`.

## Credits

The streams and metadata are hosted by gtaradio.net, which runs on donations. If you use this, please consider [supporting it](https://boosty.to/applethecandy).

Grand Theft Auto and all station names are trademarks of Rockstar Games. This project isn't affiliated with Rockstar Games or gtaradio.net.
