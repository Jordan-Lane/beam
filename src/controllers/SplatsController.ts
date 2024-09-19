import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { Camera, Euler, Renderer, Scene } from "three";
import { TransformControls } from "three-stdlib";

class SplatsController {
  addedSplatMesh: boolean;

  scene: Scene;
  splatsViewer: any;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.splatsViewer = new GaussianSplats3D.Viewer({
      selfDrivenMode: false,
      renderer: renderer,
      camera: camera,
      useBuiltInControls: false,
      ignoreDevicePixelRatio: false,
      gpuAcceleratedSort: true,
      enableSIMDInSort: true,
      sharedMemoryForWorkers: true,
      integerBasedSort: true,
      halfPrecisionCovariancesOnGPU: true,
      dynamicScene: false,
      webXRMode: GaussianSplats3D.WebXRMode.None,
      renderMode: GaussianSplats3D.RenderMode.OnChange,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
      antialiased: false,
      focalAdjustment: 1.0,
      logLevel: GaussianSplats3D.LogLevel.None,
      sphericalHarmonicsDegree: 0,
      enableOptionalEffects: false,
      plyInMemoryCompressionLevel: 2,
      freeIntermediateSplatData: true,
    });

    this.addedSplatMesh = false;
    this.scene = scene;
  }

  async addSplat(path: string, options: any, meshOptions: any) {
    const value = await this.splatsViewer.addSplatScene(path, options);

    if (!this.addedSplatMesh) {
      const splatMesh = this.splatsViewer.getSplatMesh();
      splatMesh.rotation.copy(meshOptions.rotation);

      this.scene.add(splatMesh);

      this.addedSplatMesh = true;
    }

    return value;
  }

  update() {
    this.splatsViewer.update();
  }
}

export default SplatsController;
