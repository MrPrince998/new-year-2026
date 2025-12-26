"use client";
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  exploded: boolean;
  color: string;
  type: number; // explosion type
}

const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff6600",
      "#ff0099",
      "#00ff99",
      "#9900ff",
    ];

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const targetY = Math.random() * canvas.height * 0.5 + 50;
      fireworks.push({
        x,
        y: canvas.height,
        targetY,
        vx: (Math.random() - 0.5) * 2,
        vy: -8 - Math.random() * 3,
        exploded: false,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.floor(Math.random() * 5), // 5 different explosion types
      });
    };

    const createParticles = (
      x: number,
      y: number,
      color: string,
      type: number
    ) => {
      let particleCount = 50 + Math.random() * 50;

      switch (type) {
        case 0: // Circle burst
          for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 6;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color,
              size: 2 + Math.random() * 3,
            });
          }
          break;

        case 1: // Ring burst (hollow center)
          for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 4 + Math.random() * 3;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color,
              size: 2 + Math.random() * 3,
            });
          }
          break;

        case 2: // Willow (drooping)
          for (let i = 0; i < particleCount * 1.5; i++) {
            const angle = (Math.PI * 2 * i) / (particleCount * 1.5);
            const speed = 3 + Math.random() * 4;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed * 0.5,
              vy: Math.sin(angle) * speed * 0.3 - Math.random() * 2,
              life: 1.2,
              color,
              size: 1.5 + Math.random() * 2,
            });
          }
          break;

        case 3: // Palm tree (upward burst)
          for (let i = 0; i < particleCount; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
            const speed = 5 + Math.random() * 5;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color,
              size: 2 + Math.random() * 3,
            });
          }
          break;

        case 4: // Chrysanthemum (multi-layer)
          // Inner layer
          for (let i = 0; i < particleCount / 2; i++) {
            const angle = (Math.PI * 2 * i) / (particleCount / 2);
            const speed = 2 + Math.random() * 3;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color,
              size: 3 + Math.random() * 2,
            });
          }
          // Outer layer
          for (let i = 0; i < particleCount / 2; i++) {
            const angle = (Math.PI * 2 * i) / (particleCount / 2) + 0.1;
            const speed = 5 + Math.random() * 4;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 0.8,
              color: colors[Math.floor(Math.random() * colors.length)],
              size: 2 + Math.random() * 2,
            });
          }
          break;
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.1; // gravity

          // Draw firework trail
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          // Check if reached target
          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            createParticles(fw.x, fw.y, fw.color, fw.type);
            fireworks.splice(i, 1);
          }
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.vx *= 0.99; // air resistance
        p.vy *= 0.99;
        p.life -= 0.01;

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    // Create fireworks at random intervals
    const interval = setInterval(() => {
      createFirework();
    }, 500 + Math.random() * 100);

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
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
