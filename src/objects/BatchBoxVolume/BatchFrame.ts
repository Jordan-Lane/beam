import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
} from "three";
import { Batchable } from "../../types";

// prettier-ignore
const VERTICES = new Float32Array([
  0.5, 0.5, 0.5, // 1
  0.5, -0.5, 0.5, // 2
  -0.5, -0.5, 0.5, // 3
  -0.5, 0.5, 0.5, // 4
  0.5, 0.5, 0.5,  // 1
  0.5, 0.5, -0.5,  // 5
  0.5, -0.5, -0.5, // 6
  -0.5, -0.5, -0.5, // 7
  -0.5, 0.5, -0.5, // 8
  0.5, 0.5, -0.5,  // 5
  0.5, -0.5, -0.5, // 6
  0.5, -0.5, 0.5, // 2
  -0.5, -0.5, 0.5, // 3
  -0.5, -0.5, -0.5, // 7
  -0.5, 0.5, -0.5, // 8
  -0.5, 0.5, 0.5, // 4
]);

export const BATCH_LINE_MATERIAL = new LineBasicMaterial({ color: 0xffffff });
export const BATCH_LINE_GEOMETRY = new BufferGeometry();
BATCH_LINE_GEOMETRY.setAttribute("position", new BufferAttribute(VERTICES, 3));
//BATCH_LINE_GEOMETRY.setIndex(INDICES);

class BatchFrame extends LineSegments implements Batchable {
  batchInstanceId: number | undefined;
  color: Color;

  constructor(color?: Color) {
    super(BATCH_LINE_GEOMETRY, BATCH_LINE_MATERIAL);

    this.color = new Color(0x000000);
    if (color) {
      const offset = new Color().setHSL(0, 0, 0.3);
      const darkenedColor = color.clone().sub(offset);

      this.color = new Color(darkenedColor.getHex());
    }
  }
}

export default BatchFrame;
