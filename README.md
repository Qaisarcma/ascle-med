# Wordlit

**Lyrics that light one word at a time, synced to the moment each word is sung, on Windows.**

Wordlit is a Windows counterpart to the Mac app [Verci](https://verci.xyz). It lives in the system tray, follows what Spotify or Apple Music is playing, and shows the lyrics in one of four animated styles. They appear on a full-screen lock-style screen, or on an always-on overlay above your desktop.

| Style | What it looks like |
|---|---|
| **Ship** | Words stack into a wall that drifts in 3D. The word being sung pops forward on a highlight box. |
| **Fisheye** | A convex word stack under a real WebGL glass-lens shader. The current word sits closest to the glass. |
| **Fisheye Visual** | The same lens, with icons beside the words. |
| **Visual** | One word at a time, with a matching Fluent icon or emoji popping in beside it (about 800 words mapped). |

## Run it

**Portable app (no installer):** open `release\Wordlit-win32-x64\` and run `Wordlit.exe`. You can move the folder anywhere; `release\Wordlit-0.1.0-win-x64.zip` holds the same folder. The first launch of a freshly built exe can take a few extra seconds while Windows Defender scans it.

**From source:**

```powershell
npm install
npm run dev
```

Then:
1. Play a song in **Spotify** or **Apple Music**.
2. Press **Ctrl+Alt+L** for full-screen lyrics. **Esc** closes them.
3. The tray icon (a white **w** on pink) has every setting. On Windows 11 it may be inside the tray overflow (**^**); drag it onto the taskbar to keep it visible.

## How it works on Windows

- **Lyrics screen (the default).** Windows doesn't let apps draw on the real lock screen, so Wordlit has its own full-screen lyrics screen with a clock:
  - **Ctrl+Alt+L** (or the tray's first shortcut item) opens it. It stays up while you move the mouse or skip songs. **Esc** closes it, and so does pressing Ctrl+Alt+L again.
  - **Lock Windows When I Come Back** (tray checkbox, off by default) turns Ctrl+Alt+L into "lock my PC with lyrics". Any key or mouse move, Esc included, then closes the lyrics and **locks Windows**, so your PIN is required, like Verci on a locked Mac.
  - **Idle:** after 2 minutes without input while a song with lyrics is playing, the lyrics screen appears on its own and simply closes when you return. Change or turn this off in tray → *Lyrics Screen When Idle*.
- **Always:** tray → *Show Lyrics* → *Always* floats the words above everything. Clicks go straight through, and the words hide 3 seconds after you pause.
- **Stays lit:** while a song with lyrics plays, the display is kept awake. Once the music stops, Windows' normal sleep and lock timers take over again.
- **Colors:** the defaults match Verci's look (red sung words, a pink highlight, soft pink upcoming words).
  - **Auto Sync** takes the palette from the album art and keeps it readable on black.
  - *Lyric Text… / Highlight… / Secondary Text…* opens the Colors window to set your own.

## Lyrics and timing

- **Where lyrics come from:** two sources, asked at the same time. Neither needs an account or API key.
  - **NetEase Cloud Music** (unofficial) has **real per-word timing** for many songs. When it has the song, every word lights exactly when it's sung. Turn it off with tray → *Precise Word Timing (NetEase)*.
  - **[LRCLIB](https://lrclib.net)**, a free and open lyrics database, covers everything else. It gives exact **line** timing, and Wordlit estimates each word inside a line from syllables and punctuation, adapted to the song's pace. Every line re-syncs to the real time, so small errors never build up.
  - Results are cached in `%APPDATA%\wordlit\lyrics-cache`; songs you've played before load instantly. "Not found" answers are re-checked after 3 days.
  - Only the song's title, artist, album and length are sent, to lrclib.net and music.163.com.
- **Your own lyrics:** put `.lrc` files in **Documents\Wordlit\Lyrics** (tray → *Open Lyrics Folder*), named `Artist - Title.lrc`.
  - Word-level ("enhanced") LRC with `<mm:ss.xx>` word tags is used exactly as written.
  - Your files always win over the online database.
- **Words land early or late?** Tray → *Timing* shifts them. Bluetooth headphones usually need *Words 0.25–0.5 s Later*.
- **Songs without synced lyrics** show nothing, just like Verci.

## Players

Spotify (desktop or Store) and Apple Music are followed by default. Tray → *Players* → *All Media Apps* also follows browsers (YouTube Music and the like) and any other app that reports to Windows' media controls. Playback position comes from Windows' media session API. Players that don't report a position can't be synced.

## Troubleshooting

| Problem | Fix |
|---|---|
| Tray says *Cannot read what is playing* | Wordlit reads the media session through Windows PowerShell 5.1 (built into Windows). Make sure `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe` exists and isn't blocked by policy. See the log below. |
| *No synced lyrics for …* | LRCLIB has no timed lyrics for that song. Add your own `.lrc` file (see above). |
| Ctrl+Alt+L does nothing | Another app already owns the shortcut; the tray menu then shows no shortcut next to *Lock with Lyrics*. Use the tray item instead. |
| After Ctrl+Alt+L, touching anything shows the Windows PIN screen | *Lock Windows When I Come Back* is turned on in the tray. Turn it off and Ctrl+Alt+L just shows the lyrics until you press Esc. To see lyrics while you keep using the PC, choose tray → *Show Lyrics* → *Always*. |
| *Start with Windows* is greyed out | It only works in the packaged app. If you move the app folder, toggle it off and on again. |

- **Log:** `%APPDATA%\wordlit\logs\wordlit.log`
- **Settings:** `%APPDATA%\wordlit\settings.json`

## Development

```powershell
npm run dev           # run with hot reload
npm test              # unit tests (Vitest)
npm run typecheck     # strict TypeScript for main + renderer
npm run snapshot      # render every style offscreen into snapshots\*.png
npm run package       # build + portable folder + zip in release\
npm run check:lrclib  # live check against lrclib.net (prints metadata only)
npm run fake-player   # a silent test "player" that shows up in Windows media controls
npm run icons         # regenerate the Fluent icon subset and app icons
```

### End-to-end testing without real music

These environment variables and flags make it possible to test at any hour, with nothing touching your real settings:

- `WORDLIT_PROFILE=<dir>` uses a separate settings, cache and log folder.
- `WORDLIT_LYRICS_DIR=<dir>` uses a different local lyrics folder.
- `WORDLIT_NO_LOCK=1` logs instead of actually locking Windows.
- `--open-lock-after=ms` opens the lyrics screen.
- `--return-after=ms` simulates someone coming back.
- `--capture-after=ms --capture-file=x.png` saves what the stage shows.
- `--capture-colors=x.png` saves the Colors window.
- `--quit-after=ms` quits automatically.

`tests\fixtures` holds an original test song written for this project. Run `npm run fake-player`, then Wordlit with the variables above.

### Layout

```
src/main/        tray app: media bridge supervisor, lyrics (LRCLIB/cache/local), palette, windows, power
src/preload/     the only bridge between the sandboxed pages and the app
src/renderer/    stage (Ship, Fisheye, Fisheye Visual, Visual) and the Colors window
src/shared/      types and IPC contract used by both sides
resources/       smtc-bridge.ps1 (Windows media sessions → JSON lines), icons
docs/superpowers design spec and implementation plan
```

## Credits

Wordlit is an independent recreation for personal use and isn't affiliated with Verci.
- Lyrics: [LRCLIB](https://lrclib.net)
- Font: [Inter](https://rsms.me/inter/) (SIL OFL)
- Icons: [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) (MIT), plus Segoe UI Emoji
- Built with Electron, electron-vite and TypeScript
