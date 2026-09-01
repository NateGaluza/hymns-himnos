# Hymns & Himnos

A simple, private music player website for your own hymn files. Light green
background, black text, play/pause, skip forward/back, volume, and it can
keep playing with your phone locked once it's added to your home screen.

Everything below is a **one-time setup**. After that, adding new hymns is
two steps forever.

---

## One-time setup (about 10 minutes)

You need free accounts on **GitHub** and **Netlify** — this is the "GitHub is
involved" part. Netlify's plain drag-and-drop uploader can't automatically
rebuild your playlist when you add songs, so we connect it to GitHub instead.
Once connected, adding music becomes literal drag-and-drop, just on GitHub's
website — no coding, no terminal.

**1. Put your music in the `hymns` folder**
This whole `hymns-himnos` folder is already set up correctly — the `hymns`
subfolder is where your song files go. Drag your mp3 (or m4a/wav/ogg) files
from your desktop `hymns` folder into this project's `hymns` folder.

**2. Create a GitHub repository**
- Go to github.com, sign up or log in.
- Click "New repository." Name it `hymns-himnos`. Keep it **Private** if you
  don't want strangers finding your music. Click Create.
- On the new repo's page, click "uploading an existing file" and drag this
  entire `hymns-himnos` folder's contents in (all the files, plus the
  `hymns` folder with your songs inside it). Commit the changes.

**3. Connect Netlify to that repository**
- Go to netlify.com, sign up or log in (you can sign up with your GitHub
  account — easiest option).
- Click "Add new site" → "Import an existing project" → choose GitHub →
  pick the `hymns-himnos` repo.
- Netlify will detect the settings automatically from `netlify.toml`
  (build command `npm run build`, publish folder `.`). Just click Deploy.
- Wait about a minute. Netlify will give you a URL like
  `random-name-123.netlify.app`. That's your site.

**4. (Optional) Get a nicer web address**
In Netlify: Site settings → Change site name → pick something like
`hymns-himnos.netlify.app`.

**5. Add it to your phone's home screen**
Open the Netlify URL on your phone in Safari (iPhone) or Chrome (Android),
then use "Add to Home Screen." It'll behave like an app icon called
"Hymns & Himnos."

---

## Adding new hymns later

1. On GitHub, open your `hymns-himnos` repository, go into the `hymns`
   folder, click "Add file" → "Upload files," and drag your new song(s) in.
   Commit.
2. That's it. Netlify notices the change automatically, re-runs the build
   script, and republishes the site with the new song included — usually
   within a minute. You don't need to touch anything else, and you never
   need to rename or reorder files: `build.js` always re-sorts every hymn
   alphabetically by title for you.

---

## About the "lock screen" playback

Once the site is added to your home screen (step 5 above), it uses the
Media Session API so play/pause/skip show up on your lock screen and audio
keeps playing while your phone is locked. This is standard behavior on
Android. On iPhone it works well too, but iOS is stricter about background
tabs in general — if you notice playback stopping after long periods
locked, reopening the app icon resumes it instantly.

## Files in this folder

| File | What it does |
|---|---|
| `index.html`, `style.css`, `app.js` | The player itself |
| `hymns/` | Your actual song files go here |
| `build.js` | Scans `hymns/`, sorts titles A→Z, writes `manifest.json` |
| `manifest.json` | Auto-generated playlist data — don't edit by hand |
| `netlify.toml` | Tells Netlify to run the build script on every deploy |
| `sw.js`, `manifest.webmanifest` | Let the site be added to your home screen like an app |

Song titles are generated from filenames (dashes/underscores become spaces).
So `amazing-grace.mp3` becomes "amazing grace." Name your files close to how
you want the title to look, e.g. `Amazing Grace.mp3`.
