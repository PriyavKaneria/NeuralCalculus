var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import init, { Grid, TransformMatrix, triangle_height, } from "./pkg/landing_page_test.js";
import limitloop from "./limitloop.js";
let grid;
let canvas;
let ctx;
let revealer;
let body = document.body;
const TILE_SIZE = 30;
const MAX_FLIP_STATES = 16;
let grid_flip_state = false;
let grid_set_transparent = false;
let clickedTileX = 0;
let clickedTileY = 0;
let clikedIndex = 0;
let mouseX = 0;
let mouseY = 0;
// rAF normalization
window.requestAnimationFrame = (function () {
    return (window.requestAnimationFrame ||
        // @ts-ignore
        window.webkitRequestAnimationFrame ||
        // @ts-ignore
        window.mozRequestAnimationFrame ||
        // @ts-ignore
        window.msRequestAnimationFrame ||
        // @ts-ignore
        window.oRequestAnimationFrame ||
        function (f) {
            window.setTimeout(f, 1e3 / 60);
        });
})();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield init();
        console.log("WASM initialized");
        // Initialize canvas
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        canvas.style.position = "fixed";
        canvas.style.zIndex = "-1";
        // Initialize grid
        const gridWidth = Math.ceil(window.innerWidth / triangle_height(TILE_SIZE)) + 2;
        const gridHeight = Math.ceil(window.innerHeight / (TILE_SIZE * 0.5));
        grid = Grid.new(gridWidth, gridHeight);
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        drawGrid();
        canvas.addEventListener("click", handleClick);
        // Setup revealer
        // in case of mobile, the revealer will stay in the center
        revealer = document.getElementById("revealer");
        revealer.style.background =
            "radial-gradient(circle, black 0%, transparent 50%)";
        if (window.innerWidth < 768) {
            revealer.style.top = "calc(30% - 15rem)";
            revealer.style.left = "calc(50% - 15rem)";
        }
        else {
            body.onmousemove = (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
                revealer.style.top = `calc(${mouseY}px - 15rem)`;
                revealer.style.left = `calc(${mouseX}px - 15rem)`;
            };
        }
        // select and apply random font to heading
        const heading = document.getElementById("heading");
        const fonts = [
            "Butler",
            "Bohemian Soul",
            "KestaiKpersonaluse",
            "LinLibertine",
            "Mermaid",
            "Minguwest",
        ];
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
        heading.style.fontFamily = randomFont;
        // Add trailing particles to loader
        const loaders = document.getElementsByClassName("loader");
        for (let i = 0; i < loaders.length; i++) {
            addTrailingParticles(loaders[i]);
        }
        // set initial theme from parent message
        ;
        window.addEventListener("message", (event) => {
            if (event.origin === "http://127.0.0.1:4000") {
                if (event.data === "dark") {
                    handleClick(new MouseEvent("click", {
                        clientX: heading.getBoundingClientRect().left +
                            heading.getBoundingClientRect().width / 2,
                        clientY: heading.getBoundingClientRect().top + 10,
                    }));
                }
            }
        });
        // ask for the theme from parent
        const data = ["asktheme"];
        parent.postMessage(data, "http://127.0.0.1:4000");
        // set the anchor tags to properly redirect in parent
        const anchors = document.getElementsByTagName("a");
        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            anchor.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent the default anchor click behavior
                const data = ["theme", grid_flip_state ? "dark" : "light"];
                parent.postMessage(data, "http://127.0.0.1:4000");
                // run the exit animation
                handleExit(anchor);
                const hrefData = ["href", "#" + anchor.href.toString().split("#")[1]];
                setTimeout(() => {
                    ;
                    parent.postMessage(hrefData, "http://127.0.0.1:4000"); // Send the hash to the parent window
                }, 5000);
            });
        }
        run_animation_loop();
    });
}
function resizeCanvas() {
    console.log("Resizing canvas", canvas);
    canvas.width = window.innerWidth + triangle_height(TILE_SIZE);
    canvas.height = window.innerHeight + TILE_SIZE;
    const gridWidth = Math.ceil(window.innerWidth / triangle_height(TILE_SIZE)) + 2;
    const gridHeight = Math.ceil(window.innerHeight / (TILE_SIZE * 0.5));
    grid = Grid.new(gridWidth, gridHeight);
    drawGrid();
}
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < grid.height(); row++) {
        for (let col = 0; col < grid.width(); col++) {
            const index = row * grid.width() + col;
            const [x, y] = getTrianglePosition(row, col);
            drawTriangle(row, col, x, y, TILE_SIZE, grid.get_flip_state(index));
        }
    }
}
function getTrianglePosition(row, col) {
    const x = col * triangle_height(TILE_SIZE);
    const y = (TILE_SIZE * (row + 1)) / 2;
    return [x, y];
}
function drawTriangle(row, col, x, y, size, flip_state) {
    ctx.save();
    // transform matrix for animatinf while flipping
    if (flip_state != MAX_FLIP_STATES &&
        flip_state != -MAX_FLIP_STATES &&
        clikedIndex != row * grid.width() + col) {
        const transform = TransformMatrix.new();
        const result = transform.apply_transformations(clickedTileX, clickedTileY, x + size / 2, y, flip_state / MAX_FLIP_STATES);
        const transformMatrix = new DOMMatrix([
            result.a,
            result.b,
            result.c,
            result.d,
            result.e,
            result.f,
        ]);
        ctx.setTransform(transformMatrix);
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    if ((row + col) % 2 == 0) {
        ctx.lineTo(x + triangle_height(size), y + size / 2);
        ctx.lineTo(x + triangle_height(size), y - size / 2);
    }
    else {
        ctx.lineTo(x, y + size / 2);
        ctx.lineTo(x + triangle_height(size), y);
        ctx.lineTo(x, y - size / 2);
    }
    ctx.closePath();
    // ctx.strokeText(flip_state.toString(), x + size / 2, y - size / 2)
    // -MAX_FLIP_STATES to MAX_FLIP_STATES flip state is black to white
    // if grid_set_transparent is true, then fade out the color
    if (grid_set_transparent &&
        ((grid_flip_state && flip_state < 0) ||
            (!grid_flip_state && flip_state > 0))) {
        ctx.fillStyle = `hsla(0, 0%, ${((MAX_FLIP_STATES + flip_state) / (2 * MAX_FLIP_STATES)) * 100}%, ${1 - Math.abs(flip_state) / MAX_FLIP_STATES})`;
    }
    else {
        ctx.fillStyle = `hsl(0, 0%, ${((MAX_FLIP_STATES + flip_state) / (2 * MAX_FLIP_STATES)) * 100}%)`;
    }
    // ctx.fillStyle = flip_state < 0 ? "black" : "white"
    ctx.fill();
    // inverse color for the border, white to black
    // ctx.strokeStyle = `hsl(0, 0%, ${
    // 	((MAX_FLIP_STATES - flip_state) / (2 * MAX_FLIP_STATES)) * 100
    // }%)`
    ctx.strokeStyle = "transparent";
    // ctx.strokeStyle = flip_state < 0 ? "white" : "black"
    ctx.stroke();
    ctx.restore();
}
function handleClick(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left + triangle_height(TILE_SIZE) / 2;
        const clickY = event.clientY - rect.top + TILE_SIZE / 2;
        const col = clickX < rect.width / 2
            ? Math.floor(clickX / triangle_height(TILE_SIZE)) - 1
            : Math.floor(clickX / triangle_height(TILE_SIZE));
        const row = clickY < rect.height / 2
            ? Math.floor(clickY / (TILE_SIZE / 2)) - 1
            : Math.floor(clickY / (TILE_SIZE / 2));
        const index = row * grid.width() + col;
        grid.set_flipping(index);
        grid_flip_state = !grid_flip_state;
        revealer.style.background = grid_flip_state
            ? "radial-gradient(circle, white 0%, transparent 50%)"
            : "radial-gradient(circle, black 0%, transparent 50%)";
        body.style.background = grid_flip_state ? "black" : "white";
        clickedTileX =
            col * triangle_height(TILE_SIZE) + triangle_height(TILE_SIZE) / 2;
        clickedTileY = row * (TILE_SIZE / 2) + TILE_SIZE / 4;
        clikedIndex = index;
    });
}
function handleExit(element) {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const x = rect.left +
        rect.width / 2 -
        canvasRect.left +
        triangle_height(TILE_SIZE) / 2;
    const y = rect.top + rect.height / 2 - canvasRect.top + TILE_SIZE / 2;
    const col = Math.floor(x / triangle_height(TILE_SIZE));
    const row = Math.floor(y / (TILE_SIZE / 2));
    const index = row * grid.width() + col;
    // set root color-scheme to match theme - ref : https://fvsch.com/transparent-iframes
    document.documentElement.style.colorScheme = grid_flip_state
        ? "dark"
        : "light";
    grid.set_flipping(index);
    grid_flip_state = !grid_flip_state;
    grid_set_transparent = true;
    revealer.style.background = "transparent";
    body.style.background = "transparent";
    const content = document.getElementsByTagName("content")[0];
    content.style.transition = "opacity 2s";
    content.style.opacity = "0";
    clickedTileX =
        col * triangle_height(TILE_SIZE) + triangle_height(TILE_SIZE) / 2;
    clickedTileY = row * (TILE_SIZE / 2) + TILE_SIZE / 4;
    clikedIndex = index;
}
// let lastTime = 0
// let frameCount = 0
// let fps = 0
// using requestAnimationFrame to animate the flipping of the tile
function animation_loop() {
    if (!grid.all_same()) {
        grid.step_flip_single_to_value(grid_flip_state);
        drawGrid();
    }
}
function run_animation_loop() {
    limitloop(animation_loop, 60);
}
function addTrailingParticles(loader) {
    const trailContainer = document.createElement("div");
    trailContainer.className = "trail-container";
    loader.parentNode.insertBefore(trailContainer, loader);
    const textPosition = loader.parentElement.getBoundingClientRect();
    const textLeft = textPosition.left;
    const textTop = textPosition.top;
    function createParticle(x, y) {
        const particle = document.createElement("div");
        particle.className = "trail-particle";
        particle.style.left = `${x - textLeft}px`;
        particle.style.top = `${y - textTop}px`;
        trailContainer.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    function trackElement(element) {
        const rect = element.getBoundingClientRect();
        createParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    function animate() {
        trackElement(loader);
    }
    setInterval(animate, 1000 / 10);
}
main();