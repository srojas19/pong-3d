export function createCuboid(gl, length, height, width, transparency) {

  let x = length/2;
  let y = height/2;
  let z = width/2;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    -x, -y,  z,
     x, -y,  z,
     x,  y,  z,
    -x,  y,  z,

    // Back face
    -x, -y, -z,
    -x,  y, -z,
     x,  y, -z,
     x, -y, -z,

    // Top face
    -x,  y, -z,
    -x,  y,  z,
     x,  y,  z,
     x,  y, -z,

    // Bottom face
    -x, -y, -z,
     x, -y, -z,
     x, -y,  z,
    -x, -y,  z,

    // Right face
     x, -y, -z,
     x,  y, -z,
     x,  y,  z,
     x, -y,  z,

    // Left face
    -x, -y, -z,
    -x, -y,  z,
    -x,  y,  z,
    -x,  y, -z,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const faceColors = [
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
  ];


  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
  
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

export function createBox(gl, length, height, width, transparency) {

  let x = length/2;
  let y = height/2;
  let z = width/2;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    -x, -y,  z,
     x, -y,  z,
     x,  y,  z,
    -x,  y,  z,

    // Back face
    -x, -y, -z,
    -x,  y, -z,
     x,  y, -z,
     x, -y, -z,

    // Top face
    -x,  y, -z,
    -x,  y,  z,
     x,  y,  z,
     x,  y, -z,

    // Bottom face
    -x, -y, -z,
     x, -y, -z,
     x, -y,  z,
    -x, -y,  z,

    // Right face
     x, -y, -z,
     x,  y, -z,
     x,  y,  z,
     x, -y,  z,

    // Left face
    -x, -y, -z,
    -x, -y,  z,
    -x,  y,  z,
    -x,  y, -z,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const faceColors = [
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
    [1.0, 1.0, 1.0, transparency],
  ];


  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,1,    1,2,    2,3,    3,0, 
    4,5,    5,6,    6,7,    7,4, 
    8,9,    9,10,   10,11,  11,8, 
    12,13,  13,14,  14,15,  15,12,
    16,17,  17,18,  18,19,  19,16,
    20,21,  21,22,  22,23,  23,20,
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}