# Yihuan Huang · Robotics & Robot Learning

Personal academic portfolio: https://yihuanhuang.github.io/

## Development

Requires Node.js 22; no npm packages are required.

```sh
npm run build
npm run check
python -m http.server 8765 --directory dist
```

Edit project narratives in `content/`, the homepage in `scripts/build.mjs`, and styles/media in `public/`. The build creates a self-contained `dist/`. Every push to `master` builds, checks, and deploys that directory through GitHub Actions. Application essays and local research records are not included.

Actual image and video dimensions are recorded in `scripts/media-sizes.json`. When adding or replacing media, update its width and height there (use the encoded video dimensions for MP4s). The build uses these values to reserve proportional space and adds a visible MP4 link below each player.

The previous Academic Pages website is retained in Git history and the tag `backup/pre-portfolio-migration-20261023` (commit a5252d74f09122c711fb0d0c48541edf75188dff).

## Analytics

All pages use Umami Cloud for website `7b00dcc5-ab86-433a-92e3-5c3e9c09ac45`.
Tracking is restricted to `yihuanhuang.github.io`; local previews do not send events.
The private Umami dashboard shows regions, pageviews and estimated visit duration.
`public/analytics.js` also sends `page-engagement` events every 30 seconds while a
page is visible and focused, with a final partial interval on blur/hide. The
`seconds` property is the additional foreground time since the previous event,
and `path` identifies the page. In Umami Events, filter to `page-engagement` to
inspect these properties; these events do not create extra pageviews. Delivery
on tab close is best effort. Browser blockers and network failures can reduce
coverage. No session replay or custom visitor identifiers are enabled.

## Attribution

Page structure adapted from Jon Barron's personal website: https://github.com/jonbarron/jonbarron.github.io . Its original stylesheet is preserved in `public/template.css`; the footer retains attribution. Official VEX game illustrations are credited beside the images. Research figures and videos are documented on their respective project pages.
