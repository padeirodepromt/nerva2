import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Para quem é o Plano Semente?",
    a: "Para quem está começando a organizar a própria vida mental. É leve, gratuito e intencionalmente simples."
  },
  {
    q: "Quando faz sentido migrar para o Nascente?",
    a: "Quando sua vida ou trabalho começa a exigir estrutura: projetos ativos, rotina, acompanhamento."
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim. Você pode evoluir ou reduzir seu plano a qualquer momento sem perder dados."
  },
  {
    q: "O Ash muda entre os planos?",
    a: "Sim. Planos mais avançados desbloqueiam modelos com mais contexto, memória e raciocínio."
  },
  {
    q: "Qual é a diferença real entre os planos?",
    a: "Não são funções destravadas. É o quanto do sistema você entrega para o Ash cuidar. Em níveis iniciais ele observa. Em níveis mais altos, ele organiza e age."
  },
  {
    q: "Isso não é só um ChatGPT integrado?",
    a: "Não. O Ash não conversa a partir do zero. Ele vive dentro do Prana, com acesso direto aos seus projetos, documentos, histórico e estados de energia."
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim. O Prana respeita ciclos. Você pode aumentar ou reduzir o nível de presença do Ash conforme sua fase."
  },
  {
    q: "E se eu quiser fazer tudo sozinho?",
    a: "Você pode. O plano Semente existe exatamente para isso. Mas o Prana deixa claro o custo invisível de sustentar tudo sem ajuda."
  }
];

export default function PlansFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-4">
      {FAQS.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <div
            key={idx}
            className="glass-card rounded-xl p-6 cursor-pointer"
            onClick={() => setOpen(isOpen ? null : idx)}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                {item.q}
              </h4>
              <span className="text-[var(--accent)] text-xl">
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
                  className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed"
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
