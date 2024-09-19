import { Color, Euler, Group, Vector3, Vector3Like } from "three";
import CubeFrame from "../src/objects/CubeFrame";
import BatchCube from "../src/objects/BatchCube";
import CubeAnnotation from "../src/objects/ObjectAnnotation";
import ObjectAnnotation from "../src/objects/ObjectAnnotation";

class StaticCube extends Group {
  cube: BatchCube;
  frame: CubeFrame;
  annotation: CubeAnnotation;

  constructor(color: Color) {
    super();

    this.frame = new CubeFrame(color);
    this.cube = new BatchCube(color);

    this.annotation = new ObjectAnnotation("Object", color);
    this.annotation.position.copy(new Vector3(0, 0, 0.6));

    this.add(this.frame);
    this.attach(this.annotation);

    // Important: BatchCube is designed to be added to a BatchMesh, and NOT directly to the scene graph
    // Therefore we DO NOT add BatchCube to this object, it is handled by the Viewer
    // If we can find a better way to do this that would be awesome
  }

  // Cube is a BatchCube and is not directly a child of this class
  // Therefore this method should be called whenever we want to update its geometry
  setGeometry(geometry: {
    position?: Vector3Like;
    rotation?: Euler;
    scale?: Vector3Like;
  }) {
    if (geometry.position) {
      this.position.copy(geometry.position);
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
  }
}

export default StaticCube;
