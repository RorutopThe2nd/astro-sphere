---
title: "Steal A Monkey Tower"
summary: "Steal A Brainrot mixed with Bloons TD6"
date: "May 17 2026"
draft: false
tags:
  - Luau
  - Roblox-React
---

<img src="/projects/images/steal-a-monkey/StealAMonkey_logo1024x.png" alt="Steal A Monkey Tower Logo" style="width: 600px; height: auto;" />

Steal A Monkey Tower is a game where you play your game of Tower Defense in a base of yours, but you're vulnerable to players sending you bloons and risk of stealing your monkey towers. The game should be designed to handle a lot of bloons in 8 players lobby, unfortunately it didn't. It has been a while since i abandoned it so I may forgot stuff. This game follow the trend of "Steal a character" games.

Initially, you have a base which is protected by the forcefield to prevent other players getting in. There's a collect part infront of your base and there are 2 benches on the sides of the base, one is for monkey towers and one is for bloons. the max of slots in a bench is like 24 i forgot. You start with selecting a map, then the difficulty, then the mode. Like Bloons TD6! Players have to progress on rounds until the max round but they have to rely on getting the towers from the conveyor, and also stealing other players' monkeys.

On the center of the map, there are monkey conveyor and bloons conveyor. They can spawn from common to legendary. For example a normal dart monkey is common, but the 5th tier bottom path of dart monkey which is the crossbow master is a legendary rarity. Players can pick them up from the conveyor by holding E. Though beware of other players as they have the ability to wield weapons to stun you (not implemented yet). Once stunned, the item (either monkey or balloon) will drop to the ground. They have a timer that makes them disappear when not picking it up, so players have to quickly pick the item before it disintegrates. A monkey tower item will have prices on their tag, usually cheaper than the upgrade costs.

One main mechanic of this game is sabotages using the bloon item. The bloon item has a limit on what round it is able to send. The bloon has a count and comes with properties (camo,regrow,fortified) but these properties affects the round limit, and it can be mixed. This is also similar to what Bloons TD Battles (1/2) did! The bloon item includes blimp (MOAB,BFB,ZOMG,etc. currently only MOAB is implemented) which is an entity with health unlike the bloons, but it also leaks threatening bloons too (ceramics). Once a player base reaches a certain round, that bloon item can be send. The targeted player can panic from what you've sent, which these bloons on round or on sabotaged will deplete their game lives.

Once their lives count gets to 0 from the bloon that leaked to the end of the path, the game flags as defeat and deactivates the forcefield of the player base. Now all players can steal their items (monkeys and bloons on the benches). They have to wait like 10-15 seconds until the forcefield goes up again and the player can restart again on another map, difficulty, nor gamemode.

In terms of placing the tower, player can pick a tower on the bench and place it into the map. They cannot place the tower on the bloons track, neither the obstacles/props on the map. The player can click on a tower and see the upgrade UI. They have 3 paths to choose which path and tier to upgrade. The upgrade paths is only locked to 2 crosspaths, not something like x-x-x. Placing or upgrading a tower will cost the player their gameplay balance. Selling the tower will give the money back in 70%, however a "just" placed tower from the bench will start at 0 selling value.

Every map is 80x50 studs. One of the only map in the game is Monkey Meadow. Bloons path uses bezier curve path. The spatial search uses 2 vector QuadTree, since most of the gameplay is in a 2D tower defense. I used dead reckoning (i think?) networking where the server sends the bloons progress on the path to the client, which the client bloons model that were created by the server positions itself by the progress, and it also moves by the defined bloon progress velocity like the server. They responds to the health state (for ceramic and blimp classes).

The system of creating new towers, ability, tower effect, projectiles, bloons effect ARE quite flexible. The dev can make such unique towers mechanic, which can reflect the BTD6 mechanic. For example, I made catapult projectile which bounces off walls (nor map obstacles) and the map edges. I made another one which is the Juggernaut where it can apply bloons effect (except moabs, but not limited to Ultra Juggernaut i think) to get knocked back. That can also be reflected to the client side, which is actually cool.

Respect to Ninja Kiwi, I made the UI, icons, and the models by my own, parodying them to be blocky. I used Blockbench and Blender to make the monkey, bloon, projectile models along with rigging and animating them. I did consider adding daily quest and shop system, but it should've been after the core gameplay has finished.

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <figure style="margin: 0;">
    <img preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/steal-a-monkey/stealamonkeyshop.png"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Shop UI</figcaption>
  </figure>

  <figure style="margin: 0;">
    <img preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/steal-a-monkey/stealamonkeyicons.png"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Icons</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="\projects\videos\steal-a-monkey\questUI.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Daily Quest UI</figcaption>
  </figure>

  <figure style="margin: 0;">
    <img preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="/projects/images/steal-a-monkey/supermonkey.png"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Super Monkey model!</figcaption>
  </figure>
</div>

I've also made game design rules that prevent players exploiting the game, ensuring players don't get too frustrasted.

- disable the original owner from picking up their own converted tower items
- Stolen Items Only Convert Back to Towers Inside Base
- the deployment cost is 35% of Current Tier Upgrade Cost
- if a player left while there are towers on the field, but their tower bench are full and the player rejoins, the game asks the player to pick a choice between selling and replacing either the towers left on field or the towers on the bench.
- Stolen Tower gets Deployment Discount

Unfortunately, the game lags on 100-200 rainbow bloons because if they all get popped it would get above 800 (?) bloons in total. Due to the architecture being messy, I decided to create another game. I couldn't bother to rewrite all the system.

Video Previews:

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="\projects\videos\steal-a-monkey\moabkill.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Towers popping a moab</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="\projects\videos\steal-a-monkey\gettingitems.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Getting towers and bloons from the conveyor</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="\projects\videos\steal-a-monkey\placingmonkeys.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Placing monkey on the map, along with upgrading them</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="\projects\videos\steal-a-monkey\monkeystealingmechanic.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Showcase of tower stealing mechanic</figcaption>
  </figure>

  <figure style="margin: 0;">
    <video controls preload="metadata" style="width: 100%; border-radius: 8px; display: block;" src="\projects\videos\steal-a-monkey\rainbow100bottleneck.mp4"></video>
    <figcaption style="text-align: center; font-size: 0.875rem; margin-top: 0.4rem; opacity: 0.8;">Bottleneck of sending 100 rainbow bloons to a player (note: this was tested on a low-end PC. Even a high-end computer also lags from this as I tested it myself.)</figcaption>
  </figure>

</div>
