---
title: "The Signal Tower"
summary: "Second horror game jam entry"
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
The Signal Tower is a horror game entry in the 8th gamejam of Roblox Studio Community Discord, which is a week long gamejam that revolves around "Height" theme. The development week starts at June 21st and ends at 28th.
The game is about a technician climbing a tall signal tower, but what's waiting above are dangerous anomalies. The technician is tasked to fix each platform panels and watch out for any anomalities that will risk their lives. The technician borrows a gun and a flashlight (though they are permanent fills)
Some systems are taken off the TS migration of Cozy Cuddle like the movement system and the camera system. Few of them like camera mode switching in The Signal Tower are to be reused on Cozy Cuddle too.

Entities:

- Queen Spider: Climbs the edge beams of the tower vertically, then spawns minion spider on a specific timer. Positions itself on where the player is in grid liek thing, but when it's on low health, it flanks to another beam to the up or to the down.
- Minion Spider: Can walk on either vertical beams or the horizontal beams. Progressing slowly on the horizontal beam and if it gets to the center of the horizontal beam, it jumps on the player and hurts the player HP.
- Leviathan: Rushes through the ladder walls horizontally. Spawns above the player while they are climbing the ladder. Kinda similar to Rush from Doors i guess. oh also it's animated procedurally
- Wendigo: The boss of the last platform. Running on the edge beams, that's it.. But it teleports the player to a random position of the ladder. The boss sequence also includes higher appearance of the Leviathan, except this Leviathan is now targeting the center of the player of above the player.

Reciting what I remember
The early stage went quite smoothly. Went to clone a flamework project template when the gamejam timeline started. Got the movement and the camera system work, even the flashlight and the gun tool system. Went to make the climbing behavior work after the builder put the ladder and platform to the tower map. I used Quickzone for the platform region and checkpoint saving. THe climbing system is custom, go up or down a step with tweening, and auto climb mounting on specific distance to the ladder and the player angle which defined using Dot function. Climbing limit start and end is defined by attachments, though only cares about the Y axis (height). To exit the climb mount, press E on either the start o the end of the ladder (which depends on where the attachments are). Also coded it for the player to face depending what the attachments are facing. I also added camera flip mode, which does stop the climbing movement and let the player attack the anomalies behind. Each platforms has a generator to fix before going to the next ladder (usually locked before fixing the generator). Continues until the 7th platform level.

On the mid to end phase, our animator became less active then gradually became inactive due to some kind of irl stuff, our modeler stepped in to animate the models.. The musician did try make a music, but it was never finished so the leader stepped in to make ai generated song on Udio for the ending song.
The game received feedbacks that it was hard, like the Queen Spider minion spawning were kinda too fast..

even at the end of development, i forgot to turn off the gun gizmo..
