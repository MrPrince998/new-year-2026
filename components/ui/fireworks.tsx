"use client";
import React, { useEffect, useRef } from "react";

const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let chars: number[][][];
    let particles: number;
    let w: number;
    let h: number;
    let current: number;
    const duration: number = 5000;
    const str: string[] = ["HAPPY", "NEW", "YEAR", "2026"];
    let animationFrameId: number;

    const makeChar = (c: string): number[][] => {
      const tmp = document.createElement("canvas");
      const size = (tmp.width = tmp.height = w < 400 ? 200 : 300);
      const tmpCtx = tmp.getContext("2d");
      if (!tmpCtx) return [];
      tmpCtx.font = "bold " + size + "px Arial";
      tmpCtx.fillStyle = "white";
      tmpCtx.textBaseline = "middle";
      tmpCtx.textAlign = "center";
      tmpCtx.fillText(c, size / 2, size / 2);
      const char2 = tmpCtx.getImageData(0, 0, size, size);
      const char2particles: number[][] = [];
      for (let i = 0; char2particles.length < particles; i++) {
        const x = size * Math.random();
        const y = size * Math.random();
        const offset = Math.floor(y) * size * 4 + Math.floor(x) * 4;
        if (char2.data[offset])
          char2particles.push([x - size / 2, y - size / 2]);
      }
      return char2particles;
    };

    const resize = (): void => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles = window.innerWidth < 400 ? 55 : 99;
    };

    const makeChars = (t: number): void => {
      const actual = Math.floor(t / duration) % str.length;
      if (current === actual) return;
      current = actual;
      chars = [...str[actual]].map(makeChar);
    };

    const circle = (x: number, y: number, r: number): void => {
      ctx.beginPath();
      ctx.ellipse(x, y, r, r, 0, 0, 6.283);
      ctx.fill();
    };

    const rocket = (x: number, y: number, _id: number, t: number): void => {
      ctx.fillStyle = "white";
      const r = 2 - 2 * t + Math.pow(t, 15 * t) * 16;
      const yPos = h - y * t;
      circle(x, yPos, r);
    };

    const explosion = (
      pts: number[][],
      x: number,
      y: number,
      id: number,
      t: number
    ): void => {
      const dy = t * t * t * 20;
      let r = Math.sin(id) * 1 + 3;
      r = t < 0.5 ? (t + 0.5) * t * r : r - t * r;
      ctx.fillStyle = `hsl(${id * 55}, 55%, 55%)`;
      pts.forEach((xy: number[], i: number) => {
        if (i % 20 === 0)
          ctx.fillStyle = `hsl(${id * 55}, 55%, ${
            55 + t * Math.sin(t * 55 + i) * 45
          }%)`;
        circle(t * xy[0] + x, h - y + t * xy[1] + dy, r);
      });
    };

    const firework = (t: number, i: number, pts: number[][]): void => {
      t -= i * 200;
      const id = i + chars.length * Math.floor(t - (t % duration));
      t = (t % duration) / duration;
      let dx = ((i + 1) * w) / (1 + chars.length);
      dx += Math.min(0.33, t) * 100 * Math.sin(id);
      let dy = h * 0.5;
      dy += Math.sin(id * 4547.411) * h * 0.1;
      if (t < 0.33) {
        rocket(dx, dy, id, t * 3);
      } else {
        explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t - 0.33) * 2));
      }
    };

    const render = (t: number): void => {
      makeChars(t);
      animationFrameId = requestAnimationFrame(render);
      ctx.fillStyle = "#00000010";
      ctx.fillRect(0, 0, w, h);
      if (chars) {
        chars.forEach((pts: number[][], i: number) => firework(t, i, pts));
      }
    };

    // Initialize
    resize();
    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default Fireworks;
