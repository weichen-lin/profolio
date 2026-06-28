import { CAR } from "../constants";

// The car is just an external SVG, centered on the origin. Swap the file at
// public/car.svg (see CAR in constants.ts) for any car you like — no code edit
// needed beyond adjusting CAR.w / CAR.h for scale.
export default function Car() {
  return (
    <image
      href={CAR.src}
      width={CAR.w}
      height={CAR.h}
      x={-CAR.w / 2}
      y={-CAR.h / 2}
      preserveAspectRatio="xMidYMid meet"
      style={{ pointerEvents: "none" }}
    />
  );
}
