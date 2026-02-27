/* src/components/chat/SideChat.jsx
   desc: Terminal Prana V12 (Evolution Swarm).
   feat:
   - Host genérico de protocolos (SideChat não conhece Flor/BrandCode)
   - Consent-to-Apply (modal único)
   - Integração perfeita de AgentId no SendMessage
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { useTranslations } from '../LanguageProvider';
import { cn } from '../../lib/utils';
import {
  IconChat,
  IconSend,
  IconLoader2,
  IconTrash,
  IconFlame,
  IconPaperclip,
  IconPlus,
  IconEye,
  IconDatabase,
  IconLayout,
  IconMaximize,
  IconMinimize,
  IconZap
} from '../icons/PranaLandscapeIcons';

import { toast } from 'sonner';

// Stores
import { useAgentStore } from '../../stores/useAgentStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useOllyStore } from '../../stores/useOllyStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { apiClient } from '../../api/apiClient';

// Hooks & Utils
import { useChatModes } from '../../hooks/useChatModes';
import { processFile, validateFile } from '../../utils/fileProcessing';
import { usePranaChat } from '../../hooks/usePranaChat';
import { forwardToAgent } from '../../agents/agentCollaboration';
import { useAgentEvents } from '../../hooks/useAgentEvents';

// Components
import FilePreviews from './FilePreviews';
import ChatHistorySearch from './ChatHistorySearch';
import FileContextDisplay from './FileContextDisplay';
import CardModal from '../cards/CardModal';
import AgentSelector from './AgentSelector';
import CollaborationView from '../agents/CollaborationView';
import NeuralThoughtProcess from './NeuralThoughtProcess'; // Corrigido o duplo import

// Dialog (shadcn)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

// ✅ Protocol Runtime (Host genérico)
import { useProtocolRuntime } from '@/modules/protocols/useProtocolRuntime';

export default function SideChat({ hideHeader = false, isMobile = false }) {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // --- [V10] ESTADOS DE EXPANSÃO ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [holisticContext, setHolisticContext] = useState(null);
  const [holisticLoading, setHolisticLoading] = useState(false);
  const [fileContext, setFileContext] = useState(null);
  const [cardModal, setCardModal] = useState({ isOpen: false, card: null });
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslations();

  // 1. Hook de Modos
  const { currentMode, modes, setCurrentMode, attachedFiles, addFile, removeFile, clearFiles } = useChatModes('chat');

  // 2. Hook Principal
  const {
    messages,
    sendMessage,
    isLoading,
    activeContext,
    clearMessages,
    nexusId
  } = usePranaChat();

  // Thoughts stream
  const { stream, status: neuralStatus, clearStream } = useAgentEvents();

  // Stores Auxiliares
  const { openSmartModal } = useWorkspaceStore();
  const { activeAgent, setActiveAgent, getActiveAgent } = useAgentStore();
  const activeAgentInfo = getActiveAgent();
  const { isOllyEnabled } = useOllyStore();
  const { isRunning, activeTaskTitle } = useTimeStore();

  // ============================================================================
  // PROTOCOL HOST (Modular) — SideChat não conhece Flor/BrandCode
  // ============================================================================
  const protocol = useProtocolRuntime();
  const protocolActive = protocol.protocolActive;

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  // Listener: qualquer View pode pedir “abre SideChat com protocolo X”
  useEffect(() => {
    const onOpenProtocol = async (ev) => {
      const detail = ev?.detail || {};
      const adapterKey = detail.adapterKey;
      const context = { ...(detail.context || {}), nexusId };

      if (!adapterKey) return;

      // Safety: se a view atual está em um projectId e o evento é de outro projeto, ignora
      if (projectId && context.projectId && context.projectId !== projectId) return;

      try {
        await protocol.start(
          { adapterKey, context, title: detail.title || 'Protocol' },
          {}
        );
        toast.success('Protocolo iniciado.');
      } catch (e) {
        // fluxo de shop (BrandCode)
        if (e?.code === 'SHOP_REQUIRED' || `${e?.message || ''}`.includes('SHOP_REQUIRED')) {
          window.dispatchEvent(new CustomEvent('prana:open-shop', { detail: { focus: 'brandcode_pack' } }));
        } else {
          toast.error(e?.message || 'Falha ao iniciar protocolo');
        }
      }
    };

    window.addEventListener('prana:open-sidechat-protocol', onOpenProtocol);
    return () => window.removeEventListener('prana:open-sidechat-protocol', onOpenProtocol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Sempre que o adapter pedir consent, abrimos modal
  useEffect(() => {
    if (protocol?.uiHints?.kind === 'brandcode_consent') {
      setApplyModalOpen(true);
    }
  }, [protocol?.uiHints]);

  const consentSummary =
    protocol?.uiHints?.kind === 'brandcode_consent' ? protocol.uiHints.summary : null;

  const consentConfidence =
    protocol?.uiHints?.kind === 'brandcode_consent' ? protocol.uiHints.confidenceScore : null;

  const applyDraftToProject = async () => {
    try {
      setApplyLoading(true);
      await protocol.action('brandcode_apply');
      setApplyModalOpen(false);
      toast.success('Brand Code aplicado no projeto.');
    } catch (e) {
      toast.error(e?.message || 'Falha ao aplicar.');
    } finally {
      setApplyLoading(false);
    }
  };

  const keepDraftOnly = async () => {
    try {
      await protocol.action('brandcode_keep_draft');
      setApplyModalOpen(false);
    } catch (e) {
      toast.error(e?.message || 'Falha ao manter draft.');
    }
  };

  // transcript local do protocolo entra antes do chat normal
  const mergedMessages = useMemo(() => {
    return [...(protocol.localMessages || []), ...(messages || [])];
  }, [protocol.localMessages, messages]);

  // --- FETCH CONTEXTO HOLÍSTICO ---
  useEffect(() => {
    const fetchHolisticContext = async () => {
      setHolisticLoading(true);
      try {
        const res = await Promise.race([
          apiClient.get('/ai/holistic-analysis'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
        if (res.data?.success) {
          setHolisticContext({
            energy: res.data.energy,
            astrology: res.data.astrology,
            diaries: res.data.diaries,
            menstrualCycle: res.data.menstrualCycle
          });
        }
      } catch (error) {
        console.warn('[SideChat] Erro contexto holístico:', error.message);
      } finally {
        setHolisticLoading(false);
      }
    };

    fetchHolisticContext();
    const interval = setInterval(fetchHolisticContext, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [mergedMessages, isLoading, protocol.busy]);

  // --- HANDLER DE COLABORAÇÃO ---
  const handleForwardAction = async (suggestion) => {
    try {
      toast.loading(`Encaminhando...`);
      const res = await forwardToAgent(suggestion.targetAgentKey, suggestion.context, nexusId);
      if (res.success) {
        toast.dismiss();
        toast.success('Handoff concluído.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Erro no encaminhamento.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    const msg = input.trim();
    setInput('');

    // Se existe protocolo ativo, SideChat só encaminha pro host (sem anexos)
    if (protocolActive && msg && attachedFiles.length === 0) {
      await protocol.sendUser(msg);
      return;
    }

    try {
      const filesToSend = attachedFiles.map(f => ({
        name: f.name,
        type: f.type,
        content: f.content,
        preview: f.preview
      }));

      // 👉 [V12] Garantir que o AgentId correto vai no payload para o backend carregar as tools dele
      const extraContext = {
        projectId,
        viewMode: activeTab,
        agentId: activeAgent, 
        uiContext: {
          tab: activeTab,
          agent: activeAgent
        }
      };

      await sendMessage(msg, filesToSend, extraContext);

      clearFiles();
      setFileContext(null);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      toast.loading('Processando arquivo...');
      const processed = await processFile(file);
      addFile(processed);
      setFileContext(processed);
      toast.dismiss();
      toast.success(`${file.name} anexado`);
    } catch (error) {
      toast.error('Erro ao processar arquivo');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const disableInput =
    isLoading ||
    applyModalOpen ||
    applyLoading ||
    protocol.busy ||
    (protocolActive && protocol?.uiHints?.kind === 'brandcode_consent');

  return (
    <div className={cn(
      "flex h-full transition-all duration-500 ease-in-out bg-background/40 backdrop-blur-xl",
      isExpanded && !isMobile ? "w-[900px]" : "w-full",
      !isMobile && "border-l border-border/20"
    )}>

      {/* EXPANSÃO */}
      {isExpanded && !isMobile && (
        <div className="flex-1 border-r border-white/5 overflow-hidden animate-in slide-in-from-right-5">
          <CollaborationView taskId={activeContext?.activeEntityId} userId={nexusId} />
        </div>
      )}

      {/* TERMINAL */}
      <div className={cn("flex flex-col h-full", isExpanded ? "w-[380px]" : "w-full")}>

        {/* HEADER */}
        {!hideHeader && (
          <div className="h-14 border-b border-border/20 flex items-center px-4 justify-between gap-3 bg-muted/5 shrink-0">
            <div className="flex items-center gap-2">
              <AgentSelector
                activeAgent={activeAgent}
                onAgentChange={setActiveAgent}
                ollyAvailable={isOllyEnabled}
              />

              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 transition-colors", isExpanded && "text-indigo-400 bg-indigo-500/10")}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <IconMinimize className="w-4 h-4" /> : <IconMaximize className="w-4 h-4" />}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ChatHistorySearch onSelectConversation={() => { }} />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-50 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                onClick={() => { clearMessages(); protocol.stop(); }}
              >
                <IconTrash className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STATUS */}
        <div className={cn(
          "px-4 py-2 space-y-2 border-b border-border/10 max-h-48 overflow-y-auto bg-muted/5",
          isMobile && "mt-16"
        )}>
          {projectId && (
            <div className={cn(
              "p-2 border rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1",
              activeTab === 'database'
                ? "bg-blue-500/5 border-blue-500/20 text-blue-700"
                : "bg-purple-500/5 border-purple-500/20 text-purple-700"
            )}>
              {activeTab === 'database' ? <IconDatabase className="w-3.5 h-3.5" /> : <IconLayout className="w-3.5 h-3.5" />}
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Modo: {activeTab === 'database' ? 'Dados & Registros' : 'Gestão & Tarefas'}
              </span>
            </div>
          )}

          {activeContext && activeContext.currentView !== 'dashboard' && (
            <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <IconEye className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold">
                Vendo: {activeContext.label}
              </span>
              {activeContext.activeEntityId && (
                <span className="ml-auto text-[9px] font-mono opacity-40">#{activeContext.activeEntityId.substring(0, 4)}</span>
              )}
            </div>
          )}

          {protocolActive && (
            <div className="p-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
              <div className="p-1.5 rounded-full bg-indigo-500/10">
                <IconZap className="w-3 h-3 text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-indigo-200 font-bold">
                  {protocol.active?.title || 'Protocolo'} • {protocol.active?.adapterKey}
                </p>
                <p className="text-[10px] text-indigo-200/60 mt-0.5">
                  {protocol.busy ? 'Processando...' : 'Ativo'}
                </p>
              </div>
            </div>
          )}

          {holisticContext?.energy && (
            <div className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
              <div className="p-1.5 rounded-full bg-amber-500/10">
                <IconFlame className="w-3 h-3 text-amber-500 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-amber-600 font-bold">
                  Nível Vital: {holisticContext.energy.physical.toFixed(1)}
                </p>
              </div>
            </div>
          )}

          {fileContext && (
            <FileContextDisplay
              context={fileContext}
              onClear={() => { setFileContext(null); clearFiles(); }}
            />
          )}
        </div>

        {/* MENSAGENS */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {mergedMessages.length === 0 && !fileContext && (
              <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
                <IconChat className="w-12 h-12 opacity-50" />
                <div className="text-[10px] font-mono uppercase tracking-[0.3em]">
                  <p>Neural Connected</p>
                  <p className="animate-pulse">
                    {activeTab === 'database' ? "Data Engine Ready..." : "Planning Core Ready..."}
                  </p>
                </div>
              </div>
            )}

            {mergedMessages.map((msg, i) => (
              <div key={msg.id || i} className="space-y-4">
                <div className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-[24px] text-xs leading-relaxed shadow-sm transition-all",
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-white/5 border border-white/5 text-foreground rounded-bl-sm backdrop-blur-md'
                  )}>
                    {msg.content}
                    {msg.toolResponse && (
                      <div className="mt-2 p-2 bg-black/20 rounded text-[10px] font-mono border-l-2 border-amber-500 opacity-80">
                        Action Executed
                      </div>
                    )}
                  </div>
                </div>

                {msg.collaborationSuggestion && (
                  <div className="mt-2 mx-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[20px] animate-in zoom-in-95">
                    <div className="flex items-center gap-2 mb-2">
                      <IconZap className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                        Expertise Match
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-100/70 mb-3 leading-snug">
                      {msg.collaborationSuggestion.reason}
                    </p>
                    <Button
                      size="sm"
                      className="w-full h-9 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold rounded-xl"
                      onClick={() => handleForwardAction(msg.collaborationSuggestion)}
                    >
                      Chamar {msg.collaborationSuggestion.agentName}
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <NeuralThoughtProcess
              stream={stream}
              status={neuralStatus}
              onRetract={clearStream}
            />

            {(isLoading || protocol.busy) && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-[20px] rounded-bl-sm flex items-center gap-2 backdrop-blur-md">
                  <IconLoader2 className="w-3 h-3 animate-spin text-primary" />
                  <span className="text-[10px] uppercase tracking-widest opacity-50">
                    {protocol.busy ? 'Protocol runtime...' : (activeAgent === 'ash' ? 'Processando...' : 'Neural thinking...')}
                  </span>
                </div>
              </div>
            )}

            <div ref={scrollRef} className="h-1" />
          </div>
        </ScrollArea>

        {/* INPUT */}
        <div className={cn(
          "p-4 pb-8 space-y-3 bg-background/60 backdrop-blur-2xl border-t border-white/5",
          isMobile && "px-6 pb-12"
        )}>
          {attachedFiles.length > 0 && (
            <FilePreviews files={attachedFiles} onRemove={removeFile} />
          )}

          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" hidden onChange={handleFileSelect} />

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 rounded-full hover:bg-white/5"
                onClick={() => fileInputRef.current?.click()}
                disabled={protocolActive} // durante protocolo, evita anexos no meio
              >
                <IconPaperclip className="w-4 h-4 opacity-50" />
              </Button>

              {isMobile && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-11 w-11 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary transition-all active:scale-90"
                  onClick={() => openSmartModal('general')}
                >
                  <IconPlus className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={
                  protocolActive
                    ? "Responda e o protocolo segue..."
                    : activeTab === 'database'
                      ? "Adicione um registro à lista..."
                      : "Qual a próxima tarefa?"
                }
                className="bg-white/5 border-white/10 rounded-2xl h-11 px-4 text-sm focus-visible:ring-primary/30"
                disabled={disableInput}
              />
            </div>

            <Button
              size="icon"
              className="h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-glow shrink-0 active:scale-90 transition-transform"
              onClick={handleSend}
              disabled={disableInput || (!input.trim() && attachedFiles.length === 0)}
            >
              <IconSend className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardModal
        isOpen={cardModal.isOpen}
        card={cardModal.card}
        onClose={() => setCardModal({ isOpen: false, card: null })}
      />

      {/* CONSENT MODAL (single authorization) */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Aplicar Brand Code no projeto</DialogTitle>
            <DialogDescription>
              O protocolo gerou um draft. Se você autorizar, eu aplico no DNA do projeto agora.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] uppercase tracking-widest opacity-60 font-black">Resumo</div>
              <div className="mt-2 text-[13px] text-muted-foreground/85 leading-relaxed whitespace-pre-wrap">
                {consentSummary || "Draft pronto. Sem resumo curto ainda."}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-widest opacity-60 font-black">Confidence</div>
                <div className="mt-2 text-3xl font-serif italic text-foreground/90">
                  {Number.isInteger(consentConfidence) ? `${consentConfidence}%` : "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                <div className="text-[10px] uppercase tracking-widest opacity-60 font-black">Aplicação</div>
                <div className="mt-2 text-[12px] text-muted-foreground/80 leading-relaxed">
                  Ao aplicar, o Brand Code passa a ser contexto consultável do projeto para conteúdo, copy e estratégia.
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full" onClick={keepDraftOnly} disabled={applyLoading}>
              Manter como draft
            </Button>
            <Button className="rounded-full" onClick={applyDraftToProject} disabled={applyLoading}>
              {applyLoading ? "Aplicando..." : "Aplicar agora"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}