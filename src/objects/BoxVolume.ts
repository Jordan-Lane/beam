import {
  Box3,
  BoxGeometry,
  Color,
  Euler,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import CubeFrame from "./CubeFrame";
import ObjectAnnotation from "./ObjectAnnotation";

export type BoxVolumeOptions = {
  name?: string;
  color?: Color;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
};

class BoxVolume extends Group {
  cube: Mesh;
  frame: CubeFrame;
  annotation: ObjectAnnotation;

  constructor(options: BoxVolumeOptions) {
    super();

    const {
      color = new Color(0x000000),
      position,
      scale,
      name,
      rotation,
    } = options;

    this.name = name ?? "New object";

    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      depthTest: true,
      depthWrite: false,
    });

    this.frame = new CubeFrame(color);
    this.cube = new Mesh(cubeGeometry, cubeMaterial);
    this.annotation = new ObjectAnnotation(this.name, color);

    this.add(this.frame);
    this.add(this.cube);

    if (position) {
      this.position.copy(position);
    }
    if (rotation) {
      this.rotation.copy(rotation);
    }
    if (scale) {
      this.scale.copy(scale);
    }

    this.updateAnnotationPosition();
  }

  updateAnnotationPosition() {
    const box = new Box3().setFromObject(this);
    const maxZ = box.max.z;

    this.annotation.position.set(this.position.x, this.position.y, maxZ);
  }
}

export default BoxVolume;
