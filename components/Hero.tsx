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
    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-6 animate-bounce-slow">
            <Sparkles className="text-yellow-500" size={16} />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">New Tools Added</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-tight">
          PM TOOLS <br/>
          <span className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Your All-in-One Smart Suite
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Streamline your workflow with our professional collection of Finance, Text, PDF, and Image utilities. Powered by AI, designed for efficiency.
        </p>

        <button 
          onClick={onExplore}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Explore Tools</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default Hero;