import { Intersection, Object3D, Raycaster, Vector2 } from "three";
import CameraController from "./CameraController";

class InputManager {
  public interactiveObjects: Object3D[];

  public intersects: Intersection<Object3D>[];
  public hovered: Record<string, Intersection<Object3D>>;

  private targetEl: HTMLElement | undefined;

  private raycaster: Raycaster;
  private pointer: Vector2;

  private cameraController: CameraController;

  constructor(targetEl: HTMLElement, cameraController: CameraController) {
    this.interactiveObjects = [];

    this.intersects = [];
    this.hovered = {};

    this.raycaster = new Raycaster();
    this.pointer = new Vector2(0, 0);

    this.cameraController = cameraController;

    this.targetEl = targetEl;
  }

  add = (object: Object3D) => {
    if (this.interactiveObjects.find((obj) => obj === object)) {
      return;
    }

    this.interactiveObjects.push(object);
  };

  remove = (objectToRemove: Object3D) => {
    this.interactiveObjects = this.interactiveObjects.filter(
      (obj) => obj !== objectToRemove
    );
  };

  onPointerMove = (event: MouseEvent) => {
    if (!this.targetEl) {
      return;
    }

    this.pointer.x = (event.clientX / this.targetEl.clientWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / this.targetEl.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.cameraController.camera);
    this.intersects = this.raycaster.intersectObjects(
      this.interactiveObjects,
      true
    );

    // Handle object that goes from hovered -> unhovered
    Object.keys(this.hovered).forEach((hoveredId) => {
      const hit = this.intersects.find((hit) => hit.object.uuid === hoveredId);
      if (!hit) {
        const unhoveredItem = this.hovered[hoveredId];
        if (unhoveredItem.object) {
          // TODO: Figure out custom event dispatch typings
          unhoveredItem.object.dispatchEvent<any>({
            type: "pointerleave",
            hit,
          });
        }
        delete this.hovered[hoveredId];
      }
    });

    // Handle all objects that are intersected
    this.intersects.forEach((hit) => {
      const uuid = hit.object.uuid;
      if (!this.hovered[uuid]) {
        this.hovered[uuid] = hit;
        hit.object.dispatchEvent<any>({ type: "pointerenter", hit });
      }

      hit.object.dispatchEvent<any>({ type: "pointermove", hit });
    });
  };

  onPointerDown = () => {
    this.intersects.forEach((hit) => {
      hit.object.dispatchEvent<any>({ type: "pointerdown", hit });
    });
  };

  onPointerUp = () => {
    this.intersects.forEach((hit) => {
      hit.object.dispatchEvent<any>({ type: "pointerup", hit });
    });
  };

  setupEventListeners() {
    if (!this.targetEl) {
      return;
    }

    this.targetEl.addEventListener("pointerdown", this.onPointerDown);
    this.targetEl.addEventListener("pointerup", this.onPointerUp);
    this.targetEl.addEventListener("pointermove", this.onPointerMove);
  }

  destroyEventListeners() {
    if (!this.targetEl) {
      return;
    }

    this.targetEl.removeEventListener("pointerdown", this.onPointerDown);
    this.targetEl.removeEventListener("pointerup", this.onPointerUp);
    this.targetEl.removeEventListener("pointermove", this.onPointerMove);
  }

  destroy() {
    this.destroyEventListeners();
  }
}

export default InputManager;
