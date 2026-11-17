---
title: "I Wish I Was Brave"
summary: "Luau survival-horror game jam entry featuring sliding-window room generation, a multi-stimulus fear system, and a custom cutscene framework"
date: "Jun 22 2026"
draft: false
tags:
  - Luau
  - GameJam
demoUrl: "https://www.roblox.com/games/75997752144237/I-wish-i-was-brave"
---

<img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/iwiwb.png" alt="I Wish I Was Brave Banner" />

Built for a week-long HiddenDevs game jam themed around _"Wish"_, **I Wish I Was Brave (WIWB)** is a first-person survival horror game where a child ventures through a dreamscape tunnel to reach Room 20 armed with only a flashlight and a pistol. After bootstrapping the codebase on Day 1 with foundational scripts adapted from **Cozy Cuddle**, production stalled during a multi-day team-lead radio silence before a late scope pivot with ~4 days remaining compressed final assembly into a 3-day sprint.

## Procedural Corridor & Room Archetypes

Rather than pre-building 20 static levels or managing branching pathfinding under jam constraints, the game generates a linear 20-room sequence using a **sliding-window memory budget**:

- **2-Ahead / Trailing-Cleanup Streaming:** Only ~6 rooms exist in `Workspace` at any moment—spawning 2 rooms ahead of the player's progress while destroying cleared rooms behind them.
- **Weighted Room Generation:** Rooms are rolled by occurrence weight across three distinct gameplay archetypes:
  - **Zombie Rooms (Most Common):** Spawns 2–5 zombies whose chase speed matches the player's base walk speed, forcing either sprint escapes or crouch-based stealth (zombies only aggro on moving targets). The exit stays sealed until all zombies are cleared, with a ~1-in-3 chance to also spawn a high-speed Clown stalker.
  - **Closing Walls Rooms:** Locks the entry door behind the player and triggers crushing walls at a spatial threshold, forcing a timed sprint into the next room.
  - **Darkness Rooms:** Pitch-black corridors with no physical enemies where players must keep their flashlight active to suppress rapid fear buildup.

## Multi-Stimulus Fear, Stealth & Movement Loop

- **Dynamic Fear Meter:** A continuous fear state evaluates multiple environmental and combat inputs—climbing in darkness (especially while standing still), upon line-of-sight entity contact, taking damage, during closing-wall traps, or near the Clown stalker. Moving, standing in lit zones, or keeping the flashlight active pulls the meter back down.
- **Escalating Panic & Instant-Kill Threshold:** Nearing maximum fear layers a corrupting screen overlay, swelling audio, and heavy camera breathing; pinning the meter at max spawns an instant-kill shadow entity in the room.
- **Stamina & Crouch Stealth:** Sprinting drains a regenerating stamina bar while crouching suppresses zombie movement detection. _(Scattered battery pickups up to a 6-item cap remain collectable in the map as leftover items, though flashlight battery drain and refilling were cut during final scope triage, leaving the flashlight permanently powered.)_

## Cutscene, Localization & Checkpoint Pipeline

- **Data-Driven `CutsceneManager`:** Adapted and extended core systems from _Cozy Cuddle_ into a dedicated cutscene orchestrator handling camera tracks, movement locks, screen fades, and scene presets across the bedroom intro, stair-descent cave transition, tutorial, and ending—paired with a subtitle system supporting localization.
- **`DataStore` Checkpoints & Tension Disconnects:** Saves checkpoint progression (`Start`, `Cave`, `AnotherCheckpoint`), `New Game` overwrite confirmations, and intro-skip flags in `DataStore` profiles. Instead of standard respawns, lethal hits or max-fear deaths disconnect the player with custom status messages (`"..."` / `"FEAR"`), resuming from their last saved checkpoint on rejoin.

## Late Scope Pivot & Sprint Post-Mortem

- **Adapting to Mid-Jam Stalls:** When progress paused mid-week during team-lead radio silence (downtime I used to troubleshoot a separate Hytale modding project), the game was re-scoped with roughly four days left on the clock—requiring rapid feature triage to assemble a playable 20-room loop in three days, including cutting the flashlight battery drain loop while leaving collectible battery pickups in the world.
- **Scene Registry Collision Bug:** Under that compressed final build window, the Room 20 ending cutscene was duplicated from the intro and accidentally registered under the same `CutsceneManager` key (`"BedWakeUpIntro"`). That duplicate identifier silently overwrote the intro sequence on release, breaking progression—a concrete lesson in strict identifier validation that carried into later architectures.
