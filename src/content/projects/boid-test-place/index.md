---
title: "Boid Testing Area"
summary: "Headless server-simulated, client-rendered boids flocking sandbox exploring Octree spatial queries, half-precision Blink networking, and multi-player target tracking"
date: "Feb 1 2025"
draft: false
tags:
  - Luau
---

Boid Testing Area is an R&D sandbox built to prototype and stress-test large-scale flocking behavior ahead of **Balloon Popping Simulator**. The final architecture runs pure simulation math on the server with zero server-side `Instance` rendering, streaming quantized state updates to client-rendered wedge agents.

## Flocking Simulation & Spatial Partitioning

- **Steering & soft containment:** Evolved from anchored server `CFrame` updates with edge-wrapping teleports to continuous velocity steering with soft bounding-box forces that smoothly pull stray boids back into the play volume.
- **Multi-player target tracking & swarm splitting:** In multiplayer test servers, boids dynamically evaluate nearby players—splitting, switching targets, and weaving around curved arch obstacles to pursue different players in real time.
- **Decoupling physics for scale:** Early tests using `LinearVelocity` physics constraints for obstacle collisions degraded server stability above ~60 boids. Removing physics constraints and server-side parts in favor of headless math eliminated the bottleneck.
- **Dual-Octree spatial indexing:** Implemented an Octree for fast neighbor flocking queries (resolving an early steering bug where boids stalled in place with erratic facing directions), paired with a secondary Octree storing static map geometry voxelized into **12-stud obstacle nodes**.
- **Indoor room navigation (WIP):** Because local obstacle avoidance prevented boids from reliably entering a windmill interior—and occasionally caused wall clipping—I began prototyping a macro room-navigation layer using waypoint attachments and **Dijkstra's algorithm** to weight paths between rooms.

## Hybrid Replication & Binary Networking

Before landing on the final network model, I tested and discarded two pure approaches:

1. **Velocity-driven sync with distance snaps:** Streaming positions and velocities with a hard-reset distance threshold produced jarring visual desyncs.
2. **10 Hz snapshot interpolation:** Interpolating a server snapshot buffer looked smooth but introduced too much latency for responsive gameplay in _Balloon Popping Simulator_.

The resulting hybrid pipeline combines threshold-filtered binary snapshots with fixed-timestep client prediction, keeping client receive bandwidth around **~12–16 KB/s** during active multi-player swarm tracking:

- **Quantized Blink buffers:** Entity batches are packed into binary buffers via **Blink** with every vector compressed into **16-bit half-precision floats**.
- **Delta-threshold transmission:** Roughly once every 10 `Heartbeat`s, the server transmits only attributes that changed past an epsilon threshold (position, look direction, velocity, acceleration, and speed) rather than redundant full snapshots.
- **Fixed-timestep client integration:** Clients integrate velocity locally on a fixed `1/60`s timestep accumulator for smooth frame-rate motion, applying a **5-stud hard reset** only if client drift exceeds tolerance.

## Iterative Benchmarking & Production Handoff

Before adopting Git, I tracked architectural iterations in a `Quarantine` archive—benchmarking a uniform spatial grid, a flat spatial hash, three `BoidHandler` revisions, and `ByteNet` against the final `Octree` + `Blink` stack. Once validated here, the core flocking and replication systems were refactored into a clean, modular architecture for **Balloon Popping Simulator**.

## Previews

<figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/boid-test-place/ecosystemofboids.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Ecosystem Of Boids</figcaption>
</figure>

<figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/boid-test-place/boidsbehavior.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Boids Behavior</figcaption>
</figure>
<figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/boid-test-place/lvbottleneck.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Linear Velocity Bottleneck</figcaption>
</figure>
<figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/videos/boid-test-place/boids-multiplayer.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Multiplayer Boids Targeting</figcaption>
</figure>
