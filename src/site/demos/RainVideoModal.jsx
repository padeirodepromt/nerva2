import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "../../components/icons/PranaLandscapeIcons";

export function RainVideoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              className="relative w-full max-w-4xl bg-[#0c0a09] rounded-lg overflow-hidden border border-[#292524] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#1a1816]/80 hover:bg-[#1a1816] rounded-lg border border-[#292524] transition-all group"
              >
                <IconX className="w-5 h-5 text-[#a8a29e] group-hover:text-white transition-colors" />
              </button>

              {/* Video Container */}
              <div className="relative w-full bg-black">
                {/* Aspect Ratio Container (16:9) */}
                <div className="relative w-full pt-[56.25%]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover bg-black"
                  >
                    <source
                      src="https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4"
                      type="video/mp4"
                    />
                    Seu navegador não suporta a tag de vídeo.
                  </video>

                  {/* Overlay de Conteúdo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
                    {/* Content Footer */}
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-3 opacity-70">
                        <div className="w-6 h-px bg-[var(--accent)]"></div>
                        <span className="text-xs uppercase tracking-widest font-light">
                          Ambiente Calmo
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl serif-font font-light mb-2 text-[#e6e1db]">
                        Chuva como metáfora
                      </h3>
                      <p className="text-sm md:text-base text-white/70 font-light max-w-lg">
                        Cada gota que cai é um momento. Nenhuma nuvem dura para sempre. Prana te ajuda a abraçar o fluxo natural da produtividade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="bg-[#1a1816] border-t border-[#292524] px-6 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
                  <span className="text-xs text-[#a8a29e] uppercase tracking-widest font-light">
                    Vídeo HD • Mixkit • Sem Direitos Autorais
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs text-[#a8a29e] hover:text-white transition-colors font-light uppercase tracking-widest"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
