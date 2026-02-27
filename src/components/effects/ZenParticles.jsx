/* src/components/effects/ZenParticles.jsx
   desc: Sistema de Partículas Global (Gamificação Wabi-Sabi).
   logic: Escuta 'prana:task-completed' e explode partículas.
*/
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Particle = ({ x, y, color }) => {
    const angle = Math.random() * 360;
    const velocity = 30 + Math.random() * 60;
    const size = 3 + Math.random() * 4;
    
    return (
        <motion.div
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ 
                x: Math.cos(angle) * velocity, 
                y: Math.sin(angle) * velocity - 60, // Gravidade invertida (sobe)
                opacity: 0, 
                scale: 0 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full shadow-sm pointer-events-none"
            style={{ 
                left: x, top: y, width: size, height: size,
                backgroundColor: color || '#34d399', // Emerald default
                boxShadow: `0 0 10px ${color || '#34d399'}`
            }}
        />
    );
};

export default function ZenParticles() {
    const [bursts, setBursts] = useState([]);
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Rastreia mouse passivamente para saber onde explodir se a API disparar
        const updateMouse = (e) => { lastMousePos.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener('mousemove', updateMouse);

        const handleComplete = (e) => {
            // Usa coordenada do evento OU a última posição do mouse OU centro da tela
            const x = e.detail?.x || lastMousePos.current.x || window.innerWidth / 2;
            const y = e.detail?.y || lastMousePos.current.y || window.innerHeight / 2;
            const color = e.detail?.color; // Opcional: cor baseada na prioridade

            const id = Date.now();
            setBursts(prev => [...prev, { id, x, y, color }]);
            
            // Limpeza automática
            setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 1200);
        };

        window.addEventListener('prana:task-completed', handleComplete);
        
        return () => {
            window.removeEventListener('mousemove', updateMouse);
            window.removeEventListener('prana:task-completed', handleComplete);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {bursts.map(burst => (
                    <div key={burst.id} style={{ position: 'absolute', left: burst.x, top: burst.y }}>
                        {/* Explosão de Partículas */}
                        {Array.from({ length: 16 }).map((_, i) => (
                            <Particle key={i} color={burst.color} />
                        ))}
                        {/* Onda de Choque */}
                        <motion.div 
                            initial={{ width: 0, height: 0, opacity: 0.6, border: `2px solid ${burst.color || '#34d399'}` }}
                            animate={{ width: 120, height: 120, opacity: 0, x: -60, y: -60 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute rounded-full"
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}