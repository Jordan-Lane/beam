import {
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Color,
  BufferGeometry,
  Object3D,
  BufferAttribute,
  LineSegments,
  LineBasicMaterial,
} from "three";
import InsertionController from "../src/controllers/InsertionController";
import { Insertable } from "../src/types";
import ObjectAnnotation from "../src/objects/ObjectAnnotation";

const defaultColor = new Color(0x00ff00);
const activeColor = new Color("hotpink");

const frameVertices = new Float32Array([
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
  0.5, -0.5,
]);

class Cube extends Object3D implements Insertable {
  public inserting: boolean;

  private box: Mesh;
  private frame: LineSegments;
  private annotation: ObjectAnnotation;

  private onPointerDownCallback: Function;

  constructor() {
    super();

    this.inserting = false;
    this.onPointerDownCallback = () => {};

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
      color: defaultColor,
      transparent: true,
      opacity: 0.3,
      depthTest: true,
      depthWrite: false,
    });

    this.box = new Mesh(geometry, material);

    const boxFrameGeomtry = new BufferGeometry();
    boxFrameGeomtry.setAttribute(
      "position",
      new BufferAttribute(frameVertices, 3)
    );
    this.frame = new LineSegments(
      boxFrameGeomtry,
      new LineBasicMaterial({ color: 0x000000 })
    );

    this.annotation = new ObjectAnnotation("New object", defaultColor);

    this.add(this.box);
    this.add(this.frame);
    this.add(this.annotation);

    this.annotation.position.set(0, 0, 0.6);

    this.addEventListeners();
  }

  onAttach = () => {
    (this.box.material as MeshBasicMaterial).color = activeColor;
    this.annotation.setColor(activeColor);
    console.log("attached");
  };

  onDetach = () => {
    (this.box.material as MeshBasicMaterial).color = defaultColor;
    this.annotation.setColor(defaultColor);
    console.log("detached");
  };

  onInsertionUpdate = (insertionController: InsertionController) => {
    console.log("insertionUpdate");
    this.position.copy(insertionController.insertionPoint);
  };

  addEventListeners() {
    this.box.addEventListener<any>("pointerenter", this.onPointerEnter);
    this.box.addEventListener<any>("pointerdown", this.onPointerDown);
    this.box.addEventListener<any>("pointerleave", this.onPointerLeave);
  }

  removeEventListeners() {
    this.box.removeEventListener<any>("pointerenter", this.onPointerEnter);
    this.box.removeEventListener<any>("pointerdown", this.onPointerDown);
    this.box.removeEventListener<any>("pointerleave", this.onPointerLeave);
  }

  onPointerEnter() {
    console.log("Pointer Enter!!");
  }

  setPointerDownCallback = (callback: Function) => {
    this.onPointerDownCallback = callback;
  };

  onPointerDown = () => {
    console.log("onPointerDown");
    this.onPointerDownCallback(this.inserting);
  };

  onPointerLeave() {
    console.log("Pointer Leave!!");
  }
}

export default Cube;
