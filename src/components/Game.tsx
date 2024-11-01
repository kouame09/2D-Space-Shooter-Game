import React, { useEffect, useRef, useState } from 'react';
import { Rocket, Star, Target } from 'lucide-react';

const PLAYER_SIZE = 40;
const ENEMY_SIZE = 30;
const BULLET_SIZE = 5;
const PARTICLE_COUNT = 15;

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
  color?: string;
}

interface Particle extends GameObject {
  dx: number;
  dy: number;
  life: number;
}

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let player: GameObject = {
      x: canvas.width / 2 - PLAYER_SIZE / 2,
      y: canvas.height - PLAYER_SIZE - 20,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    };
    
    let bullets: GameObject[] = [];
    let enemies: GameObject[] = [];
    let particles: Particle[] = [];
    let frameCount = 0;
    
    const keys: { [key: string]: boolean } = {};
    
    function createParticles(x: number, y: number, color: string) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT;
        particles.push({
          x,
          y,
          width: 2,
          height: 2,
          dx: Math.cos(angle) * Math.random() * 5,
          dy: Math.sin(angle) * Math.random() * 5,
          life: 1,
          color
        });
      }
    }
    
    function spawnEnemy() {
      const enemy: GameObject = {
        x: Math.random() * (canvas.width - ENEMY_SIZE),
        y: -ENEMY_SIZE,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        speed: 2 + Math.random() * 2
      };
      enemies.push(enemy);
    }
    
    function checkCollision(rect1: GameObject, rect2: GameObject) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }
    
    function gameLoop() {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Player movement
      if (keys['ArrowLeft']) player.x = Math.max(0, player.x - 5);
      if (keys['ArrowRight']) player.x = Math.min(canvas.width - PLAYER_SIZE, player.x + 5);
      
      // Draw player
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Update and draw bullets
      bullets = bullets.filter(bullet => {
        bullet.y -= 7;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        return bullet.y > -bullet.height;
      });
      
      // Spawn enemies
      frameCount++;
      if (frameCount % 60 === 0) spawnEnemy();
      
      // Update and draw enemies
      enemies = enemies.filter(enemy => {
        enemy.y += enemy.speed || 2;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Check collision with bullets
        bullets.forEach((bullet, bulletIndex) => {
          if (checkCollision(bullet, enemy)) {
            bullets.splice(bulletIndex, 1);
            createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ef4444');
            setScore(prev => prev + 100);
            return false;
          }
        });
        
        // Check collision with player
        if (checkCollision(player, enemy)) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return false;
        }
        
        return enemy.y < canvas.height;
      });
      
      // Update and draw particles
      particles = particles.filter(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life -= 0.02;
        ctx.fillStyle = `rgba(239, 68, 68, ${particle.life})`;
        ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
        return particle.life > 0;
      });
      
      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }
    
    function handleKeyDown(e: KeyboardEvent) {
      keys[e.key] = true;
      if (e.key === ' ' && !gameOver) {
        bullets.push({
          x: player.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
          y: player.y,
          width: BULLET_SIZE,
          height: BULLET_SIZE * 2
        });
      }
      if (e.key === 'Enter' && gameOver) {
        setGameOver(false);
        setScore(0);
        player.x = canvas.width / 2 - PLAYER_SIZE / 2;
        enemies = [];
        bullets = [];
        particles = [];
        gameLoop();
      }
    }
    
    function handleKeyUp(e: KeyboardEvent) {
      keys[e.key] = false;
    }
    
    canvas.width = 800;
    canvas.height = 600;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoop();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, score]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-red-400" />
            <span className="text-xl">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            <span className="text-xl">High Score: {highScore}</span>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          className="border-4 border-slate-700 rounded-lg shadow-lg"
        />
        
        {gameOver && (
          <div className="mt-4 text-white">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Press ENTER to play again
            </p>
          </div>
        )}
        
        <div className="mt-4 text-slate-400 text-sm">
          Use ← → to move • SPACE to shoot
        </div>
      </div>
    </div>
  );
}

export default Game;