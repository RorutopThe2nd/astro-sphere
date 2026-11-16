---
title: "Grow An Army"
summary: "Data-oriented Luau army simulation engineered for 5k CCU scale and low-end mobile monetization (<2ms server ticks)"
date: "Nov 15 2026"
draft: false
tags:
  - Luau
  - TypeScript
# demoUrl: https://astro-sphere-demo.vercel.app
# repoUrl: https://github.com/RorutopThe2nd/GrowAnArmy
---

<img src="/projects/gif/militia.gif" alt="Militia run!" style="width: 200px; height: auto;" />

Grow An Army is a large-scale Roblox strategy game built around a rotating crate economy, offline progression, and formation-based army raids. While inspired by the high-retention "Grow a X" loop, combat relies on formation geometry and unit counterplay so victory is driven by composition rather than raw troop count.

The project is architected from day one around a commercial constraint: simulating, replicating, and rendering battles of several thousand active troops smoothly on low-end mobile devices—the primary audience required to sustain a **5,000+ CCU** live-ops game.

<video controls width="100%" src="/projects/videos/grow-an-army/2026-11-1521-48-50.mp4"></video>

## Architecture

### Simulation core — Structure-of-Arrays on Luau buffers

To eliminate Roblox `Instance` overhead and Lua garbage-collection spikes at scale, the simulation runs on a custom buffer-backed ECS engine in typed Luau. Entities are integer indices into contiguous typed buffers (`u16` IDs, `f32` positions and velocities, byte-packed state flags) managed via a dense array, swap-remove deletion, and free-list ID recycling. Hot loops scan raw memory linearly with $O(1)$ spawn and despawn paths.

- **Deterministic simulation:** Gameplay loops avoid `math.random`, `os.clock`, and non-deterministic table iteration so raid outcomes remain reproducible.
- **Spatial indexing:** A custom `SpatialGrid` (8-stud cells with ring-based nearest-enemy queries) combines per-tick re-insertion, squared-distance checks (avoiding `math.sqrt`), and dirty-entity tracking so idle units skip target scans. Replaced an earlier node-rebuild grid after outperforming it in head-to-head benchmarks.
- **Time-sliced tick budgets:** Target acquisition and squad logic run on round-robin time slices (`N` entities and `M` squads per tick) to keep server frame times flat under heavy unit loads.
- **Byte-level state machines:** Troop states (`IDLE`, `ADVANCING`, `TARGETING`, `ATTACKING`, plus foreswing/backswing windows) live directly inside typed buffers with zero per-entity table allocations.

### Squad layer (WIP)

Units are organized into ~50-troop squads governed by a macro movement layer. A squad-level pass updates grid cells, bounding radii, formation slot offsets, and reforming states, while individual troops steer toward their assigned offsets. Tying macro decisions to _squad count_ rather than individual troop count keeps formation combat viable at multi-thousand-unit scale.

### Networking — server-authoritative replication

An early client-predicted prototype with dead reckoning was replaced with a deterministic, exploit-resistant architecture:

- **Strict server authority:** Clients execute zero simulation logic and act purely as state renderers, eliminating movement exploits and client-server desyncs.
- **Batched binary snapshots via Blink:** Entity states are packed into a ~19-byte AoS binary schema over Blink's buffer remotes, batched (~40 entities per packet, one batch per tick) to stay within the ~3.4 KB `UnreliableRemoteEvent` payload ceiling.
- **Velocity-extrapolated interpolation:** Snapshots transmit true velocity (including squad drift), allowing clients to extrapolate smooth unit motion between low-frequency network updates.
- **Live bandwidth instrumentation:** Built-in wire telemetry measures exact KB/s per playfield continuously so protocol changes are validated against hard mobile data budgets.

### Client rendering — pooled rigs over a snapshot ring

The client mirrors the server's data-oriented design with a client-side SoA world driven by a snapshot ring buffer and interpolation clock:

- **End-to-end rig pooling:** A pre-allocated rig pool (`pending`, `active`, and `free` states) with batched spawning prevents `Clone()`/`Destroy()` frame spikes during mass casualties.
- **Mobile-budgeted rig topology:** Chibi troop models are built in Blockbench and merged in Blender down to a single `MeshPart`, 11 `Bone`s, and one `Motor6D` (`Transform`-driven) sharing a single UV texture atlas. Animation state is flag-diffed against simulation buffers so the `Animator` only fires on state transitions.
- **Planned culling and LOD:** Squad-sphere frustum culling and rig-to-impostor swaps for distant units, scaled dynamically by client device tier.

## Production & Engineering Standards

Built with the same infrastructure, telemetry, and product discipline expected on a live commercial team:

- **Retention & monetization architecture:** Before building gameplay systems, I audited live Roblox top-chart data and Roblox's Q2 2026 shareholder metrics (retention-weighted discovery, long-tail monetization, mobile device share) to structure a phased roadmap (`P0` engine correctness → `P1` network/mobile scalability & monetization infra → `P2` content loop).
- **Architecture decision records (ADRs):** Core technical and live-ops systems—`ProfileStore` data persistence, asynchronous PvP via serialized army snapshots, monetization guardrails, and troop progression—are documented with explicit tradeoffs and failure modes.
- **Root-cause audit log:** A full simulation audit caught and resolved six latent concurrency and memory bugs (stale spatial grid coordinates, dense-array corruption on recycled IDs, free-list pop ordering, post-death ghost targets, ring-radius unit mismatches, and a squad-ID off-by-one error).
- **In-game profiling suite:** Custom `Cmdr` commands (`:stress`, `:perf`) spawn controlled entity loads and aggregate per-system frame times over rolling tick windows.

## Tech Stack

`roblox-ts` + Flamework (TypeScript services/controllers), typed Luau buffers (simulation core), Blink (binary buffer networking), `Cmdr` (live profiling), Wally (package management), DarkLua (production AST optimization), Rojo / Rokit (build & deploy automation), and `commitlint` + automated dependency maintenance in CI.

_Planned evolution:_ Migrating the `roblox-ts` layer to `alloy-luau` to unify the codebase in native Luau.

## Benchmarks & Current Roadmap

The simulation core, squad layer, binary replication pipeline, and pooled renderer are operational on a `1k → 2.5k → 5k → 10k` stress-test ladder ahead of building out the full monetization and content loop.

- **Server compute (Phase 1 complete):** At 1,000 active entities, the heaviest playfield simulation step runs in **2ms** ([1,000-entity MicroProfiler dump](/projects/dumps/GROWANARMY-microprofile-20261116-082804.x.html)), leaving ample headroom for 5k CCU server instances.
- **Network optimization (Phase 2 active):** Streaming individual entity snapshots at 10 Hz currently scales linearly at ~85 bytes/sec per unit:

```text
wire: 12.5 KB/s | entitycount: 150
wire: 22.4 KB/s | entitycount: 290
wire: 36.9 KB/s | entitycount: 469
wire: 61.8 KB/s | entitycount: 823
wire: 86.0 KB/s | entitycount: 1000
```
