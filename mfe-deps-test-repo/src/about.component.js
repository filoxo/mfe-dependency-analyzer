import React, { useEffect, useState } from "react";
import { fromEvent } from "rxjs";
import { sampleTime } from "rxjs/operators";

const mouseMove$ = fromEvent(document, "mousemove").pipe(sampleTime(1000));

export default function About() {
  const [mousePos, setMousePos] = useState("");
  useEffect(() => {
    const sub = mouseMove$.subscribe(({ screenX, screenY }) => {
      setMousePos(`X: ${screenX}, Y: ${screenY}`);
    });
    return () => {
      sub.unsubscribe();
    };
  });

  return (
    <>
      <h2>About</h2>
      <p>Mouse position is {mousePos}</p>
    </>
  );
}
