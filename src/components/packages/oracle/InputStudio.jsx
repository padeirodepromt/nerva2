/* src/components/packages/oracle/InputStudio.jsx */
import React, { useState } from 'react';
import { DiagramView } from './DiagramView'; // Renderizador Mermaid

export const InputStudio = ({ onExecute }) => {
  const [input, setInput] = useState('');
  const [blueprint, setBlueprint] = useState(null);

  const handleTranslate = async () => {
    // 1. Envia para o Backend do Tradutor
    const data = await api.post('/agents/packages/oracle/translate', { input });
    setBlueprint(data);
  };

  return (
    <div className="p-4 bg-slate-900 text-white rounded-lg border border-slate-700">
      <textarea 
        className="w-full bg-transparent border-none focus:ring-0 text-lg"
        placeholder="Lance a sua ideia bruta aqui..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      
      <button onClick={handleTranslate} className="mt-2 text-cyan-400 font-bold hover:glow">
        GERAR ESTRUTURA V10
      </button>

      {blueprint && (
        <div className="mt-4 grid grid-cols-2 gap-4 animate-fade-in">
          <div className="p-2 bg-black/50 rounded">
            <h4 className="text-xs uppercase text-slate-500 mb-2">Hierarquia de Execução</h4>
            <ul className="list-disc pl-4 text-sm">
              {blueprint.hierarchy.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="p-2 bg-black/50 rounded">
            <h4 className="text-xs uppercase text-slate-500 mb-2">Diagrama de Fluxo</h4>
            <DiagramView code={blueprint.diagram} />
          </div>
          <div className="col-span-2 mt-2">
            <button onClick={() => onExecute(blueprint)} className="w-full py-2 bg-cyan-600 rounded">
              EXECUTAR COM SOBERANIA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};