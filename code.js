/** @type {HTMLCanvasElement} */
let canvas;

/** @type {WebGLRenderingContext} */
let gl;

const starPoints = [vec2(0.2, 0.2), vec2(0, 0.3), vec2(-0.2, 0.2), vec2(-0.1, -0.2), vec2(0.1, -0.2)]

let theta = 0.0
let thetaUniform;

let pos;
let posUniform;

let dir = [0,0];

let speed = 0.01
let speedStep = 1

let shouldRotate = true

function init() {
    canvas = document.getElementById("gl-canvas")

    /** @type {WebGLRenderingContext} */
    gl = WebGLUtils.setupWebGL(canvas)
    if (!gl) { alert("WebGL is not available") }

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

    gl.clearColor(1, 0, 0, 1)

    const shader = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shader)

    theta = 0.0
    thetaUniform = gl.getUniformLocation(shader, "theta")
    gl.uniform1f(thetaUniform, theta)

    pos = [0, 0]
    posUniform = gl.getUniformLocation(shader, "uPos")
    gl.uniform2f(posUniform, pos[0], pos[1])

    gl.clear(gl.COLOR_BUFFER_BIT)

    /**
     * Creates and populates a WebGL buffer with data.
     * @param {any[]} data Data that will be put into the buffer.
     * @param {WebGLBuffer | null} bufferId What buffer to put the data into. Creates a new one if none is provided.
     * @returns {WebGLBuffer} Id of the buffer that the data was put into.
     */
    function bindBufferData(data, bufferId) {
        const _bufferId = bufferId || gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, _bufferId)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW)
        return _bufferId
    }

    bindBufferData(starPoints)
    const myPositionAttribute = gl.getAttribLocation(shader, "myPosition")
    gl.vertexAttribPointer(myPositionAttribute, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(myPositionAttribute)

    gl.uniform3f(gl.getUniformLocation(shader, "myColor"), 1, 1, 0)

    render()
}

window.onload = init()

document.getElementById("increaseSpeed").addEventListener("click", () => {
    speedStep++
    speed = 0.01 * speedStep
})

document.getElementById("decreaseSpeed").addEventListener("click", () => {
    if (speedStep > 0) {
        speedStep--
        speed = 0.01 * speedStep
    }
})

document.getElementById("startRotate").addEventListener("click", () => {
    shouldRotate = true
})

document.getElementById("stopRotate").addEventListener("click", () => {
    shouldRotate = false
})

// window.addEventListener("keydown", ({ key }) => {
//     if (key === "w") {
//         dir[1] = speed
//         dir[0] = 0
//     }
//     else if (key === "s") {
//         dir[1] = -speed
//         dir[0] = 0
//     }
//     else if (key === "a") {
//         dir[0] = -speed
//         dir[1] = 0
//     }
//     else if (key === "d") {
//         dir[0] = speed
//         dir[1] = 0
//     }
// })

window.addEventListener("keydown", ({ key }) => {
    if (key === "w")
        dir = [0,1]
    else if (key === "s")
        dir = [0,-1]
    else if (key === "a")
        dir = [-1,0]
    else if (key === "d")
        dir = [1,0]
})

canvas.addEventListener("mousedown", ({ x, y }) => pos = [x / canvas.width * 2 - 1, -(y / canvas.height * 2 - 1)])

function render() {
    pos[0] += dir[0]*speed
    pos[1] += dir[1]*speed

    if (shouldRotate) theta += 0.01
    gl.uniform1f(thetaUniform, theta)

    gl.uniform2f(posUniform, pos[0], pos[1])

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, starPoints.length)

    requestAnimationFrame(render)
}