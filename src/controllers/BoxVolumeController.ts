import { BatchedMesh, Scene } from "three";
import BatchBoxVolume from "../objects/BatchBoxVolume";
import { BATCH_CUBE_GEOMETRY, BATCH_CUBE_MATERIAL } from "../objects/BatchCube";
import AnnotationController from "./AnnotationController";

class BatchBoxVolumeController {
  scene: Scene;
  annotationController: AnnotationController;

  boxVolumes: BatchBoxVolume[];

  cubeBatchedMesh: BatchedMesh;
  batchGeometryId: number;

  constructor(scene: Scene, annotationController: AnnotationController) {
    this.scene = scene;
    this.annotationController = annotationController;

    this.boxVolumes = [];

    this.cubeBatchedMesh = new BatchedMesh(
      10000,
      512,
      1024,
      BATCH_CUBE_MATERIAL
    );

    this.batchGeometryId =
      this.cubeBatchedMesh.addGeometry(BATCH_CUBE_GEOMETRY);

    this.scene.add(this.cubeBatchedMesh);
  }

  add(object: BatchBoxVolume) {
    // Directly add the frame to the scene
    this.scene.add(object.frame);

    // Batch Cube - add it seperately
    object.cube.updateMatrixWorld();
    object.cube.batchInstanceId = this.cubeBatchedMesh.addInstance(
      this.batchGeometryId
    );

    this.cubeBatchedMesh.setColorAt(
      object.cube.batchInstanceId,
      object.cube.color
    );
    this.cubeBatchedMesh.setMatrixAt(
      object.cube.batchInstanceId,
      object.cube.matrixWorld
    );
    this.cubeBatchedMesh.computeBoundingSphere();

    // Annotation
    this.annotationController.add(object.annotation);

    this.boxVolumes.push(object);
  }
}

export default BatchBoxVolumeController;
