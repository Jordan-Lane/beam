import { Potree, PointCloudOctree } from "@pnext/three-loader";
import { Camera, WebGLRenderer } from "three";

class PointCloudsController {
  private potree: Potree;
  // private pointCloudPicker: PointCloudOctreePicker;

  private pointClouds: PointCloudOctree[];

  constructor() {
    this.potree = new Potree();
    this.pointClouds = [];
  }

  async load(filename: string, baseUrl: string) {
    const pointCloudOctree = await this.potree.loadPointCloud(
      filename,
      (url: string) => `${baseUrl}${url}`
    );

    this.pointClouds.push(pointCloudOctree);
    return pointCloudOctree;
  }

  async dispose(pointCloud: PointCloudOctree) {
    this.pointClouds.filter((pco) => pco !== pointCloud);
    pointCloud.dispose();
  }

  update(camera: Camera, renderer: WebGLRenderer) {
    if (!this.pointClouds) {
      return;
    }

    this.potree.updatePointClouds(
      this.pointClouds as PointCloudOctree[],
      camera,
      renderer
    );
  }
}

export default PointCloudsController;
