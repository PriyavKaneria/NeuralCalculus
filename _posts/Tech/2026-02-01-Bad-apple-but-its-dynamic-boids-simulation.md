---
title: Bad apple!! but it's a dynamic boids simulation
categories: [tech]
tags: [bad apple,touhou,simulation,boids]
---

{% include embed/youtube.html id='MO2T1T-zRxY' %}

A flocking simulation in Rust and WebAssembly - [badapple.priyavkaneria.com](https://badapple.priyavkaneria.com)

---

## / The Idea

I wanted to see if I could make thousands of autonomous particles form the silhouette of the [Bad Apple](https://www.youtube.com/watch?v=FtutLA63Cp8) music video in real-time. Not a pre-baked animation, but actual emergent flocking behavior. Importantly, make it look decent and recognizable.

The constraint was simple: boids can only see their immediate neighbors and a target direction. They have no knowledge of the final image. Yet somehow, 5,000 of them need to arrange themselves into recognizable shapes, 60 times per second.

---

## / The Process

I knew from the start this needed to be fast. JavaScript alone wasn't going to cut it for 5,000 particles with neighbor physics. So I reached for Rust compiled to WebAssembly.

The initial approach was naive. Each boid would be white in color and will represent one white pixel in the current frame of the video. Assign each boid a specific pixel target and move it towards that direction. Obviously it turned out to be a mess. Particles were continuously jumping around to positions, each frame brought different number of white pixels and the boids shuffled around the whole canvas to reach their next frame even before reaching their current target. A tornado of boids near the center.

### / Nearby Pixel Targeting

**The problem:** Assigning the nth boid to the nth white pixel meant boids would chase targets across the entire canvas. A boid in the top-left might get assigned a pixel in the bottom-right, creating chaotic cross-screen movement every frame.

**The shift:** Instead of global assignment, I made each boid search for the nearest white pixel to its current position. This reduced the travel distance dramatically. Boids started moving toward local targets instead of random distant ones.

It was better, but still felt jittery. The pixel-level granularity meant targets shifted constantly even when the overall shape stayed similar.

### / Grid-Based Targeting

**The problem:** Pixel-level targeting was too fine-grained. Even small compression artifacts or anti-aliasing would cause targets to flicker between frames.

**The shift:** I divided the canvas into a grid of cells. Instead of chasing individual pixels, each cell accumulates its white pixels and computes a center of mass. Boids target the center of their cell rather than individual pixel coordinates.

This smoothed out the movement significantly. The grid abstraction filtered out noise and gave boids stable regions to occupy.

### / Spatial Hashing

**The problem:** Every frame, each boid needs to check distances to nearby boids for separation. With 3,500 boids, that's 12 million distance calculations per frame. The simulation crawled.

**The shift:** Instead of asking "how far is every other boid?", I asked "which boids share my neighborhood?". I divided the 800×600 canvas into 20px cells, creating a 40×30 grid. Each boid registers in its cell. Neighbor lookups only check adjacent cells.

What was checking 3,500 neighbors became checking roughly 30. High framerate of simulation was possible.

### / Flow Fields

**The problem:** Boids in "dark" areas (non-target regions) had nowhere to go. They'd wander aimlessly or clump together, waiting for a target pixel to appear nearby.

**The shift:** Rather than asking "where is my target?", I made every cell know "which direction leads to the nearest target". Using BFS from all white pixels, I spread direction vectors outward across the grid. Now every dark cell contains a flow vector pointing toward the nearest white region.

This created organic movement. Boids no longer teleported; they flowed.

### / Lookahead

**The problem:** By the time boids reached their target positions, the video had already moved on. They were always chasing the past frame.

**The shift:** Instead of analyzing the current frame, I asked "what will the frame look like when the boids actually arrive?". I added a second hidden video element running 0.3 seconds ahead. Boids chase the future frame.

The result feels almost prescient. Boids arrive at positions before the viewer's frame renders.

### / Dynamic Scaling

**The problem:** A fixed boid count looked wrong. Mostly-black frames had particles crammed into small white areas. Close-up shots with large white regions looked sparse and hollow.

**The shift:** I stopped thinking of boid count as a constant and started treating it as a parameter that should adapt to content. Now everything scales with pixel density:

- Boid count ranges from 500 to 5,000
- Separation distance tightens in sparse scenes
- Perception radius adjusts with crowd density

Different frames feel full when they should and coherent when sparse.

### / Density Spillover

**The problem:** Even with dynamic counts, boids would stack in the same grid cell. The first cell to contain white pixels would attract everyone, leaving adjacent target areas empty.

**The shift:** I added a density limit per cell. When a cell exceeds 5 boids, new arrivals search expanding rings for nearby cells that have target pixels but fewer occupants. The crowd naturally spreads into available space.

This created more even distributions across the target silhouette.

---

## / The Stack

**Physics:** Rust compiled to [wasm32-unknown-unknown](https://github.com/wasm-bindgen/wasm-bindgen/issues/979) (roughly 30KB binary)

**Rendering:** Canvas 2D via React

**Video:** HTML5 video with a muted lookahead clone

**Styling:** Minimal retro aesthetic with [VT323](https://fonts.google.com/specimen/VT323) monospace font

The Rust-to-JavaScript bridge uses direct memory access. No serialization. Just Float32Array views into WASM linear memory.

Source Code can be refered to [here](https://github.com/PriyavKaneria/bad-apple-boids)

---

*Built January 2026.*

P.S. This article outline was generated with a [reference](https://cannoneyed.com/projects/isometric-nyc) article and then content was manually edited and improved for each section.