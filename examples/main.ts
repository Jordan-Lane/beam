import "./style.css";
import { Viewer } from "../src";
import { Color, Euler, Vector3 } from "three";
import Cube from "./Cube";
import BoxVolume from "../src/objects/BoxVolume";
import BatchCube from "../src/objects/BatchBoxVolume/BatchCube";
import BatchFrame from "../src/objects/CubeFrame";
import BatchBoxVolume from "../src/objects/BatchBoxVolume/BatchBoxVolume";

const element = document.querySelector<HTMLElement>("#app")!;

const viewer = new Viewer();
viewer.initialize(element);

// Pointcloud
const pco = await viewer.addPointCloud(
  "cloud.js",
  "https://cdn.jsdelivr.net/gh/potree/potree@develop/pointclouds/lion_takanawa/"
);

pco.translateY(7);
pco.translateX(-1);
pco.translateZ(-7);

viewer.scene.background = new Color(0xdddddd);

// BatchBoxVolumes
for (let i = 0; i < 5000; i++) {
  const position = new Vector3(
    Math.random() * 40 - 20,
    Math.random() * 40 - 20,
    Math.random() * 40 - 20
  );
  const rotation = new Euler(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI
  );
  const scale = new Vector3(
    Math.random() * 4 - 2,
    Math.random() * 4 - 2,
    Math.random() * 4 - 2
  );

  const name = (Math.random() + 1).toString(36).substring(7);
  const color = new Color(Math.random(), Math.random(), Math.random());
  const boxVolume = new BatchBoxVolume({
    color,
    position,
    rotation,
    scale,
    name,
  });

  viewer.addBatchBoxVolume(boxVolume);
}

/*
// Regular BoxVolumes
for (let i = 0; i < 5000; i++) {
  const position = new Vector3(
    Math.random() * 40 - 20,
    Math.random() * 40 - 20,
    Math.random() * 40 - 20
  );
  const rotation = new Euler(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI
  );
  const scale = new Vector3(
    Math.random() * 4 - 2,
    Math.random() * 4 - 2,
    Math.random() * 4 - 2
  );

  const name = (Math.random() + 1).toString(36).substring(7);
  const color = new Color(Math.random(), Math.random(), Math.random());
  const boxVolume = new BoxVolume({
    color,
    position,
    rotation,
    scale,
    name,
  });

  viewer.add(boxVolume);
}
*/

/*
// Splat
await viewer.addSplat(
  "/garden.ksplat",
  {
    showLoadingUI: false,
    progressiveLoad: false,
    rotation: [0, 0, 0, 0],
    position: [0, 0, 0],
  },
  {
    rotation: new Euler(
      2.0162469584988587,
      0.1871202389919283,
      3.112559408731055
    ),
  }
);
*/

console.log(viewer.scene);

// For debugging in the console
// @ts-expect-error
window.viewer = viewer;
