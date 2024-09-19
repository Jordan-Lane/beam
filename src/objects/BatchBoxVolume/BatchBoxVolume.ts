import { Box3, Color, Euler, Vector3, Vector3Like } from "three";
import BatchCube from "./BatchCube";
import ObjectAnnotation from "../ObjectAnnotation";
import BatchFrame from "./BatchFrame";

export type BoxVolumeOptions = {
  name?: string;
  color?: Color;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
};

class BatchBoxVolume {
  name: string;

  cube: BatchCube;
  frame: BatchFrame;
  annotation: ObjectAnnotation;

  constructor({ name, color, position, rotation, scale }: BoxVolumeOptions) {
    const startingColor = color ?? new Color(0x000000);

    this.name = name ?? "New Object";

    this.frame = new BatchFrame(startingColor);
    this.cube = new BatchCube(startingColor);

    this.annotation = new ObjectAnnotation(this.name, startingColor);

    this.setGeometry({ position, rotation, scale });
  }

  setColor(color: Color) {
    this.frame.color = color;
    this.cube.color = color;
    this.annotation.setColor(color);
  }

  setGeometry(geometry: {
    position?: Vector3Like;
    rotation?: Euler;
    scale?: Vector3Like;
  }) {
    if (geometry.position) {
      this.frame.position.copy(geometry.position);
      this.cube.position.copy(geometry.position);
    }
    if (geometry.rotation) {
      this.frame.rotation.copy(geometry.rotation);
      this.cube.rotation.copy(geometry.rotation);
    }
    if (geometry.scale) {
      this.frame.scale.copy(geometry.scale);
      this.cube.scale.copy(geometry.scale);
    }

    const box = new Box3().setFromObject(this.frame);
    const maxZ = box.max.z;

    this.annotation.position.set(
      this.frame.position.x,
      this.frame.position.y,
      maxZ
    );
  }
}

export default BatchBoxVolume;
