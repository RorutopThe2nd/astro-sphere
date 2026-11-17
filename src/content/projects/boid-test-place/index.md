---
title: "Boid Testing Area"
summary: "Client-rendered, server-simulated boids flocking experiment focused on replication and spatial optimization."
date: "Feb 1 2025"
draft: false
tags:
  - Luau
---

This is a place to experiment with large-scale boids. I'm pretty sure this was for Balloon Popping Simulator that I will be making. The flocking algorithm works, and it became my favorite algorithm.

I started with using a wedge part; IIRC, it was on the server side. Then I made a large bounding box so the moving boids that use anchored CFrame updates on Heartbeat teleport back to the opposing edge. Later, I removed that when I understood the boid algorithm and when I made it so that the boids drag their velocity back to the bounding box when they go outside the large box.

The flocking stuff using Octree for neighbor searching does work pretty well, but I encountered an issue that made the boid drag and stop in place while its facing direction was confused about where to go.

I then tried to use Linear Velocity for physics collision since I made some obstacles for my boids. I noticed the lag and the server instability when I tried to go above like 60 boids. I did implement obstacle avoidance, but the boids were likely to hit the obstacle. So then I switched to Client-Server Replication, where the wedge is client-side while the server tells the client to move it based on where the server boid model is, calculating the boid's position and their velocity.

I had tried 2 methods.

    Velocity-driven client boid: The server sends position and velocity to the client, a batch of them serialized. Then, the client replication system changes the client boid data to match the server's. It has a threshold to hard sync the client position from the server based on distance, but it ended up making a lot of desyncs, which looked jarring.

    Snapshot Interpolation is a server-client interpolation where the client manages a snapshot history of whatever the server sends, and the server has a 10Hz tick to send the packet to the client. It's quite smooth, but it has delays, which won't be good for Balloon Popping Simulator.

It was quite fun making the boids follow me. They're my children. I also tried to make them follow me into a windmill building on the map, but the boids struggled to get in because of the obstacle avoidance logic. They also sometimes noclip, which is concerning.

All of this boid stuff was transferred and refined (remade into a modular system) for Balloon Popping Simulator.
