import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
} from "three";

const VERTICES = new Float32Array([
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
  0.5, -0.5,
]);

class CubeFrame extends LineSegments {
  constructor(color: Color) {
    const offset = new Color().setHSL(0, 0, 0.3);
    const darkenedColor = color.clone().sub(offset);

    const lineColor = darkenedColor.getHex();

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(VERTICES, 3));

    const material = new LineBasicMaterial({
      color: lineColor,
    });

    super(geometry, material);
  }
}

export default CubeFrame;
