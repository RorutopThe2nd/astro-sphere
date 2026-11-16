---
title: "Grow An Army"
summary: "Large-scale army simulation engineered to handle 10k+ active entities without tanking server FPS (WIP)"
date: "Nov 15 2026"
draft: false
tags:
  - Luau
  - Typescript
# demoUrl: https://astro-sphere-demo.vercel.app
# repoUrl: https://github.com/RorutopThe2nd/GrowAnArmy
---

<image src="/projects/gif/militia.gif" alt="Militia run!" style="width: 200px; height: auto;">

Grow An Army is a Roblox strategy game where players grow an army through a crate economy, arrange it into formations, and send it into large-scale raids against enemy armies — battles involving thousands of simulated troops at once. The design follows the "Grow a X" wave (offline growth, rotating crate stock) but differentiates through a formation and counterplay layer: every troop has a counter, and battles are won by composition and formation choice, not raw size.

The interesting engineering problem isn't the game loop — it's simulating, replicating, and rendering two armies of several thousand units on Roblox servers and on low-end mobile clients, which is the market majority. The entire project is built around that constraint.

<!--
Video placeholder — drop a demo clip here before publishing.
Option A: self-hosted video
<video controls width="100%" src="/videos/grow-an-army-demo.mp4" poster="/videos/grow-an-army-poster.jpg"></video>

Option B: YouTube embed
<iframe width="100%" aspect-ratio="16/9" src="https://www.youtube.com/embed/VIDEO_ID" title="Grow An Army — 1000-unit stress test" frameborder="0" allowfullscreen></iframe>
-->

<video controls width="100%" src="/projects/videos/grow-an-army/2026-11-1521-48-50.mp4"></video>

## Architecture

### Simulation core — structure-of-arrays on Luau buffers

The simulation is a custom buffer-based ECS-style engine written in typed Luau, not a Roblox Instance hierarchy. Every entity is just an index into packed typed buffers (`u16` ids, `f32` positions/velocities, state bytes), with a dense-array + swap-remove layout and free-list ID recycling. There are no per-entity tables, metatables, or Instances in the hot path — iteration is a linear scan over raw memory, and entity creation/removal is O(1).

Key properties:

- **Determinism** — no `math.random`, `os.clock`, or unstable iteration inside simulation paths.
- **Spatial indexing** — a custom `SpatialGrid` (8-stud cells, ring-based nearest-enemy search) with per-tick re-insertion, sqrt-free distance checks, and "dirty entity" sets so only combat-relevant units pay full targeting cost. Previous SpatialGrid was a node-rebuild system, but the current SpatialGrid beats in benchmark.
- **Time-sliced budgets** — targeting and squad logic are round-robin time-sliced (`N entities/tick`, `M squads/tick`) so per-frame cost stays flat regardless of army size.
- **State machines in data** — troop behavior is a byte-level state machine (IDLE / ADVANCING / TARGETING / ATTACKING, with foreswing/backswing attack timing) read straight from the buffers.

### Squad layer (WIP)

Entities are organized into ~50-unit squads with their own movement brain: a squad-level system decides advance/reform behavior per squad (squad grid + radius trackers, formation offset caching, reforming states), and individual troops steer toward their cached formation slot. This keeps the per-tick decision cost proportional to _squad count_, not entity count, and it's what makes formation gameplay possible at this scale.

### Networking — server-authoritative replication

An earlier iteration used client-side simulation with dead reckoning; I replaced it with a cleaner model:

- **The server is the only authority.** Clients never run the simulation — they are pure renderers, which means there is no cheat surface and no divergence problem.
- **Buffer snapshots over Blink.** Snapshot deltas are packed through a custom AoS packet schema (~19 bytes per entity) into Blink's buffer-typed remotes, batched to fit the ~3.4KB `UnreliableRemoteEvent` payload limit (~40 entities per batch, one batch per tick).
- **Velocity-truthful payloads.** Snapshots include true velocity (including formation drift), so the client drives model motion itself between snapshot refreshes instead of teleporting units per batch — smooth at snapshot rates far below framerate.
- **Bandwidth instrumentation built in.** A wire tracker measures actual KB/s per playfield continuously, so every network change is verified against real numbers, not guesses.

### Client rendering — pooled rigs over a snapshot ring

The render layer is a deliberate mirror of the sim architecture: a client-side SoA world fed by a ring buffer of snapshots plus an interpolation clock, driving a pooled rig backend.

- **Object pooling end to end** — rig pool with pending/active/free states and batched model spawning, instead of clone/destroy storms during mass deaths.
- **Minimal geometry** — troops are single-MeshPart chibi models; animation is a flag-diff against sim state that only calls the Animator when a unit's animation state actually changes.
- **Only needing 1 part and 11 bones** — One Militia stores one MeshPart, 11 Bones, and 1 Motor6D for Transform positioning.
- **Planned culling/LOD** — squad-sphere-first culling and rig-to-impostor swaps for distant squads, budgeted by device tier (mobile-first market).

## Process

I treated this as an engineering project while also making this game possibly monetizable:

- **Market-grounded design review.** Before building content, I wrote a full design review against live Roblox chart data and the Q2 2026 shareholder letter (retention-first discovery algorithm, long-tail economics, mobile-majority audience), then turned every finding into a prioritized roadmap (P0 correctness → P1 performance/revenue infra → P2 content loop).
- **Written decision records.** Architecture decisions (ProfileStore persistence, async PvP via saved snapshot reconstruction, monetization stance, troop roadmap) are documented as self-contained records with rationale and caveats; including the honest tradeoffs, not just the conclusions.
- **A resolved-issue log.** A full audit of the simulation surfaced six latent correctness bugs (stale spatial grid positions, freed-ID dense-array corruption on ID reuse, free-list pop logic, ghost targets after death, ring radius unit mismatch, squad-ID off-by-one). Each is documented with root cause and fix, and all are fixed.
- **Benchmarks before optimization.** Cmdr commands (`:stress`, `:perf`) spawn N entities and report per-system frame time; a debug profiler aggregates subsystem cost over tick windows. Every performance claim has to survive the profiler.

## Stack

roblox-ts + Flamework (services/controllers in TypeScript), performance-critical engine in typed Luau buffers, Blink for buffer-typed networking, Cmdr for dev tooling, Wally for packages, DarkLua optimize pass in the production build, Rojo/Rokit/Mantle for the build and deploy pipeline, plus automated dependency maintenance and commitlint on the repo.

I plan to replace roblox-ts with Alloy-luau in the future.

## Status

In active development. The simulation core, squad layer, replication, and render pipeline are built and stress-tested via the benchmark harness; the current milestone ladder is 1k → 2.5k → 5k → 10k troops, with the content loop (troop types, crates, formations, raids, persistence) as the next major phase.

Without the squad system fully integrated, I have achieved this amount size of snapshot packet sent 10Hz to the client side.

```
wire: 86.0 KB/s entitycount: 1000
wire: 61.8 KB/s entitycount: 823
wire: 36.9 KB/s entitycount: 469
wire: 22.4 KB/s entitycount: 290
wire: 12.5 KB/s entitycount: 150
```

10k entities reaches 800 KB/s per player, which is not shippable. Each player should be under roughly 50 KB/s.

You can see the microprofiler dump on 1000 entities here:
<a href="/projects/dumps/GROWANARMY-microprofile-20261116-082804.x.html">microprofile-20261116-082804.x.html</a>

The slowest playfield was 2ms. The current bottleneck is currently the packet and the render models.
