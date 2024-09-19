import { BatchedMesh, Scene } from "three";
import BatchBoxVolume from "../objects/BatchBoxVolume/BatchBoxVolume";
import {
  BATCH_CUBE_GEOMETRY,
  BATCH_CUBE_MATERIAL,
} from "../objects/BatchBoxVolume/BatchCube";
import AnnotationController from "./AnnotationController";
import {
  BATCH_LINE_GEOMETRY,
  BATCH_LINE_MATERIAL,
} from "../objects/BatchBoxVolume/BatchFrame";
import { BatchedLine } from "../objects/BatchedLine";

class BatchBoxVolumeController {
  scene: Scene;
  annotationController: AnnotationController;

  boxVolumes: BatchBoxVolume[];

  cubeBatchedMesh: BatchedMesh;
  batchCubeGeometryId: number;

  frameBatchedMesh: BatchedLine;
  batchFrameGeometryId: number;

  constructor(scene: Scene, annotationController: AnnotationController) {
    this.scene = scene;
    this.annotationController = annotationController;

    this.boxVolumes = [];

    this.cubeBatchedMesh = new BatchedMesh(
      5000,
      512,
      1024,
      BATCH_CUBE_MATERIAL
    );
    this.batchCubeGeometryId =
      this.cubeBatchedMesh.addGeometry(BATCH_CUBE_GEOMETRY);

    this.frameBatchedMesh = new BatchedLine(
      5000,
      512,
      1024,
      BATCH_LINE_MATERIAL
    );

    (this.frameBatchedMesh as any).isLine = true;

    this.batchFrameGeometryId =
      this.frameBatchedMesh.addGeometry(BATCH_LINE_GEOMETRY);

    this.scene.add(this.cubeBatchedMesh);
    this.scene.add(this.frameBatchedMesh);
  }

  add(object: BatchBoxVolume) {
    // Directly add the frame to the scene
    //this.scene.add(object.frame);

    // Batch Cube
    object.cube.updateMatrixWorld();
    object.cube.batchInstanceId = this.cubeBatchedMesh.addInstance(
      this.batchCubeGeometryId
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

    // Batch Frame
    object.frame.updateMatrixWorld();
    object.frame.batchInstanceId = this.frameBatchedMesh.addInstance(
      this.batchFrameGeometryId
    );
    this.frameBatchedMesh.setColorAt(
      object.frame.batchInstanceId,
      object.frame.color
    );
    this.frameBatchedMesh.setMatrixAt(
      object.frame.batchInstanceId,
      object.frame.matrixWorld
    );
    this.frameBatchedMesh.computeBoundingSphere();

    // Annotation
    this.annotationController.add(object.annotation);

    this.boxVolumes.push(object);
  }
}

export default BatchBoxVolumeController;
