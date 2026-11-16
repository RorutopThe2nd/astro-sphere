---
title: "Steal A Monkey Tower"
summary: "8-player competitive tower defense combining 'Steal a Character' base-raiding with Bloons TD6 crosspathing and sabotage sends"
date: "May 17 2026"
draft: false
tags:
  - Luau
  - Roblox-React
---

<img src="/projects/images/steal-a-monkey/StealAMonkey_logo1024x.png" alt="Steal A Monkey Tower Logo" style="width: 600px; height: auto;" />

Steal A Monkey Tower is an 8-player competitive strategy game blending the viral _"Steal a Character"_ conveyor-and-raid loop with _Bloons TD 6_ tower crosspathing and _Bloons TD Battles_ sabotage sends. Players defend personal bases across multi-round waves while intercepting rivals on central conveyors, sending modified bloon rushes, and raiding unlocked enemy bases to steal high-tier towers.

## Core Loop & Base-Raiding Mechanics

- **Forcefield-Protected Bases & Dual Benches:** Each player operates an 80×50-stud playfield (such as _Monkey Meadow_) shielded by an active forcefield, flanked by two 24-slot storage benches—one for captured Monkey Towers and one for sabotage Bloons.
- **Central Rarity Conveyors:** Twin conveyors in the center of the arena spawn tiered towers (ranging from Common _Dart Monkeys_ to Legendary Tier-5 like _Crossbow Masters_) and sabotage bloons. Players hold `E` to claim items and haul them back to base, while rivals can stun carriers mid-transit to force item drops onto a despawn timer _(stun-combat loop architected on top of the bloon knockback/stun status pipeline)_.
- **Bloon Sabotage Sends:** Borrowing from _Bloons TD Battles_, players spend stored bloon items to rush opponents once round thresholds are met. Sends support blimp classes (_MOABs_ with health pools that leak _Ceramics_) and stackable status modifiers:
  - **Fortified:** Doubles HP on Lead and Ceramic bloons.
  - **Regrow:** Regenerates bloon layers up the hierarchy on a timer, tracked via a live playfield counter.
  - **Camo & Combo Pricing:** Shifts round gates and cash payouts, discounting stacked `Fortified + Camo` sends to reflect their combined threat.
- **Shield Collapse & Raid Window:** Leaked bloons drain player lives; hitting `0` lives flags defeat and drops the base forcefield for 10–15 seconds, allowing rival players to raid both benches before the shield resets for a new map, difficulty, or mode.

## Economy Provenance & Anti-Exploit Systems

To prevent infinite-money loops, item duping, and disconnect exploits in a competitive stealing economy, every bench slot serializes full state and ownership history:

- **Three-State Ownership Provenance:** Each serialized tower tracks its path, tier, crosspath, and chain of custody (`Original`, `Stolen`, or `Recovered`, plus claimant ID).
  - _Original_ towers deploy at **50%** of total tier cost.
  - _Stolen_ towers keep a **20%** deployment discount across sessions, and original owners are blocked from immediately re-grabbing their own converted tower items mid-raid.
  - Stealing back a tower you originally owned flags it as _Recovered_, allowing **free** redeployment.
- **Sell-Value Exploit Guard:** Selling a tower refunds **70%** of invested value, while towers freshly deployed from a bench initialize at **0** sell value to prevent free bench-to-cash conversion.
- **Rejoin Bench-Overflow Reconciliation:** If a player disconnects with active towers on the field while their 24-slot bench is already full, rejoining triggers a conflict-resolution prompt requiring the player to sell or overwrite either the field towers or bench slots before resuming.

## Tower Defense Architecture & Networking

- **3-Path Crosspathing & Placement Validation:** Towers support three upgrade paths locked to two crosspaths (`X-X-0` style) with track and obstacle collision checks.
- **2D QuadTree & Deterministic Targeting:** Range queries run against a 2D QuadTree over the playfield. All four targeting priorities (`First`, `Last`, `Weak`, `Strong`) execute shared comparators on both server and client—normalizing `First`/`Last` via `progress × pathLength` for multi-path fairness—so client targeting previews always match server hit resolution.
- **Modular Abilities & Projectile Physics:** Abilities declare cooldowns, active durations, and lifecycle cleanup rules (persisting through upgrades or destroying with the tower). Shipped modules include _Super Monkey Fan Club_ (filtering nearby Dart Monkeys by crosspath eligibility and buffing the closest 9 for 15 seconds), wall-bouncing catapult projectiles, and knockback _Juggernaut_ projectiles mirrored to clients.
- **Parametric Path Dead Reckoning:** Bloons traverse parametric Bézier paths. Rather than streaming continuous world coordinates, the server replicates normalized path progress and velocity while clients extrapolate smooth movement locally and react to health-state thresholds for Ceramics and MOABs.

## UI, 3D Assets & Debug Tooling

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
  <figure style="margin: 0;">
    <img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/steal-a-monkey/stealamonkeyshop.png" alt="Shop UI" />
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Shop UI</figcaption>
  </figure>

  <figure style="margin: 0;">
    <img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/steal-a-monkey/stealamonkeyicons.png" alt="Custom Icons" />
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Custom Icons</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/steal-a-monkey/questUI.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Daily Quest UI</figcaption>
  </figure>

  <figure style="margin: 0;">
    <img style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/steal-a-monkey/supermonkey.png" alt="Super Monkey Model" />
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Super Monkey 3D Model</figcaption>
  </figure>
</div>

- **Custom 3D Art & Roblox React Interfaces:** Modeled, rigged, and animated blocky parody monkeys, bloons, and projectiles in Blockbench and Blender, paired with custom icons and Roblox React interfaces for upgrades, daily quests, and the shop.
- **CLI Economy & Stress-Testing Commands:** Built a lightweight chat command parser with argument normalization and shorthand flags (`/spawnTowerItem`, `/spawnBloonItem`, `/setRound`, `/sendBloons`) to test crosspath combinations, status stacking, and high-density waves without waiting on conveyor RNG.

## Performance Post-Mortem

Stress-testing with `/sendBloons` exposed a hard architectural ceiling: sending 100–200 _Rainbow Bloons_ triggers a child-spawning cascade exceeding **800+ simultaneous bloons**, saturating traditional `Instance` and OOP update overhead across both low-end and high-end hardware. Rather than patching over a fundamentally object-heavy architecture, I archived the prototype and applied those lessons directly to **Grow An Army**—rebuilding from scratch around Structure-of-Arrays Luau buffers and binary networking to scale into the multi-thousand-entity range.

## Gameplay & Stress-Test Previews

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/steal-a-monkey/moabkill.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Towers popping a MOAB</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/steal-a-monkey/gettingitems.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Claiming towers and bloons from the conveyor</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/steal-a-monkey/placingmonkeys.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Deploying and upgrading towers</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/steal-a-monkey/monkeystealingmechanic.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Base raid and tower-stealing mechanic</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/steal-a-monkey/rainbow100bottleneck.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">100-Rainbow-Bloon cascade bottleneck test</figcaption>
  </figure>
</div>
