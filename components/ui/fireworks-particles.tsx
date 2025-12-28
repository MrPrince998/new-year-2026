"use client";
import React, { useEffect, useRef } from "react";

const FireworksParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gravity = -0.1;
    const cannonballs: Cannonball[] = [];
    const explosions: Explosion[] = [];
    const colors = [
      {
        cannonballColor: "#affdf4",
        particleColors: ["#ff4747", "#00ceed", "#fff", "pink"],
      },
      {
        cannonballColor: "#fff",
        particleColors: ["#ffff00", "#ff00ff", "#00ffff", "#fff"],
      },
      {
        cannonballColor: "#ff6600",
        particleColors: ["#ff0000", "#ff6600", "#ffff00", "#fff"],
      },
      {
        cannonballColor: "#00ff99",
        particleColors: ["#00ff00", "#00ff99", "#00ffff", "#fff"],
      },
    ];

    class Particle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      radius: number;
      color: string;
      timeToLive: number;

      constructor(
        x: number,
        y: number,
        dx: number,
        dy: number,
        radius: number,
        color: string
      ) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = -dy;
        this.radius = 5;
        this.color = color;
        this.timeToLive = 1;
      }

      update() {
        if (!canvas) return;

        if (this.y + this.radius + this.dy > canvas.height) {
          this.dy = -this.dy;
        }

        if (
          this.x + this.radius + this.dx > canvas.width ||
          this.x - this.radius + this.dx < 0
        ) {
          this.dx = -this.dx;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();

        this.timeToLive -= 0.01;
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }

    class Cannonball {
      x: number;
      y: number;
      dx: number;
      dy!: number;
      radius: number;
      color: string;
      particleColors: string[];
      timeToLive: number;

      constructor(
        x: number,
        y: number,
        dx: number,
        dy: number,
        radius: number,
        color: string,
        particleColors: string[]
      ) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
        this.particleColors = particleColors;
        this.timeToLive = canvas ? canvas.height / (canvas.height + 800) : 0.5;
      }

      update() {
        if (!canvas) return;

        if (this.y + this.radius + this.dy > canvas.height) {
          this.dy = -this.dy;
        } else {
          this.dy += gravity;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();

        this.timeToLive -= 0.01;
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }

    class Explosion {
      particles: Particle[];
      source: Cannonball;

      constructor(cannonball: Cannonball) {
        this.particles = [];
        this.source = cannonball;
        this.init();
      }

      init() {
        for (let i = 0; i < 100; i++) {
          const dx = Math.random() * 6 - 3;
          const dy = Math.random() * 6 - 3;
          const randomColorIndex = Math.floor(
            Math.random() * this.source.particleColors.length
          );
          const randomParticleColor =
            this.source.particleColors[randomColorIndex];

          this.particles.push(
            new Particle(
              this.source.x,
              this.source.y,
              dx,
              dy,
              1,
              randomParticleColor
            )
          );
        }
      }

      update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          this.particles[i].update();

          if (this.particles[i].timeToLive < 0) {
            this.particles.splice(i, 1);
          }
        }
      }
    }

    let animationFrameId: number;
    let timer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      ctx.fillStyle = "rgba(18, 18, 18, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timer += 1;

      // Create random fireworks at random intervals
      if (timer % 15 === 0) {
        const randomX = Math.random() * canvas.width;
        const randomY = canvas.height;
        const targetY = Math.random() * canvas.height * 0.5 + 50;

        const angle = Math.atan2(targetY - randomY, canvas.width / 2 - randomX);
        const speed = 8 + Math.random() * 3;

        const dx = Math.cos(angle) * speed;
        const dy = -Math.sin(angle) * speed;

        const randomColor = Math.floor(Math.random() * colors.length);
        const color = colors[randomColor];

        cannonballs.push(
          new Cannonball(
            randomX,
            randomY,
            dx,
            dy,
            4,
            color.cannonballColor,
            color.particleColors
          )
        );
      }

      // Render cannonballs
      for (let i = cannonballs.length - 1; i >= 0; i--) {
        cannonballs[i].update();

        if (cannonballs[i].timeToLive <= 0) {
          explosions.push(new Explosion(cannonballs[i]));
          cannonballs.splice(i, 1);
        }
      }

      // Render explosions
      for (let j = explosions.length - 1; j >= 0; j--) {
        explosions[j].update();

        if (explosions[j].particles.length <= 0) {
          explosions.splice(j, 1);
        }
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
};

export default FireworksParticles;
