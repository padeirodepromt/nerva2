// src/components/tutorial/AshTourGuide.jsx
import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import { usePranaChat } from '@/hooks/usePranaChat'; // Para o Ash falar durante o tour

export default function AshTourGuide() {
  const [run, setRun] = useState(false);
  const navigate = useNavigate();
  const { sendMessage } = usePranaChat();

  // Os Passos Físicos do Tour (Classes CSS que você adiciona aos seus componentes)
  const steps = [
    {
      target: '.prana-command-palette-trigger', // A classe CSS do botão da lupa/command
      content: 'Bem-vindo! Este é o Cérebro Rápido. Prima CMD+K aqui a qualquer momento para viajar pelo sistema à velocidade da luz.',
      disableBeacon: true,
    },
    {
      target: '.prana-agent-selector', // O selector de agentes no SideChat
      content: 'Aqui você invoca a Trindade. Agora está a falar comigo (Ash), mas pode trocar para a Flor (Marketing) ou para o Neo (Código) com um clique.',
    },
    {
      target: '.prana-view-switcher', // Os botões de Kanban/Lista/Sheet
      content: 'Eu criei tarefas no Laboratório. Use estes ícones para mudar a forma como vê a sua realidade: Kanban, Lista ou Matriz de Dados.',
    },
    {
      target: '.prana-planner-nav', // O botão do menu para o Planner
      content: 'Vamos organizar o tempo. Clique aqui para irmos ao Planner, onde a sua energia dita a sua rotina.',
    }
  ];

  // Escuta o comando do Chat (Vindo do SideChat ou usePranaChat)
  useEffect(() => {
    const handleStartTour = (e) => {
      const { projectId } = e.detail;
      // 1. Navega para o projeto demo
      navigate(`/projects/${projectId}`);
      // 2. Inicia o Tour
      setTimeout(() => setRun(true), 500); 
    };

    window.addEventListener('prana:start-tour', handleStartTour);
    return () => window.removeEventListener('prana:start-tour', handleStartTour);
  }, [navigate]);

  // A Inteligência: Fazer o Ash comentar as transições
  const handleJoyrideCallback = async (data) => {
    const { status, step, action } = data;

    if (action === 'next' && step.target === '.prana-planner-nav') {
       // Envia um prompt oculto para o Ash aconselhar sobre o planner
       await sendMessage(
         "[SYSTEM_HIDDEN]: O utilizador acabou de chegar ao Planner no Tour. Explica em 2 frases curtas como podes ler a energia dele para sugerir tarefas da aba 'Laboratório'.",
         [],
         { isHidden: true } // Uma flag para não renderizar a bolha do utilizador
       );
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: '#1e1e2d',
          backgroundColor: '#1e1e2d',
          primaryColor: '#6366f1', // Indigo Prana
          textColor: '#e2e8f0',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
    />
  );
}