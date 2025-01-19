
// rob

let deltaTime = 0;
let lastTime = Date.now();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const font_size = width < height ? width / 3 : height / 2;
const centerX = width / 2;
const centerY = height / 2;
let mouseX = centerX;
let mouseY = centerY;

let word = "rob"
if (Math.random() < 0.01) {
    word = "nob"
}

class Rob {
    constructor(colour = false, x = centerX, y = centerY, parent = false) {
        this.colour = colour ? colour : 180
        this.x = x
        this.y = y
        this.speed = width > height ? font_size / 3 : font_size / 2
        this.angle = 0
        this.targetX = parent.x ? parent.x : centerX
        this.targetY = parent.y ? parent.y : centerY
        this.parent = parent
    }

    move(targetX = this.parent.x, targetY = this.parent.y) {
        if (Math.abs(robs[0].x - centerX) < 1 && Math.abs(robs[0].y - centerY) < 1 && (robs[0] == this)) {
            // center the rob if it's the first one and it's close enough to the center
            // so it's ready and tidy for deletion
            this.x = centerX
            this.y = centerY
        } else {
            // move the rob towards the target
            this.angle = Math.atan2(targetY - this.y, targetX - this.x)
            this.x += Math.cos(this.angle) * this.speed * deltaTime
            this.y += Math.sin(this.angle) * this.speed * deltaTime
            // nudge the rob towards the center a bit
            let angle_to_center = Math.atan2(centerY - this.y, centerX - this.x)
            this.x += Math.cos(angle_to_center) * (this.speed / 6) * deltaTime
            this.y += Math.sin(angle_to_center) * (this.speed / 6) * deltaTime
        }
    }

    draw(x = this.x, y = this.y, colour = false) {
        ctx.font = `900 ${font_size}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = colour ? colour : `hsl(${this.colour}, 65%, 85%)`
        ctx.fillText(word, x, y);
    }
}

const mainRob = new Rob(false, centerX, centerY)
const robs = [new Rob(0, mouseX, mouseY, parent = mainRob)]

let colourIndex = 0
let touching = false

function run() {
    // clear the canvas with alpha so the robs fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    // move and recolour the robs
    for (let i = 0; i < robs.length; i++) {
        robs[i].move()
        robs[i].colour -= 3.5
    }

    // delete the robs that are too far away or centered
    clean()

    // add new robs if there's room and user is interacting
    if (robs.length < 500 && (touching || mouseX != centerX || mouseY != centerY)) {
        robs.push(new Rob(colourIndex, mouseX, mouseY, parent = robs[robs.length - 1]))
    }

    // reset the mouse position if the user isn't interacting
    if (!touching) {
        mouseX = centerX
        mouseY = centerY
    }

    // change the starting colour of the next new rob
    colourIndex -= 1

    // draw the robs
    for (let i = 1; i < robs.length; i++) {
        robs[i].draw()
    }
    mainRob.draw()

    update_fps()
    requestAnimationFrame(run);
}

function clean() {
    if ((robs.length > 1) && ((Math.abs(robs[0].x - centerX) < 1 && Math.abs(robs[0].y - centerY) < 1) || (robs[0].x < -width * 0.5 || robs[0].x > width * 1.5 || robs[0].y < -height * 0.5 || robs[0].y > height * 1.5))) {
        // delete the first rob
        robs.splice(0, 1)
        robs[0].parent = mainRob
        // mmmmm recursion
        clean()
    }
}


const fps_counter = document.getElementsByClassName("fps-counter")[0];
let fpses = [];

function update_fps() {
    fpses.push(1 / deltaTime)
    if (fpses.length > 10) {
        fpses.splice(0, 1)
    }
    let fps = 0
    for (let i = 0; i < fpses.length; i++) {
        fps += fpses[i]
    }
    fps /= fpses.length
    fps_counter.innerHTML = `${Math.round(fps)} fps, ${robs.length} ${word}${robs.length == 1 ? "" : "s"}`
}

const is_mobile = /Mobi|Android/i.test(navigator.userAgent);
if (is_mobile) {
    document.addEventListener('touchstart', (e) => {
        e.preventDefault()
        let pos = getMousePos(canvas, e.touches[0])
        mouseX = pos.x
        mouseY = pos.y
        touching = true
    })

    document.addEventListener('touchend', (e) => {
        e.preventDefault()
        touching = false
    })

    document.addEventListener('touchmove', (e) => {
        e.preventDefault()
        let pos = getMousePos(canvas, e.touches[0])
        mouseX = pos.x
        mouseY = pos.y
    })
} else {
    document.addEventListener('mousedown', (e) => {
        let pos = getMousePos(canvas, e)
        mouseX = pos.x
        mouseY = pos.y
        touching = true
    })
    document.addEventListener('mouseup', (e) => {
        touching = false
    })
    document.addEventListener('mousemove', (e) => {
        if (touching) {
            let pos = getMousePos(canvas, e)
            mouseX = pos.x
            mouseY = pos.y
        }
    })
}

function getMousePos(canvas, event) {
    // how to get mouse position on canvas from https://stackoverflow.com/a/17130415
    // (thanks for the link, github copilot!)
    let area = canvas.getBoundingClientRect();
    return {
        x: event.clientX - area.left,
        y: event.clientY - area.top
    }
}

run()