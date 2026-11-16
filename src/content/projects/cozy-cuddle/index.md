---
title: "Cozy Cuddle — Technical Lead"
summary: "Technical leadership, multiplayer lobby architecture, and core gameplay systems for a 4-player co-op survival horror title"
date: "Nov 7 2026"
draft: false
tags:
  - Luau
  - Roblox-TypeScript
  - Roblox-React
---

<img src="/projects/images/cozycuddlelogowhite.png" alt="Cozy Cuddle Logo" style="width: 600px; height: auto;" />

Cozy Cuddle is a 4-player co-op survival horror game set in an abandoned children's complex nineteen years after its shutdown. Players select distinct characters and work together to solve puzzles, uncover lore, and survive hostile animatronics. _(Note: Development concluded prior to release after studio funding ran out.)_

## Role & Technical Leadership

I served as **Technical Lead**, owning client-server architecture, multiplayer infrastructure, core gameplay systems, and build tooling across a multi-month production cycle.

- **Type-safe codebase migration:** Led the transition to a strictly typed `roblox-ts` and Flamework architecture to enforce compile-time contracts and prevent runtime regressions.
- **Team coordination & studio standards:** Managed task delegation, code architecture, and engineering workflows while coordinating fellow programmers during active production. Defined standardized Roblox `Workspace` hierarchies for level areas, loot spawns, AI waypoints, and environment configuration so level design and engineering could scale in parallel.
- **UI direction & brand identity:** Designed the game's stylized black-and-white logo, authored vector UI layout concepts for core menus, and directed a UI designer before integrating designs into interactive Roblox React prototypes.

## Multiplayer & Cross-Place Lobby Architecture

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/lobby/lobbybrowser.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Lobby Browser</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/lobby/lobbyroom.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Lobby Room</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/lobby/lobbyprivatepass.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Private Lobby and Password</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/lobby/lobbyloadingscreen.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Loading Screen</figcaption>
  </figure>
</div>

Built a production-hardened multiplayer lobby and matchmaking pipeline designed to prevent state desyncs across place teleports:

- **Authoritative networking & bridge pattern:** Engineered authoritative lobby and waiting-room services over Flamework networking, isolated from React UI via a custom bridge layer and a single-source room state projection (`ClientRoomData`).
- **Lobby discovery & lifecycle management:** Built a live-synced public lobby browser with search, capacity/privacy filters, and join-by-code/password validation. Enforced strict host lifecycle rules (host transfer, kick/ban authority, disband-on-host-leave, and empty-room teardown) alongside ready-gating and force-ready match starts.
- **Password-safe friend invites:** Integrated `SocialService` native invites with eligibility checks and a server-initiated `askJoin` flow—allowing invited friends to join private lobbies directly without ever exposing the room password to the invitee's client.
- **3D lobby presentation:** Implemented config-driven, tweened camera framing (map-swappable without code changes), per-member character rig spawning (`GameCharId` lookup with dummy fallbacks), and React nameplates portaled into `BillboardGui`.
- **Cross-place teleport & arrival sync:** Built a props-driven `WAITING X/4` screen with teleport recovery handling, paired with a cross-place party arrival service (`NotifyLoaded` / `SyncArrivals`) and `ReplicatedFirst` preload gating so character and item actions remain locked until all party members finish loading.
- **Multi-client QA hardening:** Validated host/guest transitions, mid-session disconnects, kick/ban edge cases, and topbar/layering regressions across Roblox Studio Local Server simulations and live peer-playtest environments.

## Gameplay, AI & Character Systems

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/gameplay/charai.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Cakie Character AI</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/gameplay/inventorymenu.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Inventory Menu</figcaption>
  </figure>
</div>

- **Unified Agent & Component Movement:** Built an `Agent` abstraction allowing the same character pipeline to be driven by either human players or server-controlled AI bots. Engineered modular Movement (with jumping disabled for horror pacing) and 1st/3rd-person Camera systems using object composition for clean per-entity system assignment.
- **Animation-Graph Character Renderer:** Implemented a custom character rendering pipeline driven by an animation graph and runtime state parameters.
- **ECS + Behavior Tree AI (`Cakie AI`):** Architected an extensible AI framework combining `jecs` (ECS) with behavior trees to drive animatronic patrol/chase loops and locker hiding interactions.
- **Cooperative Carry & Interaction Systems:** Implemented a downed-state carry mechanic usable by both players and AI bots, backed by a custom Proximity Prompt Group and Authority system and a map voting system.
- **Multi-Cell Spatial Inventory & Lore System:** Built a Resident Evil-style multi-slot grid inventory in `roblox-ts` + React with region-touch checkpoint persistence via `ProfileStore`, alongside a dedicated lore document reader and client-rendered external visuals (flashlights, weapon muzzles) for equipped items.
- **Async Cutscene Sequencer:** Created a sequence-based cutscene framework powered by asynchronous `Promise` chaining for scripted narrative events.

## Reusable UI & Tooling Pipeline

- **Reusable React UI Component Library:** Engineered a modular UI toolkit featuring a Z-index-managed modal stack with portal rendering, confirm/cancel dialog semantics, settings tabs, and validated input controls (cyclers, sliders, text-box steppers, and length-validated text inputs) to reduce development overhead across menus.
- **Component Storybook Workflow:** Integrated `UILabs` with Roblox React so UI components could be developed and visually verified in isolation without full game playtests.

## Tech Stack

- **Core & Architecture:** `roblox-ts`, Flamework (dependency injection, singleton lifecycles, typed networking), `better-janitor` (`rbx-janitor`) for stack-based memory cleanup, and `LemonSignal` for doubly-linked-list event signaling.
- **AI & Simulation:** `jecs` (ECS) with `jabby` live entity debugger, `state-management-package-rbxts` (FSM, behavior trees, GOAP, shared blackboard), and `QuickZone` for high-throughput spatial region queries.
- **Networking & Input:** `blink` IDL binary buffer networking with auto-generated `.d.ts` bindings (selected after benchmarking `Lync` and ruling it out due to production stability bugs), plus `Illusion-InputActionSystem` wrapped with custom TypeScript definitions.
- **UI, Persistence & Debug Tooling:** `Roblox React`, `UILabs`, `ProfileStore`, `t` (runtime type validation), `validate-tree` (strict `Instance` hierarchy verification), `centurion` (decorator-based debug commands), and `rbx-better-gizmos` (3D spatial/AI debug rendering).
