import { Object3D, Scene, Vector3, WebGLRenderer } from "three";
import {
  OrbitControls,
  TransformControls,
  CSS3DRenderer,
  CSS3DObject,
  CSS2DRenderer,
} from "three-stdlib";
import PointCloudsController from "./controllers/PointCloudsController";
import CameraController from "./controllers/CameraController";
import InputManager from "./controllers/InputManager";
import InsertionController from "./controllers/InsertionController";
import { InsertableObject3D } from "./types";
import BatchBoxVolumeController from "./controllers/BoxVolumeController";
import BatchBoxVolume from "./objects/BatchBoxVolume/BatchBoxVolume";
import AnnotationController from "./controllers/AnnotationController";
import SplatsController from "./controllers/SplatsController";
import BoxVolume from "./objects/BoxVolume";
import { PointCloudOctree } from "@pnext/three-loader";

class Viewer {
  // [TODO] Should possibly make this private
  public scene: Scene;

  private target: HTMLElement | undefined;

  private renderer: WebGLRenderer;
  private cssRenderer: CSS3DRenderer;

  private cameraController: CameraController;
  private insertionController: InsertionController;
  private pointCloudsController: PointCloudsController;
  private splatsController: SplatsController;
  private annotationController: AnnotationController;
  private boxVolumeController: BatchBoxVolumeController;

  private inputManager: InputManager;

  private controls: OrbitControls;
  private objectTransformControls: TransformControls;

  private frameHandle: number | undefined;

  constructor(target?: HTMLElement) {
    this.renderer = new WebGLRenderer({
      antialias: false,
      precision: "highp",
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.cssRenderer = new CSS2DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = "absolute";
    this.cssRenderer.domElement.style.top = "0";
    this.cssRenderer.domElement.style.pointerEvents = "none";

    this.scene = new Scene();

    const resizeCallback = (width: number, height: number) => {
      this.renderer.setSize(width, height);
      this.cssRenderer.setSize(width, height);
    };

    this.cameraController = new CameraController(resizeCallback);
    this.insertionController = new InsertionController();
    this.pointCloudsController = new PointCloudsController();

    this.splatsController = new SplatsController(
      this.scene,
      this.cameraController.camera,
      this.renderer
    );

    this.inputManager = new InputManager(
      this.renderer.domElement,
      this.cameraController
    );
    this.inputManager.setupEventListeners();

    this.controls = new OrbitControls(this.cameraController.camera);
    this.controls.setPolarAngle(Math.PI / 2);
    this.controls.update();

    this.objectTransformControls = new TransformControls(
      this.cameraController.camera,
      this.renderer.domElement
    );

    this.annotationController = new AnnotationController(this.scene);
    this.boxVolumeController = new BatchBoxVolumeController(
      this.scene,
      this.annotationController
    );

    if (target) {
      this.initialize(target);
    }

    this.renderer.setAnimationLoop(this.loop);
  }

  initialize(target: HTMLElement) {
    this.target = target;
    target.appendChild(this.renderer.domElement);
    target.appendChild(this.cssRenderer.domElement);

    this.cameraController.targetEl = target;
    this.cameraController.resize();
    this.controls.connect(this.target);
  }

  async addPointCloud(filename: string, url: string) {
    const pointCloudOctree = await this.pointCloudsController.load(
      filename,
      url
    );

    this.scene.add(pointCloudOctree);

    return pointCloudOctree;
  }

  removePointCloud(pointCloudOctree: PointCloudOctree) {
    this.scene.remove(pointCloudOctree);
    this.pointCloudsController.dispose(pointCloudOctree);
  }

  async addSplat(path: string, options: any, meshOptions: any) {
    return await this.splatsController.addSplat(path, options, meshOptions);
  }

  removeSplat(splat: any) {
    // [TODO]
  }

  add(object: Object3D | CSS3DObject, interactive?: boolean) {
    if (object instanceof BatchBoxVolume) {
      console.log(
        "Error: BoxVolumes should be added using the `addBatchBoxVolume` method"
      );
      return;
    }

    this.scene.add(object);
    if (interactive) {
      this.inputManager.add(object);
    }

    // [TODO] Could make this more generic - ie Annotated interface
    if (object instanceof BoxVolume) {
      this.annotationController.add(object.annotation);
    }
  }

  remove(object: Object3D) {
    this.scene.remove(object);
    this.inputManager.remove(object);

    // [TODO] Properly dispose of object
  }

  addBatchBoxVolume(object: BatchBoxVolume) {
    this.boxVolumeController.add(object);
  }

  removeBatchBoxVolume(object: BatchBoxVolume) {
    // [TODO]
    // Figure out how to remove batch cube instance
  }

  insertObject(
    object: InsertableObject3D,
    options?: {
      startingPoint?: Vector3;
    }
  ) {
    const { startingPoint } = options || {};

    if (startingPoint) {
      object.position.copy(startingPoint);
    }

    let objectInScene = false;
    this.scene.traverse((traversedObject) => {
      if (traversedObject === object) {
        objectInScene = true;
      }
    });

    if (!objectInScene) {
      this.scene.add(object);
    }

    this.insertionController.attach(object);
    return object;
  }

  stopObjectInsertion(keepObject?: boolean) {
    if (!keepObject && this.insertionController.object) {
      this.scene.remove(this.insertionController.object);
    }

    this.insertionController.detach();
  }

  transformObject(object: Object3D) {
    this.objectTransformControls.attach(object);
    this.scene.add(this.objectTransformControls);
  }

  stopObjectTransform() {
    this.objectTransformControls.detach();
    this.scene.remove(this.objectTransformControls);
  }

  update() {
    this.controls.update();

    this.splatsController.update();

    this.pointCloudsController.update(
      this.cameraController.camera,
      this.renderer
    );

    this.annotationController.update(this.cameraController.camera);
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.cameraController.camera);
    this.cssRenderer.render(this.scene, this.cameraController.camera);
  }

  loop = () => {
    this.update();
    this.render();
  };

  destroy() {
    this.target?.removeChild(this.renderer.domElement);
    this.target = undefined;

    this.cameraController.destroy();

    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
    }
  }
}

export default Viewer;
