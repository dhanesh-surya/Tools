import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

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

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.6); // 60vh
    
    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ['#4f46e5', '#10b981', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      });

      // Connect particles
      particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 100) {
                  ctx.beginPath();
                  ctx.strokeStyle = p1.color;
                  ctx.globalAlpha = 0.1;
                  ctx.lineWidth = 0.5;
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
              }
          })
      })

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 0.6;
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 transition-colors">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-30" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-6">
            <Sparkles className="text-yellow-300" size={20} />
            <span className="text-white font-semibold">Your Ultimate Productivity Hub</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-tight">
          ToolSphere <br/>
          <span className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Complete Toolkit for Everyone
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Finance calculators, AI text tools, developer utilities, image editors & more — 30+ professional tools, all free, all in one place.
        </p>

        <button 
          onClick={onExplore}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Explore Tools</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default Hero;