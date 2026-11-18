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

Cozy Cuddle is a 4-player co-op survival horror game set in an abandoned children's complex nineteen years after its shutdown. Players select distinct characters and work together to solve puzzles, uncover lore, and survive hostile animatronics.

> _Disclaimer: Development concluded prior to release after studio funding ran out. 3D character models, environment art, and maps showcased here are the property of PixelMob Studios and are displayed with permission for portfolio demonstration._

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

## Legacy Luau Prototype Systems (2024–2025)

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/legacy/animated-prompt.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Animated Proximity Prompt</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/legacy/briefcase-system.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Briefcase System</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/cozy-cuddle/legacy/generator-minigame.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Generator Minigame (Wire and Control Panel Puzzle)</figcaption>
  </figure>
</div>

Prior to migrating the codebase to `roblox-ts`, I built several interactive puzzle and interaction prototypes in native Luau during early development:

- **2D Verlet-Rope Wire Generator Minigame:** Wrote a custom `Rope`/`VerletNode` physics layer that simulates each wire as a chain of `GuiObject` nodes under gravity (`Vector2(0, 196.2)`), solved with five distance-constraint iterations every `Heartbeat` and rendered entirely in scaled UI space. Wires are spawned from colour-coded templates (Red/Blue/Green/Yellow/Black), and both their positions and their deliberately mismatched starting connections are shuffled so no two attempts look alike. Circular barrier frames act as static colliders that the simulated segments slide around; dragging a wire head lerps it toward the cursor with tweened colour feedback (green for a correct pairing, white for neutral, red for a wrong-connection grab), and correctly paired wires lock in place while incorrect ones can be picked back up. The puzzle's wire count is drawn from a weighted distribution (typically 2–5) and completion is published through a shared `Req` table.
- **Procedurally Generated Control-Panel Puzzle:** Built a collage generator that recursively nests randomly oriented `UIListLayout` containers to assemble a panel grid from a small set of pre-authored, custom-textured layout templates, then populates each cell with clones of reusable `Knob`, `Slider`, and `Lever` control templates (horizontal/vertical and large/small slider variants). Every control registers a GUID-keyed entry in a `Req` module and disconnects its own input once solved: knobs snap to 32 detents across a ±157.5° range against a hidden target marker with a ratchet sound, sliders resolve to one of 88 detents and use a sprite-sheet lamp plus a proximity "ping" cue to guide the player into the target band, and levers run their own damped spring/gravity Verlet integration with layered wood-groan, metal-creak and metal-thump audio—and physically jam short of the end until the other controls are finished. A central `StarterGui` controller picks the minigame per `Generator`-tagged prompt, freezes player actions with `ContextActionService`, and only marks the generator activated once every `Req` flag reads true.
- **Animated Proximity Prompts:** Replaced the stock prompt presentation with a `ProximityPromptService`-driven system that clones a `CozyPrompt` `BillboardGui` onto the prompt's parent on `PromptShown`, reading the prompt's own `ObjectText`, `KeyboardKeyCode` and `HoldDuration` into the UI. A shared `PromptTweenInfo` module centralises the easing curves for entrance/exit, orbit, scaling and looping pattern animations, while a `RenderStepped` loop orbits a glowing star around a debug-tunable pivot, jitters the key label, scrolls the bar fill patterns and resizes the object label for wrapped text. Hold interactions reveal a gradient fill bar whose `UIGradient` keypoints track real hold progress and roll back on cancellation; activation and `PromptHidden` fire distinct exit sequences that tear down every connection and cloned instance.
- **Briefcase Interaction Prototype:** Prototyped an inspect-and-equip briefcase built from a `BRIEFCASE_PLACEHOLD` model containing tool children (Flashlight, UV Flashlight, Mega Flashlight, Batteries, LockPicks) and matching `HITBOX_` parts. A `RenderStepped` camera raycast with an `Include` filter resolves the hovered tool into a `CurToolName` value, which toggles per-tool `Highlight` objects and drives a cursor-following, depth-scaled tooltip that pulls name, description and cost from a `ToolDesc` table; the case itself used authored open/close animations.

## Reusable UI & Tooling Pipeline

- **Reusable React UI Component Library:** Engineered a modular UI toolkit featuring a Z-index-managed modal stack with portal rendering, confirm/cancel dialog semantics, settings tabs, and validated input controls (cyclers, sliders, text-box steppers, and length-validated text inputs) to reduce development overhead across menus.
- **Component Storybook Workflow:** Integrated `UILabs` with Roblox React so UI components could be developed and visually verified in isolation without full game playtests.

## Tech Stack

- **Core & Architecture:** `roblox-ts`, Flamework (dependency injection, singleton lifecycles, typed networking), `better-janitor` (`rbx-janitor`) for stack-based memory cleanup, and `LemonSignal` for doubly-linked-list event signaling.
- **AI & Simulation:** `jecs` (ECS) with `jabby` live entity debugger, `state-management-package-rbxts` (FSM, behavior trees, GOAP, shared blackboard), and `QuickZone` for high-throughput spatial region queries.
- **Networking & Input:** `blink` IDL binary buffer networking with auto-generated `.d.ts` bindings (selected after benchmarking `Lync` and ruling it out due to production stability bugs), plus `Illusion-InputActionSystem` wrapped with custom TypeScript definitions.
- **UI, Persistence & Debug Tooling:** `Roblox React`, `UILabs`, `ProfileStore`, `t` (runtime type validation), `validate-tree` (strict `Instance` hierarchy verification), `centurion` (decorator-based debug commands), and `rbx-better-gizmos` (3D spatial/AI debug rendering).
