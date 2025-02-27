# Phaser 3 - Start Project One

This is what I have together for a first attempt at a Phaser 3 Game starting point for a top down style game that makes heavy use of tile maps. The goal here is to work out a lot of the basic things that will come up when dealing with tile maps in a game that might have a somewhat large world in which to explore. 

In addition to tile maps I will also want to work out a lot of other first time pitfalls when starting to make a Phaser game. With that said I have also touched base on a lot of other subjects when working on this. This includes working with groups, breaking a game down into many states or scenes, attaching events, using the data manager and so forth.

However sense this is very much a start point I will shy away from writing any game specific logic.

## R0 - Tilemaps, player object, states, basic loader, people

With the very first revision I of course wanted to get much of what has to do with the core idea solid. I also wanted this first revision to still be a good starting point for a full game as well. So I have a lot worked out when it comes to working with maps. I went with a system that involves using CSV files for setting tile index values, and then JSON for everything else that will be used for a given map.

I also have a player object that can be moved with the arrow keys, and also with the mouse by clicking on tiles in the current map. Also I got around to adding other people in the game as well, a basic loading screen, and much more.

```
* ( done ) Use CSV over hard coded data for map
* ( done ) Go with 16 by 16 for sprite sheets
* ( done ) display debug info relative to player
* ( done ) Boot, and world State
* ( done ) Load State
* ( done ) Spawn locations in maps using map JSON data files
* ( done ) Have more than one map, and switch between them when entering doors
* ( done ) Have player show up in spawn locations when starting at a new map
* ( done ) Have player go to corresponding door location in new map when entering a door.
* ( done ) Have a player sheet
* ( done ) figure out a 'door slide' solution to help with single doors
* ( done ) Expand hall map and start a Mega-R map
* ( done ) Finish work on 'door slide feature'
* ( done ) Pull door slide feature into its own function
* ( done ) See about having a single door loop
* ( done ) See about fixing problem with door slide feature when moving left
* ( done ) Start a states folder
* ( done ) Have a Load state
* ( done ) Have a World state
* ( done ) see about having objects that take up two slots and have the player be able to go under one of them
* ( done ) use point and click to move player
* ( done ) Work out basics of loading plugins
* ( done ) get together a working solution for path detection
* ( done ) Have a working basic load screen using graphics
* ( done ) Use path detection for player movement
* ( done ) pool of people sprites as a group
* ( done ) collesion detection for player and people
* ( done ) people have some drag
* ( done ) Have a common 'spritePathProcessor' function to use with player, and people
* ( done ) Fix a bug that happens when clicking a tile that is not walkable
* ( done ) Have a path array for people
* ( done ) common setSpritePath function for player and people
* ( done ) logic for createing paths for people sprites
* ( done ) getRandomMapPos function
* ( done ) If a person goes out of bounds have them respawn
* ( done ) Have people spawn at map spawn location
* ( done ) keep people from spawning into walls, and going to walls
* ( done ) see about using the data manager over just directly seting data objects keys for people
* ( done ) see about using the data manager for the player sprite
* ( done ) I should be able to have person on person collision detection
* ( done ) see if you can get people to stop bunching up on top of each other
* ( done ) when a person hits the player, get a new location to go to.
* ( done ) when a person hits another person have them also get a new location
* ( done ) filter tiles that are not walkable in getRandomMapPos method
* ( done ) have a large door system that will allow for doors that are more than one tile
* ( done ) start map 4
* ( done ) have both people and player type spawn locations
* ( done ) timed release for the spawning of people
* ( done ) when idle for a second or longer, snap to nearest tile if between tiles
* ( done ) fix bug that happens when you push a person threw a door.
* ( done ) Making use of a post update event
* ( done ) tiles for counters
* ( done ) Fix a bug where a whole bunch of people are layerd on top of each other, blocking a door
```

## R1 - ??

For now I do not have any plans for R1 as I am working on my first game that is based off of what I have started here. However as I work more on that I might get around to working more on this starting point, or make a new one.

```
* (      ) add above sprite layer data to the json data for maps
* (      ) tiles for clothing return rack
* (      ) tiles for clothing stock
* (      ) tiles for clothing empty
* (      ) tiles for work tables
* (      ) tiles for counter tablets
* (      ) tiles for work table computers
```
