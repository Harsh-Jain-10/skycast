import React, { useEffect, useRef } from "react";

interface WeatherBackgroundProps {
  weatherCode: number;
  isDay: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherCode, isDay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WMO categorization
  let isRain = false;
  let isSnow = false;
  let isCloudy = false;
  let isThunder = false;
  let isFoggy = false;
  let isClear = false;

  if (weatherCode === 0 || weatherCode === 1) {
    isClear = true;
  } else if ([2, 3].includes(weatherCode)) {
    isCloudy = true;
  } else if ([45, 48].includes(weatherCode)) {
    isFoggy = true;
  } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    isRain = true;
  } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    isSnow = true;
  } else if ([95, 96, 99].includes(weatherCode)) {
    isThunder = true;
    isRain = true;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Classes
    class RainDrop {
      x = Math.random() * width;
      y = Math.random() * -height;
      vy = 15 + Math.random() * 10;
      vx = -2 - Math.random() * 2; // Wind angle
      len = 15 + Math.random() * 15;
      opacity = 0.2 + Math.random() * 0.3;

      update() {
        this.y += this.vy;
        this.x += this.vx;
        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = `rgba(174, 219, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vx, this.y + this.len);
        ctx.stroke();
      }
    }

    class SnowFlake {
      x = Math.random() * width;
      y = Math.random() * -height;
      r = 1 + Math.random() * 3;
      d = Math.random() * 100; // Density
      vy = 1 + Math.random() * 2;
      vx = Math.sin(Math.random()) * 0.5;

      update(tick: number) {
        this.y += this.vy;
        this.x += Math.sin(tick * 0.01 + this.d) * 0.5;
        if (this.y > height) {
          this.y = -10;
          this.x = Math.random() * width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }

    class FogBubble {
      x = Math.random() * width;
      y = height - Math.random() * 200;
      r = 100 + Math.random() * 150;
      vx = 0.1 + Math.random() * 0.15;
      opacity = 0.03 + Math.random() * 0.05;

      update() {
        this.x += this.vx;
        if (this.x - this.r > width) {
          this.x = -this.r;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const grad = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.r);
        grad.addColorStop(0, `rgba(200, 200, 210, ${this.opacity})`);
        grad.addColorStop(1, "rgba(200, 200, 210, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Star {
      x = Math.random() * width;
      y = Math.random() * (height * 0.6); // Stars only in top 60%
      r = 0.5 + Math.random() * 1.2;
      twinkleSpeed = 0.02 + Math.random() * 0.03;
      phase = Math.random() * Math.PI * 2;

      update() {
        this.phase += this.twinkleSpeed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = 0.15 + (Math.sin(this.phase) + 1) * 0.35;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize arrays
    const rainDrops: RainDrop[] = [];
    const snowFlakes: SnowFlake[] = [];
    const fogBubbles: FogBubble[] = [];
    const stars: Star[] = [];

    if (isRain) {
      for (let i = 0; i < 70; i++) rainDrops.push(new RainDrop());
    }
    if (isSnow) {
      for (let i = 0; i < 60; i++) snowFlakes.push(new SnowFlake());
    }
    if (isFoggy) {
      for (let i = 0; i < 15; i++) fogBubbles.push(new FogBubble());
    }
    if (!isDay && (isClear || isCloudy)) {
      for (let i = 0; i < 80; i++) stars.push(new Star());
    }

    let tick = 0;
    let lightningFlash = 0;

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      // 1. Draw lightning storm flash overlay
      if (isThunder && Math.random() > 0.985) {
        lightningFlash = 15; // Set flash duration in ticks
      }

      if (lightningFlash > 0) {
        lightningFlash--;
        if (lightningFlash % 2 === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.12 * (lightningFlash / 15)})`;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // 2. Draw Stars
      if (!isDay) {
        stars.forEach((star) => {
          star.update();
          star.draw(ctx);
        });
      }

      // 3. Draw Fog
      if (isFoggy) {
        fogBubbles.forEach((fog) => {
          fog.update();
          fog.draw(ctx);
        });
      }

      // 4. Draw Rain
      if (isRain) {
        rainDrops.forEach((drop) => {
          drop.update();
          drop.draw(ctx);
        });
      }

      // 5. Draw Snow
      if (isSnow) {
        snowFlakes.forEach((flake) => {
          flake.update(tick);
          flake.draw(ctx);
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherCode, isDay, isRain, isSnow, isFoggy, isThunder, isClear]);

  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
      {/* Sky Base Color layer matching index.css themes */}
      <div className="absolute inset-0 transition-opacity duration-1000 bg-transparent" />

      {/* Cinematic Clouds drifting layer */}
      {(isCloudy || isRain || isSnow || isThunder) && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="cloud-drift-1" />
          <div className="cloud-drift-2" />
        </div>
      )}

      {/* Sun glow effect for clear day */}
      {isDay && isClear && (
        <div className="sun-ray-container">
          <div className="sun-ray" />
        </div>
      )}

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
    </div>
  );
};
