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

The game starts with a menu that was rushed. It has New Game and Continue buttons (Continue only works if a save exists), and if you hit New Game over an existing save it asks "AreYouSure" first. Progress is saved in a DataStore-backed profile, so the checkpoint feature means you can continue the game only from the last checkpoint, even after rejoining. Dying doesn't respawn you either — the server just kicks you out with a "..." message and you rejoin at your checkpoint.

A new game starts with a cutscene about a child and his mom conversing with him before turning off the lamp. The kid says he wants to be brave. He then sleeps and goes into a dream sequence where he wakes up at night and checks downstairs. He finds a tunnel inside the living room that wasn't there before. Facing his fears bravely, he goes in. The dialogue is delivered as subtitles — there's a whole subtitle system behind it with localization support. Every cutscene in the game (intro, tunnel teleport, tutorial, even the ending) runs on a dedicated CutsceneManager framework that handles the camera work, movement locking, fades and scene presets per cutscene, which was honestly more system than a 3-day jam game needed.

What I never mentioned before: the tunnel isn't a straight shot into the rooms. There's a teleport cutscene where the kid goes down the stairs (the objective UI literally says "Go down stairs.") and gets dropped into a cave corridor that leads toward the rooms. The game has three checkpoints total — Start, Cave, and AnotherCheckpoint — marked by region triggers so your save always points at the latest one. The intro even has a shorter alternate version for players who chose to skip it, remembered in their save data.

The real gameplay starts as the child continues walking from the tunnel. The game gives a gun and a flashlight the moment you spawn, and a tutorial cutscene plays to show what the player should do. The target is room 20. The actual rooms are procedurally generated, but unlike Doors, it's a linear sequence of rooms stitched along one corridor. Each room type has an occurrence weight — zombie rooms are the most common, then the walls rooms, then the darkness rooms. Only about 6 rooms exist at a time: the game generates 2 rooms ahead of you and quietly destroys the ones behind you. Coding with multiple exits would have been hard for a game jam.

The rooms are divided in 3:

- Zombie room: Spawns 2 to 5 random zombies that target the player and chase them. Their chase speed is actually fixed at your walking pace, so sprinting is the only real escape — and they only notice you while you're moving, so crouching past them makes you almost invisible. The exit door stays locked until every zombie in the room is dead. There's also roughly a 1-in-3 chance the Clown shows up in one of these rooms: a screaming-fast stalker that rushes you the moment you enter, and just being near it feeds your fear meter.

- The closing walls room: Triggers at a certain player position, and then the walls suddenly start closing, which will crush the kid. They have to run fast until the next room — and the door behind you locks shut, so there's no going back.

- Darkness room: Just darkness, no entities, except there's an instant-kill monster that materializes if you let the fear meter stay maxed for a few seconds.

About the fear meter: running and walking bring it down (so does standing in lit areas), while standing still in the dark lets it climb. Seeing an entity in your view, taking a hit, the walls closing in, or the Clown getting close all push it up fast. In the dark room fear climbs hard, but keeping the flashlight on actively pulls it back down — which makes batteries matter (more on that below). If the meter stays pinned at max long enough, the monster appears in the room with you, and it kills instantly — the same "kick you from the server" trick the game uses elsewhere, with the message "FEAR." As the meter gets close to maxing there are panic effects too: a corrupting overlay on the screen, the fear music swelling, and the camera starts breathing harder.

Speaking of which, the movement system got more depth than I remembered: you have a stamina bar that sprinting drains and that refills when you stop, you can crouch to sneak, and the flashlight has a battery that drains while it's on. Batteries are scattered around as pickups — you can carry up to 6 and use one to refill the flashlight back to full. Letting it die in a dark room is exactly as bad as it sounds.

Upon reaching room 20, the child finds a room with only a book to claim. It is the end. Claiming the book locks your movement and fades in a "To Be Continued" screen, and after ten seconds the game kicks you from the server with the message "thanks for playing!!!" — that kick message IS the thank you, a nice bit of low-budget jank in hindsight. Unfortunately, the output logged an error, and on release, players and judges didn't even get that far. Looking at the code now, the ending cutscene registers itself in the cutscene manager I made under the exact same scene name as the intro ("BedWakeUpIntro") — a copy-paste job that silently overwrites the intro scene, and probably part of why the flow broke. It was a management problem in that we rushed the project in a matter of 3 days before the submission closed.

Well i guess we didn't win the gamejam. it was rushed afterall
