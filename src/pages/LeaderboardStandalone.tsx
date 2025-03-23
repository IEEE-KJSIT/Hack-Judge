import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import * as THREE from 'three';
import { LeaderboardService, TeamScore } from '../services/leaderboardService';
import '../styles/leaderboard.css';

export function LeaderboardStandalone() {
  const [teams, setTeams] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('algoforge_leaderboard_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData) as TeamScore[];
        setTeams(parsedData);
      }
    } catch (err) {
      console.error('Failed to load leaderboard data from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Three.js background
  useEffect(() => {
    if (!backgroundRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.9);
    backgroundRef.current.appendChild(renderer.domElement);

    // Create particles (digital rain effect)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000; // More particles for fullscreen
    const particlesPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      particlesPositions[i3] = (Math.random() - 0.5) * 100;
      particlesPositions[i3 + 1] = (Math.random() - 0.5) * 100;
      particlesPositions[i3 + 2] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    
    // Create particles material with blue digital rain look
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x007bff, // Changed to blue
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create digital grid
    const gridSize = 150; // Larger grid for fullscreen
    const gridDivisions = 75;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00bfff, 0x000066); // Changed to blue tones
    gridHelper.position.y = -20;
    gridHelper.rotation.x = Math.PI / 10;
    scene.add(gridHelper);

    // Create digital circuit lines
    const circuitLinesCount = 40; // More circuit lines for fullscreen
    const circuitLines: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>[] = [];
    
    for (let i = 0; i < circuitLinesCount; i++) {
      const points = [];
      const segmentCount = Math.floor(Math.random() * 5) + 3;
      let x = (Math.random() - 0.5) * 120;
      let y = (Math.random() - 0.5) * 120;
      let z = (Math.random() - 0.5) * 120;
      
      for (let j = 0; j < segmentCount; j++) {
        points.push(new THREE.Vector3(x, y, z));
        
        // Create 90-degree turns for circuit-like appearance
        const direction = Math.floor(Math.random() * 3);
        const distance = Math.random() * 10 + 5;
        
        if (direction === 0) x += distance;
        else if (direction === 1) y += distance;
        else z += distance;
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // Random circuit color (blues)
      const colorChoice = Math.random();
      const color = colorChoice > 0.7 ? 0x0066ff : colorChoice > 0.3 ? 0x00bfff : 0x007bff;
      
      const material = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
      });
      
      const line = new THREE.Line(geometry, material);
      circuitLines.push(line);
      scene.add(line);
    }

    // Camera position
    camera.position.z = 60;

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      // Move particles downward slowly (digital rain effect)
      particlesMesh.rotation.y += 0.0003;
      particlesMesh.rotation.x += 0.0001;
      
      // Rotate the grid slowly
      gridHelper.rotation.z += 0.001;

      // Animate circuit lines - pulse opacity
      circuitLines.forEach((line, index) => {
        line.material.opacity = 0.2 + Math.sin(time + index) * 0.2;
      });

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (backgroundRef.current && backgroundRef.current.contains(renderer.domElement)) {
        backgroundRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Determine trophy color based on rank
  const getTrophyColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-400';
  };

  // Special styling for top 3 rows
  const getRowClass = (rank: number) => {
    const baseClass = "relative overflow-hidden rounded-lg mb-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,123,255,0.7)]";
    
    if (rank === 1) return `${baseClass} border-2 border-yellow-400 bg-black/80 shadow-[0_0_10px_rgba(255,255,0,0.5)]`;
    if (rank === 2) return `${baseClass} border-2 border-gray-300 bg-black/80 shadow-[0_0_8px_rgba(200,200,200,0.5)]`;
    if (rank === 3) return `${baseClass} border-2 border-amber-600 bg-black/80 shadow-[0_0_8px_rgba(205,127,50,0.5)]`;
    
    return `${baseClass} border border-[#007bff]/30 bg-black/80`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Three.js background */}
      <div 
        ref={backgroundRef} 
        className="fixed top-0 left-0 w-full h-full z-0" 
      />

      {/* Overlay gradient to improve text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-black/80" />
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        {/* Title */}
        <div className="text-center mb-12 mt-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#00bfff] mb-2 tracking-tighter">
            AlgoForge
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ 
            textShadow: '0 0 10px #007bff, 0 0 20px #007bff, 0 0 40px #007bff',
            animation: 'glitch 2s linear infinite'
          }}>
            LEADERBOARD
          </h2>
          <p className="text-[#00bfff] text-xl">
            <span className="inline-block animate-pulse">{'</'}</span> Hackathon Champions <span className="inline-block animate-pulse">{'>'}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="cyberpunk-loading">
              <div className="spinner"></div>
              <p className="text-[#00bfff] mt-4">Loading leaderboard data...</p>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && teams.length > 0 && (
          <motion.div 
            className="max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 mb-6 px-6 py-4 rounded-t-lg bg-gradient-to-r from-[#000d1a] to-[#001a33] text-white font-medium border-b border-[#007bff]/50">
              <div className="col-span-2 flex items-center justify-center">
                <p className="font-bold text-[#00bfff] text-lg">RANK</p>
              </div>
              <div className="col-span-7 flex items-center">
                <p className="font-bold text-[#00bfff] text-lg">TEAM</p>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <p className="font-bold text-[#00bfff] text-lg">SCORE</p>
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {teams.map((team) => (
                <motion.div 
                  key={team.id}
                  className={getRowClass(team.rank || 0)}
                  variants={itemVariants}
                >
                  {/* Glow effect overlay for top 3 */}
                  {team.rank && team.rank <= 3 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shine" 
                         style={{ animation: 'shine 3s infinite' }} />
                  )}
                  
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    {/* Rank */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        {team.rank && team.rank <= 3 ? (
                          <Trophy className={`w-7 h-7 ${getTrophyColor(team.rank)}`} />
                        ) : (
                          <span className="text-2xl font-mono text-gray-300">{team.rank}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Team Name */}
                    <div className="col-span-7 flex items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-[#00bfff] mr-2" />
                          <span className={`font-medium ${team.rank && team.rank <= 3 ? 'text-white text-xl' : 'text-gray-200 text-lg'}`}>
                            {team.teamName}
                          </span>
                        </div>
                        {team.projectName && (
                          <span className="text-sm text-gray-400 ml-7 mt-1">
                            Project: {team.projectName}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div className="col-span-3 flex items-center justify-end">
                      <div className={`px-4 py-2 rounded-full font-mono font-bold text-lg ${
                        team.rank === 1 ? 'bg-yellow-400/20 text-yellow-300' :
                        team.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                        team.rank === 3 ? 'bg-amber-600/20 text-amber-300' :
                        'bg-[#007bff]/10 text-[#00bfff]'
                      }`}>
                        {team.score}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No data message */}
        {!loading && teams.length === 0 && (
          <div className="max-w-4xl mx-auto p-6 bg-black/50 border border-[#007bff]/30 rounded-lg text-center">
            <p className="text-[#00bfff]">No leaderboard data available. Please go back to the main application.</p>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #007bff, -0.05em -0.025em 0 #00bfff, -0.025em 0.05em 0 #0066ff;
          }
          14% {
            text-shadow: 0.05em 0 0 #007bff, -0.05em -0.025em 0 #00bfff, -0.025em 0.05em 0 #0066ff;
          }
          15% {
            text-shadow: -0.05em -0.025em 0 #007bff, 0.025em 0.025em 0 #00bfff, -0.05em -0.05em 0 #0066ff;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #007bff, 0.025em 0.025em 0 #00bfff, -0.05em -0.05em 0 #0066ff;
          }
          50% {
            text-shadow: 0.025em 0.05em 0 #007bff, 0.05em 0 0 #00bfff, 0 -0.05em 0 #0066ff;
          }
          99% {
            text-shadow: 0.025em 0.05em 0 #007bff, 0.05em 0 0 #00bfff, 0 -0.05em 0 #0066ff;
          }
          100% {
            text-shadow: -0.025em 0 0 #007bff, -0.025em -0.025em 0 #00bfff, -0.025em -0.05em 0 #0066ff;
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }
        
        .cyberpunk-loading .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto;
          border: 4px solid rgba(0, 123, 255, 0.3);
          border-radius: 50%;
          border-top-color: #007bff;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        html, body {
          background-color: #000;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
} 