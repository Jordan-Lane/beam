import { Color } from "three";
import { CSS2DObject } from "three-stdlib";

class ObjectAnnotation extends CSS2DObject {
  titleDiv: HTMLDivElement;
  triangle: HTMLDivElement;

  constructor(title: string, color?: Color) {
    const annotationColor = color ?? new Color(0x00ff00);

    const element = document.createElement("div");
    element.style.fontSize = "1rem";
    element.style.fontWeight = "700";
    element.style.opacity = "0.8";
    element.style.cursor = "default";

    const titleDiv = document.createElement("div");
    titleDiv.style.backgroundColor = `#${annotationColor.getHexString()}`;
    titleDiv.style.padding = "6px";
    titleDiv.style.borderRadius = "5px";
    titleDiv.style.display = "flex";
    titleDiv.style.justifyContent = "center";
    titleDiv.style.alignItems = "center";

    const titleSpan = document.createElement("span");
    titleSpan.style.whiteSpace = "none";
    titleSpan.style.paddingLeft = "0.5rem";
    titleSpan.style.paddingRight = "0.5rem";
    titleSpan.style.textAlign = "center";
    titleSpan.style.fontFamily = "sans-serif";
    titleSpan.textContent = title;

    titleDiv.appendChild(titleSpan);
    element.appendChild(titleDiv);

    const triangle = document.createElement("div");
    triangle.style.width = "0";
    triangle.style.height = "0";
    triangle.style.borderLeft = "10px solid transparent";
    triangle.style.borderRight = "10px solid transparent";
    triangle.style.borderTop = `15px solid #${annotationColor.getHexString()}`;
    triangle.style.position = "absolute";
    triangle.style.top = "95%";
    triangle.style.left = "50%";
    triangle.style.transform = "translate(-50%)";
    element.appendChild(triangle);

    super(element);

    this.titleDiv = titleDiv;
    this.triangle = triangle;
  }

  setColor(color: Color) {
    this.titleDiv.style.backgroundColor = `#${color.getHexString()}`;
    this.triangle.style.borderTop = `15px solid #${color.getHexString()}`;
  }
}

export default ObjectAnnotation;
