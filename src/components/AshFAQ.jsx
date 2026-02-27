import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "O Ash substitui o ChatGPT ou Claude?",
    a: "Para gestão da sua vida, sim e com vantagem. O Ash usa modelos de ponta (como GPT-4) como 'motor', mas adiciona a camada de Contexto Pessoal que falta neles. O ChatGPT ou Gemini não sabe seus prazos ou seu nível de cansaço hoje. O Ash sabe. Tudo."
  },
  {
    q: "O que é a 'Consciência de Contexto'?",
    a: "É a capacidade do Ash de ler o seu 'Sistema Neural' antes de responder. Ele consulta seus projetos, diários passados e estado de energia. Assim, ele não te dá conselhos genéricos, ele dá soluções baseadas na sua realidade atual."
  },
  {
    q: "Qual a diferença entre um Agente e um Chat?",
    a: "Um Chat apenas fala. Um Agente age. O Ash tem permissão (se você der) para criar tarefas, reagendar compromissos, criar documentos e até escrever código na Web IDE. Ele tem 'mãos digitais' para executar o trabalho."
  },
  {
    q: "Ele lê meus arquivos privados?",
    a: "Sim, localmente, para te ajudar. O Prana usa uma arquitetura onde seus dados pessoais nunca são usados para treinar os modelos públicos da OpenAI ou Anthropic. Seu contexto é isolado e seguro."
  },
  {
    q: "E se eu não quiser sugestões de energia (Biorregulação)?",
    a: "O sistema é modular. Você pode usar o Ash apenas como 'Engenheiro' (focado em código e estrutura) e desligar o módulo 'Guardião' (focado em saúde e energia)."
  }
];

export default function AshFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {FAQS.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <div
            key={idx}
            className={`glass-card rounded-xl p-6 cursor-pointer border transition-all duration-300 ${isOpen ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--glass-border)] hover:border-[var(--glass-border)]/80'}`}
            onClick={() => setOpen(isOpen ? null : idx)}
          >
            <div className="flex justify-between items-center">
              <h4 className={`text-sm font-medium transition-colors ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {item.q}
              </h4>
              <span className="text-[var(--accent)] text-xl font-light">
                {isOpen ? "−" : "+"}
              </span>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed pr-8"
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}