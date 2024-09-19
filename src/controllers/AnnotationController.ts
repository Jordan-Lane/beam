import {
  Frustum,
  Matrix4,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
} from "three";
import { CSS2DObject } from "three-stdlib";

class AnnotationController {
  scene: Scene;
  annotationRoot: Object3D;

  cachedProjectionMatrix: Matrix4;
  cachedMatrixWorldInverse: Matrix4;

  constructor(scene: Scene) {
    this.scene = scene;
    this.cachedProjectionMatrix = new Matrix4();
    this.cachedMatrixWorldInverse = new Matrix4();

    this.annotationRoot = new Object3D();
    this.scene.add(this.annotationRoot);
  }

  add(annotation: CSS2DObject) {
    this.annotationRoot.add(annotation);
  }

  remove(annotation: CSS2DObject) {
    this.annotationRoot.remove(annotation);
  }

  update(camera: PerspectiveCamera | OrthographicCamera) {
    if (
      this.cachedMatrixWorldInverse.equals(camera.matrixWorldInverse) &&
      this.cachedProjectionMatrix.equals(camera.projectionMatrix)
    ) {
      return;
    }

    const frustrum = new Frustum().setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );

    const annotationsInFrustrum: CSS2DObject[] = [];
    this.annotationRoot.traverse((annotation) => {
      if (
        annotation instanceof CSS2DObject &&
        (annotation as CSS2DObject).element?.style &&
        frustrum.containsPoint(annotation.position)
      ) {
        annotationsInFrustrum.push(annotation as CSS2DObject);
      }
    });

    const sortedAnnotations = (annotationsInFrustrum as CSS2DObject[]).sort(
      (a: CSS2DObject, b: CSS2DObject) =>
        Number(b.element.style.zIndex) - Number(a.element.style.zIndex)
    );

    sortedAnnotations.forEach((annotation, index) => {
      annotation.visible = index <= 250;
    });

    this.cachedMatrixWorldInverse = camera.matrixWorldInverse.clone();
    this.cachedProjectionMatrix = camera.projectionMatrix.clone();
  }
}

export default AnnotationController;
