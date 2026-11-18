---
title: "The Signal Tower"
summary: "roblox-ts vertical horror game jam entry featuring custom vector-aligned ladder climbing, procedural anomaly AI, and Serio-compressed ProfileStore checkpoints"
date: "Jun 21 2026"
draft: false
tags:
  - Roblox-Typescript
  - Roblox-React
  - Luau
  - GameJam
demoUrl: "https://www.roblox.com/games/87345966451801/The-Signal-Tower"
---

<img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/TheSignalTower-1920x.png" alt="The Signal Tower Logo" />

Built in one week for the 8th Roblox Studio Community Discord Game Jam (June 21–28, 2026) under the theme **"Height"**, **The Signal Tower** is a first-person vertical survival horror game. Contracted by the Department of Anomaly Affairs (DAA) via an opening briefing tape (`ProximityPrompt` + timed subtitle system), players play as a technician climbing the five-tier _Signal Tower 14_—armed with an infinitely powered flashlight and pistol—to repair locked platform generators and reach the primary antenna.

Bootstrapped from a **Flamework** template, the project reused and extended the component-composed movement and camera architecture migrated to `roblox-ts` from **Cozy Cuddle**, while new mechanics built during the jam—such as mid-climb camera mode switching—were structured modularly to feed back into _Cozy Cuddle_.

## Custom Ladder Climbing & Vertical Traversal

Rather than relying on default Roblox `TrussPart` climbing, I engineered a custom tween-stepped ladder traversal system tailored for vertical combat:

- **Vector-Aligned Auto-Mounting:** Evaluates player proximity and approach angle via **dot-product** checks to smoothly mount ladders and orient the character to match the ladder attachment's facing direction.
- **Attachment-Bounded Clamping:** Constrains vertical movement along the Y-axis between start and end `Attachment` markers, allowing players to dismount via `E` prompts at either endpoint.
- **Combat Camera Flip:** Implemented a camera-flip state while mounted that halts vertical climbing so players can turn and shoot anomalies stalking them from behind.
- **Altitude-Driven Atmosphere:** Paired first-person animated viewmodel hands (flashlight and pistol) with climbing/walking camera shake and wind ambience that scales dynamically with elevation.

## Anomaly AI & Boss Encounter Design

- **Queen Spider:** Traverses vertical support beams using grid-aligned positioning relative to the player, periodically spawning minion spiders and flanking vertically to adjacent beam tiers upon reaching low health.
- **Minion Spider:** Navigates both vertical and horizontal beams, lunging at the player to deal damage once it reaches the center of a horizontal span.
- **Leviathan:** A procedurally animated horizontal rush anomaly that spawns above climbing players and sweeps across ladder walls.
- **Wendigo (5th-Platform Boss):** Stalks perimeter beams while randomly teleporting the player along the ladder, escalating encounter pressure by triggering targeted Leviathan sweeps aimed directly at the player's current elevation.

## Binary Checkpoints, Mobile Input & Post-Jam Polish

- **`Serio` + `ProfileStore` State Serialization:** Platform progression across all five levels—including repaired generator panels, disabled ladders, and unlocked mounts—is packed into compact binary buffers with **Serio** and saved to **ProfileStore**, supporting `Continue` and confirmation-gated `New Game` flows.
- **`QuickZone` Triggers & Contextual UI:** Used `QuickZone` regions to handle checkpoint triggers and contextual onboarding hints (displaying PC keycap prompts) rendered via **Roblox-React**.
- **Multi-Platform Touch Support & Finale Pass:** Reworked the input layer late in the jam to add on-screen mobile touch controls, followed by a post-jam update (July 23) implementing the finale song, timed ending subtitles, scripted camera cutscene, and Thank You screen.

## Jam Post-Mortem

- **Pacing & Debug-Flag Hygiene:** Post-jam player feedback highlighted overly aggressive Queen Spider minion spawn timers, and shipping right at the deadline left a debug gun gizmo visible in the release build—a practical reminder to gate all debug visualizers behind automated production build flags.
