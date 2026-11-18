# Rorutop — Portfolio & CV

**Technical Lead & gameplay systems programmer** specializing in Luau, roblox-ts, and high-performance Roblox systems. Based in Indonesia (remote), open to contract and studio roles.

- **Portfolio:** deployed via Astro (set the production URL in `astro.config.mjs`)
- **Email:** rorutop.212@gmail.com
- **Discord:** rorutop (`439205321765027840`)
- **GitHub:** [rorutopThe2nd](https://github.com/rorutopThe2nd)
- **YouTube:** [@rorutop3596](https://www.youtube.com/@rorutop3596)
- **GameBanana:** [rorutop](https://gamebanana.com/members/1831109)
- **CV:** [`public/CV.pdf`](public/CV.pdf)

## What's in here

A static portfolio built with Astro, TypeScript, Tailwind, and a little SolidJS. Work history and project write-ups live as Markdown in `src/content/work/` and `src/content/projects/` — edit those to update the site.

Highlights:

- **Cozy Cuddle** — Technical Lead on a 4-player co-op horror title; Luau → roblox-ts migration, authoritative lobby/cross-place teleport pipeline, ECS + behavior tree AI.
- **Grow An Army** — data-oriented Luau ECS on packed buffers; 2ms server step at 1k entities with Blink snapshot streaming.
- **Balloon Popping Simulator** — Parallel Luau boids, Octree spatial queries, server-validated projectiles.

## Commands

| Command                | Action                                      |
| :--------------------- | :------------------------------------------ |
| `npm install`          | Install dependencies                        |
| `npm run dev`          | Start dev server at `localhost:4321`        |
| `npm run dev:network`  | Start dev server on the local network       |
| `npm run build`        | Type-check and build to `./dist/`           |
| `npm run preview`      | Preview the production build locally        |
| `npm run preview:network` | Preview the production build on the network |
| `npm run astro ...`    | Run Astro CLI commands                      |

## Credits

Forked from the [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) theme by Mark Horn (MIT). Branding, content, socials, and CV have been replaced with Rorutop's.

## License

MIT — see [LICENSE](LICENSE).
