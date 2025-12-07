import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.65);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    // Modern vibrant colors
    const colors = ['#818cf8', '#a855f7', '#ec4899', '#06b6d4', '#10b981'];

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connect nearby particles with gradient lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, p1.color);
            gradient.addColorStop(1, p2.color);
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight * 0.65;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[65vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-500" />

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-mesh-animated opacity-60 dark:opacity-40" />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60"
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/30 dark:bg-cyan-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-white/20 dark:border-slate-700/50 shadow-lg mb-8 animate-slide-down">
          <div className="flex items-center gap-1.5">
            <Sparkles className="text-yellow-300 animate-pulse" size={18} />
            <Zap className="text-cyan-300" size={16} />
          </div>
          <span className="text-white/95 font-semibold text-sm tracking-wide">Your Ultimate Productivity Hub</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
          <span className="text-white drop-shadow-lg">Tool</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 drop-shadow-lg">Sphere</span>
        </h1>

        {/* Subtitle with gradient */}
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-100 mb-6 animate-fade-in stagger-1">
          Complete Toolkit for Everyone
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-white/85 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in stagger-2">
          Finance calculators, AI text tools, developer utilities, image editors & more —
          <span className="font-semibold text-yellow-200"> 100+ professional tools</span>,
          all free, all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
          {/* Primary Button */}
          <button
            onClick={onExplore}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-600 text-indigo-600 dark:text-white rounded-2xl font-bold text-lg shadow-2xl dark:shadow-indigo-500/25 hover:shadow-3xl dark:hover:shadow-indigo-500/40 transition-all duration-300 overflow-hidden hover:scale-105 hover:-translate-y-1"
          >
            <span className="relative z-10">Explore Tools</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" size={22} />

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-600 dark:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Secondary Button */}
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white font-medium text-base rounded-xl border border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            <span>View All Categories</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 animate-fade-in stagger-4">
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white">100+</div>
            <div className="text-sm text-slate-700 dark:text-white/70 font-medium">Free Tools</div>
          </div>
          <div className="w-px h-10 bg-slate-400 dark:bg-white/30" />
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white">20+</div>
            <div className="text-sm text-slate-700 dark:text-white/70 font-medium">Categories</div>
          </div>
          <div className="w-px h-10 bg-slate-400 dark:bg-white/30" />
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white">0</div>
            <div className="text-sm text-slate-700 dark:text-white/70 font-medium">Sign-up Required</div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            className="fill-white dark:fill-slate-950 transition-colors duration-300"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;