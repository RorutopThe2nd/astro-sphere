---
title: "Balloon Popping Simulator"
summary: "A simulator game about popping balloons disguised as PVE FPS game"
date: "Mar 12 2026"
draft: false
tags:
  - Luau
---

Balloon Popping Simulator, as the name suggest you pop balloons and get money, except the idea is each map progressively gets gloomier and serious instead of whimsy.

The game allows you to be in either 3rd person, Shiftlock, or 1st person.

The player starts with a rock as the weapon. Coins can be gained from popping balloons, and players can buy new weapons in each map. However, the currency will be different for each map.

When popping balloons, the player will get the counter to go up, and players have to go back to the base hub in the map to get into a collector machine and get the money. Dying to balloons will lose all of the pop counter.

Current state of progress

Initially, I focused on the star balloon enemies first. I used the boid algorithm to do it. Despite the fact that boids should mostly be used on the client side, I managed to make them work with server-client replication and added hitboxes to the boids, which eventually became balloons with children layers. The Boid Spatial Query uses Sleitnick/Octree.

Next, I developed the weapons tool. I used FastCast Redux as the projectile system. I then made modular classes for weapons and projectiles. It gave me so much control over being able to make the projectile bounce off parts and the balloons. The projectile uses the balloons' Octree for hitting them.

After that, I made my own Inventory System UI. I made like 7 equip slots in total, but the slots were supposed to be locked by progression. Weapons can be put in the equip slots. Once the player closes the custom UI menu, the player's tools are regenerated with the new weapons put into the equip slots. They do a cool transition animation with a metal sound effect.

Next, I made 3 ability buttons. Each has a different keybind trigger. The ability code is modular too. I made roll, dash, and air jump as the abilities with cooldowns, using linear velocity. Additionally, the character uses a physics Character Controller so it makes momentum possible. This was an early feature before, so it's kind of buggy.

The balloon-oids are also quite modular. Some properties are just able to be modified. I made chase, static, and path-following balloons. They have collision and object avoidance implemented, but it is quite problematic in closed spaces.

The game interestingly has dialogue and quests. There wasn't any good quest system that worked. So I actually used Godot for the dialogue system with options.

Visual dialogue

I yoinked an addon from the Godot library. At a glance, it seemed to be good, but it didn't fill my needs and it didn't have Luau export, of course. I used the extension documentation to modify the dialogue system addon and used ChatGPT-4 to figure out the Luau parsing; as a result, it worked on Roblox. I also made more features for the dialogue system addon on Godot.

For the Quest System, I did make one myself called Power Quest. It gives more modularity than the other quest systems I've seen on the DevForum.

Tested against 300 balloon entities. There is distance culling. My PC lagged from all these balloons in a crowded area. The Recv is also high too. This wasn't using buffers before, but I could use Blink networking.

My ambition is too high; the large map seems too big for me to build and sculpt in Blender. Weapons also will take long to make. The optimization, I guess, is a mess. I did consider making a boss after the "Story event" of a map is finished to be able to progress to the next map.
