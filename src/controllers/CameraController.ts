import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import * as TWEEN from "@tweenjs/tween.js";

class CameraController {
  public targetEl: HTMLElement | undefined;
  public camera: PerspectiveCamera | OrthographicCamera;

  private resizeCallback: Function;

  constructor(resizeCallback: (width: number, height: number) => void) {
    this.resizeCallback = resizeCallback;

    this.camera = new PerspectiveCamera(45, NaN, 0.1, 1000);

    // Set the z-axis as the 'upwards' axis
    this.camera.up.set(0, 0, 1);
    this.camera.position.z = 5;

    window.addEventListener("resize", this.resize);
  }

  zoomTo(targetPosition: Vector3, targetDirection?: Vector3) {
    const startPosition = this.camera.position.clone();
    const position = startPosition.clone();

    const positionTween = new TWEEN.Tween(position)
      .to(targetPosition, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.camera.position.copy(position);
      });

    let directionTween = {
      start: () => {},
    };

    if (targetDirection) {
      const startDirection = new Vector3();
      this.camera.getWorldDirection(startDirection);

      const direction = startDirection.clone();

      directionTween = new TWEEN.Tween(direction)
        .to(targetDirection, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          // This might not work
          this.camera.lookAt(direction.x, direction.y, direction.z);
        });
    }

    positionTween.start();
    directionTween.start();
  }

  resize = () => {
    if (!this.targetEl) {
      return;
    }

    const { width, height } = this.targetEl.getBoundingClientRect();
    const newAspect = width / height;

    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = newAspect;
    }

    this.camera.updateProjectionMatrix();
    this.resizeCallback(width, height);
  };

  destroy() {
    window.removeEventListener("resize", this.resize);
  }
}

export default CameraController;
