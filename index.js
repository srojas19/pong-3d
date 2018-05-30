import Game from "./game.js";
import {createCuboid, createBox} from './graphics.js';

const vs = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;
  
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

const fs = `
  varying lowp vec4 vColor;
  void main(void) {
    gl_FragColor = vColor;
  }
`;
let game = new Game();

main();

function main() {
  const canvas = document.querySelector('#canvas');
  const score = document.getElementById('score');
  const paused = document.getElementById('paused');
  
  canvas.focus();
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');


  window.addEventListener('keyup', (e) => game.key.onKeyup(e));
  window.addEventListener('keydown', (e) => game.key.onKeydown(e));
  window.addEventListener('keypress', (e) => {if(e.key == " ") game.pause()});

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const shaderProgram = initShaderProgram(gl, vs, fs);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  let gBox = createBox(gl, 10, 10, 20, 0.0);
  gBox.modelViewMatrix = mat4.create();
  let gPlayer = createCuboid(gl, 1, 1, 0.1, 0.05);
  gPlayer.modelViewMatrix = mat4.create();
  let gOpponent = createCuboid(gl, 1, 1, 0.1, 1.0);
  gOpponent.modelViewMatrix = mat4.create();
  let gBall = createCuboid(gl, 0.25, 0.25, 0.25, 1.0);
  gBall.modelViewMatrix = mat4.create();

  let objects = [gBox, gPlayer, gOpponent, gBall];

  var then = 0;
  function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    game.update();
    score.innerHTML = 'Player: ' + game.playerScore + " AI: " + game.aiScore;
    paused.innerHTML = game.isPaused ? "PAUSED" : "";
    drawScene(gl, programInfo, objects);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  
}

function drawScene(gl, programInfo, objects) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  // gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  gl.depthFunc(gl.ALWAYS);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  let projectionMatrix = mat4.create();
  let lookAt = mat4.create();

  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  mat4.lookAt(lookAt, 
  [0.0, 2.0, 25.0],
  [0.0, 0.0,  0.0],
  [0.0, 1.0,  0.0]);

  mat4.multiply(projectionMatrix, projectionMatrix, lookAt);

  mat4.translate(objects[1].modelViewMatrix, mat4.create(), game.playerPosition);
  mat4.translate(objects[2].modelViewMatrix, mat4.create(), game.aiPosition);
  mat4.translate(objects[3].modelViewMatrix, mat4.create(), game.ballPosition);
  
  drawObject(gl, programInfo, objects[0], projectionMatrix,gl.LINES);
  for (let i = 1; i <= 3; i++) {
    drawObject(gl, programInfo, objects[i], projectionMatrix,gl.TRIANGLES);
  }
}

function drawObject(gl, programInfo, object, projectionMatrix, drawMode) {

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, object.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, object.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indices);

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      object.modelViewMatrix);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(drawMode, vertexCount, type, offset);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

