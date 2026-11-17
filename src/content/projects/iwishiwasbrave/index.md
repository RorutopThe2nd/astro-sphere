---
title: "I Wish I Was Brave"
summary: "My first gamejam entry, a horror game entry"
date: "Jun 22 2026"
draft: false
tags:
  - Luau
  - GameJam
---

This was for a week-long game jam on HiddenDevs, themed "wish." The game, WIWB, is a horror game, because the leader always goes with the horror genre for every game jam.

The game starts with a menu that was rushed. It has a checkpoint feature so you can continue the game only from the last checkpoint.

A new game starts with a cutscene about a child and his mom conversing with him before turning off the lamp. The kid says he wants to be brave. He then sleeps and goes into a dream sequence where he wakes up at night and checks downstairs. He finds a tunnel inside the living room that wasn't there before. Facing his fears bravely, he goes in.

The real gameplay starts as the child continues walking from the tunnel. The game gives a gun and flashlight, and shows a tutorial on what the player should do. The target is room 20. The actual rooms are procedurally generated rooms, but unlike Doors, it's a linear sequence of rooms. Coding with multiple exits would be hard for a game jam.

The rooms are divided in 3:

- Zombie room: Spawns a few random zombies that target the player and run faster the more rooms are entered.

- The closing walls room: Triggers at a certain player position, and then the walls suddenly start closing, which will crush the kid. They have to run fast until the next room.

- Darkness room: Just darkness, no entities, except there's an instant-kill monster once you reach a full fear meter.

About the fear meter: Running and walking do affect the meter decreasing. If there are zombies in the room, the meter goes up, or when the walls close, the meter goes up fast. In the dark room, darkness increases fear, but turning on the flashlight makes it slower. As stated, the monster appears only in the dark room if the fear meter keeps maxing out. There are also panic effects on the screen.

Upon reaching room 20, the child finds a room with only a book to claim. It is the end. When claiming the book, it's supposed to show a thank you screen. Unfortunately, the output logged an error, and on release, players and judges didn't see the special thank you message. It was a management problem in that we rushed the project in a matter of 3 days before the submission closed.
