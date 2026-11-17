---
title: "Balloon Popping Simulator"
summary: "Multithreaded Luau movement-FPS disguised as a simulator, featuring Octree-indexed boid enemies, hybrid Blink replication, and custom vector HUD design"
date: "Mar 12 2026"
draft: false
tags:
  - Luau
---

<img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/balloon-popping-sim/hudmockup.png" alt="Balloon Popping Simulator Vector HUD and Logo Mockup" />

Balloon Popping Simulator subverts the standard simulator formula: players start by popping balloons with improvised stationery—rocks, bamboo darts, bottle caps, pencil pieces, toothpicks, and thumbtacks—before progressing into a high-speed, momentum-driven PVE shooter inspired by _ULTRAKILL_. Across a 7-page design specification spanning five planned zones (_Plains_, _Forest_, _Mountains_, _Shores_, and _Abandoned City_), the game was designed to gradually shed its whimsical simulator presentation for darker environments, industrial UI, and aggressive enemy archetypes.

## Movement FPS & Modular Combat

- **Momentum Controller & Camera Modes:** Built a physics-based character controller supporting momentum preservation across **1st-person**, **3rd-person**, and **Shiftlock** perspectives.
- **Modular `ActionWrapper` Abilities:** Implemented three rebindable movement abilities—**Swiftness** (temporary speed boost), **Dash**, and **MidAirJump**—each encapsulated as a standalone `ActionWrapper` module managing its own cooldown and activation state.
- **Ricochet Projectiles & Sanity-Checked Hit Detection:** Built modular weapon and projectile classes on top of **FastCast Redux**, supporting surface and balloon ricochets. To keep projectile combat responsive without sacrificing security, clients run overlap checks against streamed projectile hitboxes and report hits to the server, which validates each claim against pending-hit sanity checks and authoritative health values before popping layers.

## Multithreaded Boid Enemies & Hybrid Networking

Refactored the flocking and spatial-query architecture from **Boid Testing Area** into modular enemy entities:

- **Multi-Layer Balloons & Behavior Archetypes:** Custom Blender balloon models support nested child layers tracked via ancestor IDs so multi-layered balloons pop sequentially. AI behaviors are configured per archetype—including **Chase** (with pitch and roll clamping to prevent unnatural tumbling), **Flee** (steering away from nearby players), and **Static**—driven by a folder-based `BalloonSpawner` that respawns empty nodes on a 3-second cycle.
- **Parallel Luau Execution (`Actor`s):** Both the server simulation/replication queue and client snapshot processing run desynchronized inside **Parallel Luau Actors** to offload math from the main thread.
- **Octree Queries & Hybrid `Blink` Replication:** Spatial lookups combine `Sleitnick/Octree` with a cached play-volume search grid. After stress-testing **300 active balloons** and hitting instance and `Recv` bandwidth bottlenecks in dense clusters, I migrated replication to the hybrid pipeline prototyped in _Boid Testing Area_:
  - Server queues entity creation, destruction, and delta-thresholded `CFrame` updates, flushing binary **Blink** packets at **~8 Hz** with timestamps.
  - Clients buffer snapshots to linearly interpolate between the two most recent states, batching visual updates via `BulkMoveTo` and hiding parts outside a **100-stud culling radius**.

## UI/UX Design, Inventory & Custom Godot Pipeline

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/inventorysystem.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Inventory System and Equipping Weapons</figcaption>
  </figure>
  <figure style="margin: 0;">
    <img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/balloon-popping-sim/passives-ui.jpg" alt="Passives Loadout UI Mockup" />
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Passives Loadout Matrix Mockup</figcaption>
  </figure>
</div>

- **Vector HUD & Shape-Coded Visual Hierarchy:** Designed the game's logo and full HUD system in Inkscape to blend simulator clarity with shooter grit—pairing industrial metal frames, hazard-stripe dividers, and a `999X COMBO!` counter with distinct geometric silhouettes per system (tilted diamonds for navigation, circular `Q`/`E`/`R` ability wheels, crosshair-bracketed weapon slots, and a triangular **Passives** loadout grid).
- **10-Slot Split Hotbar with 3D Previews:** Engineered a custom Roblox inventory dividing equip slots into a **6:4 split** (6 general slots, 4 progression-gated special slots) with live 3D `ViewportFrame` weapon previews. Closing the menu regenerates equipped tools with a transition animation and metallic audio cue.
- **Godot-to-Luau Branching Dialogue Exporter:** Forked an open-source Godot dialogue addon, extended its node features, and built a custom **Luau export pipeline** so branching conversations compile directly into native Luau modules.
- **State-Machine Quest Framework (`Power Quest`):** Built a modular quest engine where each quest instantiates per player and transitions cleanly through `Inactive → Active → Completed` states (validated with an initial `AppleQuest` test case).
- **`ProfileStore` Persistence:** Saves and restores per-map currency tokens, unlocked and equipped weapons, abilities, passives (accessories/gadgets), and custom player keybinds on join.

## Design Roadmap & Post-Mortem

- **Unwired Paper Mechanics:** Several systems from the original design notebook remain unimplemented in the current build—including the risk-reward pop-counter collector loop (banking pops at a hub collector vs. losing unbanked pops on death), the live `999X` combo meter, progressive map tonal shifts, and end-of-zone story bosses.
- **Scope & Architectural Takeaways:** Solo-producing five full biomes in Blender alongside a large weapon roster proved out of scope for a single developer, and the 300-balloon crowding bottleneck highlighted the limits of `Instance`-backed enemy state—lessons that directly shaped the pure buffer-driven Structure-of-Arrays architecture in **Grow An Army**.

## Previews

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/balloonoidstightspace.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Balloon-oids navigating through a tight space</figcaption>
  </figure>
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/changingAIBehavior.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Change the AI Behavior by renaming the spawn folder nor the balloon spawn part</figcaption>
  </figure>
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/weapons.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Weapons 1</figcaption>
  </figure>
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/weapons2.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Weapons 2</figcaption>
  </figure>
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/buckshotandfullauto.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Buckshot projectiles and a full auto weapon</figcaption>
  </figure>
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/balloon-popping-sim/abilities.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Abilities</figcaption>
  </figure>
 
</div>
