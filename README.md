# KineticType-Canvas
An interactive HTML5 Canvas experiment that transforms user-inputted text into a reactive particle system. Features mouse-hover physics, dynamic color customization, and responsive fluid animation.
# KineticType-Canvas

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Tech](https://img.shields.io/badge/tech-HTML5%20%7C%20Canvas%20%7C%20VanillaJS-orange.svg)

**KineticType-Canvas** is a high-performance, interactive typographical experiment that transforms standard HTML input into a fluid, reactive particle system. Built entirely with Vanilla JavaScript and the HTML5 Canvas API, this project demonstrates the intersection of typography, generative art, and physics simulations.

---

## 🚀 **Overview**

This project renders user-inputted text not as static pixels, but as thousands of individual autonomous particles. Each particle maintains a specific coordinate memory of its origin, allowing it to react to external forces (like cursor movement) and then autonomously return to its original position to reform the text.

It serves as a lightweight boilerplate for developers looking to understand **creative coding**, **grid-based scanning**, and **Euclidean distance calculations** in a canvas environment.

---

## ✨ **Key Features**

* **Dynamic Text Generation:** Instantly converts any typed text into a particle grid system.
* **Physics Simulation:** Implements a custom physics engine where particles exhibit repulsion behavior when interacted with, and elastic easing when returning to their origin.
* **Proximity Networking:** Dynamic constellation effect where particles form connections with neighbors only when activated by the user's cursor (optimized for performance).
* **Real-time Customization:** Includes a UI to change text content and particle colors on the fly without refreshing the page.
* **Responsive & Adaptive:** Automatically recalculates grid positions on window resize to ensure text remains centered and proportional.
* **Performance Optimized:**
    * Uses `requestAnimationFrame` for smooth 60fps rendering.
    * Implements spatial checks to limit expensive line-drawing calculations only to active areas.
    * Dynamic sampling rates (`step` size) to balance visual fidelity with CPU load.

---
## 🛠️ **OVER VIEW **
<img width="1919" height="982" alt="image" src="https://github.com/user-attachments/assets/c4246983-c99b-4866-909e-2d99531f36c5" />


## 🛠️ **Technical Implementation**

### 1. **Text-to-Particle Conversion**
The core logic involves drawing text onto an off-screen canvas context and then analyzing the pixel data using `ctx.getImageData()`. The script scans the canvas grid (every 4th pixel for optimization) and checks the alpha channel. If a pixel is non-transparent, a `Particle` object is instantiated at that `(x, y)` coordinate.

### 2. **The Physics Engine**
Each `Particle` class instance holds two sets of coordinates:
* `this.x, this.y`: The current position (mutable).
* `this.baseX, this.baseY`: The target position (immutable origin).

In every animation frame, the distance between the mouse and the particle is calculated using the Pythagorean theorem:
```javascript
let dx = mouse.x - this.x;
let dy = mouse.y - this.y;
let distance = Math.sqrt(dx * dx + dy * dy);
