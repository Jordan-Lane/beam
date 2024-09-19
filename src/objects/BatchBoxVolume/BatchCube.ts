import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from "three";
import { Batchable } from "../../types";

export const BATCH_CUBE_GEOMETRY = new BoxGeometry(1, 1, 1);
export const BATCH_CUBE_MATERIAL = new MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.3,
  depthTest: true,
  depthWrite: false,
});

class BatchCube extends Mesh implements Batchable {
  batchInstanceId: number | undefined;
  color: Color;

  constructor(color?: Color) {
    super(BATCH_CUBE_GEOMETRY, BATCH_CUBE_MATERIAL);

    this.color = color ?? new Color(0x00ff00);
  }
}

export default BatchCube;
