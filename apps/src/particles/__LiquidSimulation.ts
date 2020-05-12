// import { pixelsPerFace, matrixWidth, matrixHeight, faceWidth, faceHeight, faceLength } from "../utils/const";
// import { Point2D } from "../maze/Point2D";
// import { randomIntRange, randomRange } from "../utils/misc";
// import { LedMatrixInstance } from "rpi-led-matrix";

// // https://peeke.nl/simulating-blobs-of-fluid

// import { SpatialHashMap } from "./SpacialHashmap";

// import { multiplyScalar, length, lengthSq, add, subtract, unit, unitApprox, clone } from "./math";

// export function createSim() {
//   const calculateViewportHeight = (perspectiveAngle: number, distance: number) => {
//     return Math.tan((perspectiveAngle / 2 / 180) * Math.PI) * distance * 2;
//   };

//   const viewportHeight = faceLength;

//   const PARTICLE_COUNT = 64 * 30;

//   const GRID_CELLS = 54;

//   const STIFFNESS = 35;
//   const STIFFNESS_NEAR = 100;
//   const REST_DENSITY = 5;
//   const INTERACTION_RADIUS = 4;
//   const INTERACTION_RADIUS_INV = 1 / INTERACTION_RADIUS;
//   const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS ** 2;

//   const GRAVITY_FORCE = [0, -35];
//   const SCROLL_FORCE = [0, 0];
//   const ACCELERATION_FORCE = [0, 0];

//   // const particleMeshes = [
//   //   gradientCircle(INTERACTION_RADIUS, REST_DENSITY, new THREE.Color(1, 0, 0)),
//   //   gradientCircle(INTERACTION_RADIUS, REST_DENSITY, new THREE.Color(0, 1, 0)),
//   //   gradientCircle(INTERACTION_RADIUS, REST_DENSITY, new THREE.Color(0, 0, 1))
//   // ];

//   const state = {
//     x: new Float32Array(PARTICLE_COUNT),
//     y: new Float32Array(PARTICLE_COUNT),
//     oldX: new Float32Array(PARTICLE_COUNT),
//     oldY: new Float32Array(PARTICLE_COUNT),
//     vx: new Float32Array(PARTICLE_COUNT),
//     vy: new Float32Array(PARTICLE_COUNT),
//     p: new Float32Array(PARTICLE_COUNT),
//     pNear: new Float32Array(PARTICLE_COUNT),
//     g: new Float32Array(PARTICLE_COUNT),
//     color: new Uint8Array(PARTICLE_COUNT),
//     mesh: [],
//     neighbors: [],
//   };

//   // const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
//   // renderer.setPixelRatio(dpr);

//   // const scene = new THREE.Scene();
//   // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//   // camera.position.z = 30;

//   // const composer = new THREE.EffectComposer(renderer);
//   // const renderPass = new THREE.RenderPass(scene, camera);
//   // renderPass.renderToScreen = !RENDER_PLANE;
//   // composer.addPass(renderPass);

//   // const blendPointsPass = new THREE.ShaderPass(BlendPointsShader);
//   // if (RENDER_PLANE) {
//   //   blendPointsPass.renderToScreen = true;
//   //   blendPointsPass.uniforms.horizontalCells.value = GRID_CELLS;
//   //   blendPointsPass.uniforms.verticalCells.value = GRID_CELLS;
//   //   composer.addPass(blendPointsPass);
//   // }

//   const canvasRect = {
//     w: viewportHeight,
//     h: viewportHeight,
//     l: viewportHeight * -0.485,
//     r: viewportHeight * 0.485,
//     t: viewportHeight * 0.485,
//     b: viewportHeight * -0.485,
//     radius: viewportHeight * 0.485,
//     radiusSq: (viewportHeight * 0.485) ** 2,
//   };

//   const mass = (i: number) => {
//     return 0.85 + state.color[i] / 10;
//   };

//   const hashMap = new SpatialHashMap(GRID_CELLS, GRID_CELLS);

//   // const light = new THREE.PointLight(0xffffff, 1, 100);
//   // light.position.set(20, 10, 30);
//   // scene.add(light);


//   const data = new Uint8Array(4 * GRID_CELLS * GRID_CELLS);

//   // blendPointsPass.uniforms.resolution.value.set(
//   //   width * dpr,
//   //   height * dpr
//   // );

//   // const dataTexture = new THREE.DataTexture(
//   //   data,
//   //   GRID_CELLS,
//   //   GRID_CELLS,
//   //   THREE.RGBAFormat,
//   //   THREE.UnsignedByteType
//   // );

//   // dataTexture.magFilter = THREE.LinearFilter;
//   // blendPointsPass.uniforms.grid.value = dataTexture;

//   for (let i = 0; i < PARTICLE_COUNT; i++) {
//     state.x[i] = Math.cos(Math.random() * 2 * Math.PI) * Math.sqrt(Math.random()) * canvasRect.r;
//     state.y[i] = Math.cos(Math.random() * 2 * Math.PI) * Math.sqrt(Math.random()) * canvasRect.t;
//     state.oldX[i] = state.x[i];
//     state.oldY[i] = state.y[i];
//     state.vx[i] = 0;
//     state.vy[i] = 0;
//     state.color[i] = Math.floor(Math.random() * 3);

//     const gridX = (state.x[i] / canvasRect.w + 0.5) * GRID_CELLS;
//     const gridY = (state.y[i] / canvasRect.h + 0.5) * GRID_CELLS;
//     hashMap.add(gridX, gridY, i);
//   }

//   // for (let i = 0; i < PARTICLE_COUNT; i++) {
//   //   const mesh = particleMeshes[state.color[i]].clone();
//   //   state.mesh[i] = mesh;
//   //   scene.add(mesh);
//   // }

//   let acceleration = [0, 0];

//   const simulate = (dt: number) => {
//     hashMap.clear();

//     // const newScroll = scrollY
//     // SCROLL_FORCE[1] = Math.min(140, Math.max(-140, (newScroll - scroll) / dt / 5))
//     // scroll = newScroll

//     ACCELERATION_FORCE[0] = (acceleration[0] / dt) * 2;
//     ACCELERATION_FORCE[1] = (acceleration[1] / dt) * 2;
//     acceleration = [0, 0];

//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       // Update old position
//       state.oldX[i] = state.x[i];
//       state.oldY[i] = state.y[i];

//       applyGlobalForces(i, dt);

//       // Update positions
//       state.x[i] += state.vx[i] * dt;
//       state.y[i] += state.vy[i] * dt;

//       // Update hashmap
//       const gridX = (state.x[i] / canvasRect.w + 0.5) * GRID_CELLS;
//       const gridY = (state.y[i] / canvasRect.h + 0.5) * GRID_CELLS;
//       hashMap.add(gridX, gridY, i);
//     }

//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       const neighbors = getNeighborsWithGradients(i);

//       updatePressure(i, neighbors);

//       // perform double density relaxation
//       relax(i, neighbors, dt);
//     }

//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       // Constrain the particles to a container
//       contain(i, dt);

//       // Calculate new velocities
//       calculateVelocity(i, dt);

//       // Update
//       //state.mesh[i].position.set(state.x[i], state.y[i], 0);
//     }
//   };

//   const applyGlobalForces = (i: number, dt: number) => {
//     let force = [0, 0];
//     force = add(force, Array.from(GRAVITY_FORCE));
//     force = add(force, Array.from(SCROLL_FORCE));
//     force = add(force, Array.from(ACCELERATION_FORCE));
//     force = add(force, [0, -0.25 * state.color[i]]);

//     // f = m * a --> a = f / m
//     // v += a * dt --> v += f * dt / m

//     const m = mass(i);
//     state.vx[i] += (force[0] * dt) / m;
//     state.vy[i] += (force[1] * dt) / m;
//   };

//   const getNeighborsWithGradients = (i: number) => {
//     const gridX = (state.x[i] / canvasRect.w + 0.5) * GRID_CELLS;
//     const gridY = (state.y[i] / canvasRect.h + 0.5) * GRID_CELLS;
//     const radius = (INTERACTION_RADIUS / canvasRect.w) * GRID_CELLS;
//     const results = hashMap.query(gridX, gridY, radius);

//     const neighbors = [];

//     for (let k = 0; k < results.length; k++) {
//       const n = results[k];
//       if (i === n) continue;

//       const g = gradient(i, n);
//       if (!g) continue;

//       state.g[n] = g;
//       neighbors.push(n);
//     }

//     return neighbors;
//   };

//   const updatePressure = (i: number, neighbors: number[]) => {
//     let density = 0;
//     let nearDensity = 0;

//     for (let k = 0; k < neighbors.length; k++) {
//       const g = state.g[neighbors[k]];
//       const m = mass(i);
//       density += g * g * m;
//       nearDensity += g * g * g * m;
//     }

//     const m = mass(i);
//     state.p[i] = STIFFNESS * (density - REST_DENSITY) * m;
//     state.pNear[i] = STIFFNESS_NEAR * nearDensity * m;
//   };

//   const relax = (i: number, neighbors: number[], dt: number) => {
//     const pos = [state.x[i], state.y[i]];

//     for (let k = 0; k < neighbors.length; k++) {
//       const n = neighbors[k];
//       const g = state.g[n];
//       const nPos = [state.x[n], state.y[n]];

//       const magnitude = state.p[i] * g + state.pNear[i] * g * g;
//       const f = state.color[i] === state.color[n] ? 0.99 : 1;
//       const d = multiplyScalar(unitApprox(subtract(nPos, pos)), magnitude * f * dt * dt);

//       const massI = mass(i);
//       const massJ = mass(n);
//       const mt = massI + massJ;

//       state.x[i] -= d[0] * (massJ / mt);
//       state.y[i] -= d[1] * (massJ / mt);

//       state.x[n] += d[0] * (massI / mt);
//       state.y[n] += d[1] * (massI / mt);
//     }
//   };

//   const gradientCache = new Float32Array(Math.ceil(INTERACTION_RADIUS_SQ * 5));

//   const gradient = (i: number, n: number): number => {
//     const a = [state.x[i], state.y[i]];
//     const b = [state.x[n], state.y[n]];

//     const lsq = lengthSq(subtract(a, b));
//     if (lsq > INTERACTION_RADIUS_SQ) return 0;

//     const cacheIndex = (lsq * 5) | 0;
//     if (gradientCache[cacheIndex]) return gradientCache[cacheIndex];

//     const g = Math.max(0, 1 - Math.sqrt(lsq) * INTERACTION_RADIUS_INV);

//     gradientCache[cacheIndex] = g;
//     return g;
//   };

//   const contain = (i: number, dt: number) => {
//     const pos = [state.x[i], state.y[i]];
//     const unitPos = unit(pos);
//     const m = mass(i);
//     const antiStickVelocity = multiplyScalar(unitPos, INTERACTION_RADIUS * 2);

//     if (state.x[i] < 0) {
//       state.x[i] = 0;
//       state.oldX[i] += (antiStickVelocity[0] * dt) / m;
//       state.vx[i] = -state.vx[i];
//     }

//     if (state.y[i] < 0) {
//       state.y[i] = 0;
//       state.oldY[i] += (antiStickVelocity[1] * dt) / m;
//       state.vy[i] = -state.vy[i];
//     }

//     if (state.x[i] > faceWidth) {
//       state.x[i] = faceWidth;
//       state.oldX[i] += (antiStickVelocity[0] * dt) / m;
//       state.vx[i] = -state.vx[i];
//     }

//     if (state.y[i] > faceHeight) {
//       state.y[i] = faceHeight;
//       state.oldY[i] += (antiStickVelocity[1] * dt) / m;
//       state.vy[i] = -state.vy[i];
//     }

//     // if (lengthSq(pos) > canvasRect.radiusSq) {
//     //   const unitPos = unit(pos)
//     //   const newPos = multiplyScalar(clone(unitPos), canvasRect.radius)
//     //   state.x[i] = newPos[0]
//     //   state.y[i] = newPos[1]

//     //   const m = mass(i)
//     //   const antiStickVelocity = multiplyScalar(unitPos, INTERACTION_RADIUS * 2)
//     //   state.oldX[i] += antiStickVelocity[0] * dt / m
//     //   state.oldY[i] += antiStickVelocity[1] * dt / m
//     // }
//   };

//   const calculateVelocity = (i: number, dt: number) => {
//     let old = [state.oldX[i], state.oldY[i]];
//     const pos = [state.x[i], state.y[i]];

//     const v = multiplyScalar(subtract(pos, old), 1 / dt);

//     state.vx[i] = v[0];
//     state.vy[i] = v[1];
//   };

//   const update = (deltaMS: number) => simulate(deltaMS / 1000);
//   const render = (matrix: LedMatrixInstance) => {
//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       matrix.fgColor(0xffffff);
//       matrix.setPixel(state.x[i], state.y[i]);
//     }
//   };

//   return {
//     update,
//     render,
//   };
// }
