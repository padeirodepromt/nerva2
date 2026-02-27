/* src/components/importer/TrelloImportModal.jsx
   desc: Modal para importar dados do Trello via API
*/

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconUpload, IconArrowRight, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { toast } from "sonner";
import { apiClient } from '@/api/apiClient';
import { AshImportPreviewModal } from './AshImportPreviewModal';

export default function TrelloImportModal({ isOpen, onClose, onImportComplete }) {
    const [step, setStep] = useState(1); // 1: Credenciais, 1.5: Validação, 2: Preview, 3: Ash, 4: Processando
    const [trelloToken, setTrelloToken] = useState('');
    const [trelloBoardId, setTrelloBoardId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validationStatus, setValidationStatus] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [importStats, setImportStats] = useState({ total: 0, current: 0, errors: 0 });
    const [ashProcessing, setAshProcessing] = useState(false);
    const [ashPreviewData, setAshPreviewData] = useState(null);
    const [showAshPreview, setShowAshPreview] = useState(false);

    const handleValidateConnection = async () => {
        if (!trelloToken.trim()) {
            return toast.error("Insira o token do Trello");
        }
        if (!trelloBoardId.trim()) {
            return toast.error("Insira o ID do board");
        }

        setIsValidating(true);
        try {
            const response = await apiClient.post('/import/validate/trello', {
                token: trelloToken.trim(),
                boardId: trelloBoardId.trim()
            });

            if (response.data?.success) {
                setValidationStatus({ success: true });
                toast.success("✅ Conexão validada com sucesso!");
                setStep(1.5);
            } else {
                setValidationStatus({ success: false, error: response.data?.error });
                toast.error(response.data?.error || "Falha na validação");
            }
        } catch (error) {
            setValidationStatus({ success: false, error: error.response?.data?.error || error.message });
            toast.error(error.response?.data?.error || "Erro ao validar conexão");
        } finally {
            setIsValidating(false);
        }
    };

    const handlePreview = async () => {
        setIsValidating(true);
        try {
            const response = await apiClient.post('/import/preview/trello', {
                token: trelloToken.trim(),
                boardId: trelloBoardId.trim()
            });

            if (response.data?.data) {
                setPreviewData(response.data.data);
                toast.success("📋 Prévia carregada");
                setStep(1.5);
            }
        } catch (error) {
            toast.error("Erro ao carregar preview");
        } finally {
            setIsValidating(false);
        }
    };

    const handleImport = async () => {
        setStep(2); // Preview + opção Ash
    };

    const handleAshProcess = async () => {
        if (!previewData?.data || previewData.data.length === 0) {
            toast.error("Nenhum dado para otimizar");
            return;
        }

        setAshProcessing(true);
        try {
            const tasksToProcess = previewData.data.slice(0, 100);
            const response = await apiClient.post('/import/ash-process', {
                tasks: tasksToProcess
            });

            if (response.data?.success) {
                setAshPreviewData(response.data.processedTasks);
                setShowAshPreview(true);
                toast.success("✨ Ash otimizou suas tarefas!");
            } else {
                toast.error("Erro ao processar com Ash");
            }
        } catch (error) {
            console.error("Falha ao processar Ash:", error);
            toast.error("Erro ao chamar Ash");
        } finally {
            setAshProcessing(false);
        }
    };

    const handleConfirmAshOptimizations = async (processedTasks) => {
        setStep(4);
        setIsProcessing(true);

        try {
            const response = await apiClient.post('/import/apply-optimizations', {
                processedTasks: processedTasks
            });

            if (response.data?.success) {
                setImportStats({
                    total: response.data.totalProcessed || 0,
                    current: response.data.totalProcessed || 0,
                    errors: response.data.errors?.length || 0
                });
                toast.success("✅ Tarefas importadas com Ash!");
                if (onImportComplete) onImportComplete();
                setTimeout(handleClose, 1500);
                setShowAshPreview(false);
            }
        } catch (error) {
            console.error("Falha ao aplicar otimizações:", error);
            toast.error("Erro ao criar tarefas");
            setIsProcessing(false);
            setStep(2);
        }
    };

    const handleImportWithoutAsh = async () => {
        setStep(4);
        setIsProcessing(true);

        try {
            const response = await apiClient.post('/import/trello', {
                trelloToken: trelloToken.trim(),
                trelloBoardId: trelloBoardId.trim()
            });

            if (response.data?.success) {
                setImportStats({
                    total: response.data?.data?.tasksCreated || 0,
                    current: response.data?.data?.tasksCreated || 0,
                    errors: response.data?.data?.errors?.length || 0
                });
                toast.success(response.data?.message || "Importação concluída!");
                if (onImportComplete) onImportComplete();
                setTimeout(handleClose, 1500);
            }
        } catch (error) {
            console.error("Falha ao importar Trello:", error);
            toast.error(error.response?.data?.error || "Erro ao conectar ao Trello");
            setIsProcessing(false);
            setStep(2);
        }
    };

    const handleClose = () => {
        setStep(1);
        setTrelloToken('');
        setTrelloBoardId('');
        setValidationStatus(null);
        setPreviewData(null);
        setImportStats({ total: 0, current: 0, errors: 0 });
        setAshProcessing(false);
        setAshPreviewData(null);
        setShowAshPreview(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-secondary/30 border-white/10 text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconUpload className="w-5 h-5 text-cyan-400" />
                        Importar do Trello
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* STEP 1: CREDENCIAIS */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="trello-token" className="text-sm font-medium">
                                    Token do Trello
                                </Label>
                                <Input
                                    id="trello-token"
                                    type="password"
                                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                    value={trelloToken}
                                    onChange={(e) => setTrelloToken(e.target.value)}
                                    className="mt-2 bg-black/20 border-white/10"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Crie em: <a href="https://trello.com/app-key" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">trello.com/app-key</a>
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="trello-board-id" className="text-sm font-medium">
                                    ID do Board
                                </Label>
                                <Input
                                    id="trello-board-id"
                                    placeholder="5f1234567890abcdef123456"
                                    value={trelloBoardId}
                                    onChange={(e) => setTrelloBoardId(e.target.value)}
                                    className="mt-2 bg-black/20 border-white/10"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Copie do URL: trello.com/b/<b>xxxxx</b>/boardname
                                </p>
                            </div>

                            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 text-xs text-cyan-300">
                                <p className="font-medium mb-1">📌 Passos:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Acesse trello.com/app-key</li>
                                    <li>Copie o token exibido</li>
                                    <li>Acesse seu board no Trello</li>
                                    <li>Copie o ID do URL</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* STEP 1.5: VALIDAÇÃO & PRÉVIA */}
                    {step === 1.5 && (
                        <div className="space-y-4">
                            {validationStatus?.success ? (
                                <div className="space-y-4">
                                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm text-green-300">
                                        ✅ Conexão validada com sucesso!
                                    </div>

                                    {previewData?.preview && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-white">📋 Prévia dos Dados</h3>
                                            <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 max-h-[250px] overflow-y-auto">
                                                <div className="sticky top-0 bg-white/5 border-b border-white/10 p-3 grid grid-cols-2 gap-2 text-xs font-bold opacity-50">
                                                    <span>Título</span>
                                                    <span>Status</span>
                                                </div>
                                                <div className="space-y-1 p-3">
                                                    {previewData.preview.slice(0, 5).map((item, idx) => (
                                                        <div key={idx} className="grid grid-cols-2 gap-2 text-xs p-2 rounded border border-white/5">
                                                            <span className="truncate">{item.title || '—'}</span>
                                                            <span className="text-cyan-400">{item.status || 'todo'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">Total: {previewData.total} cards</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm text-red-300">
                                    ❌ {validationStatus?.error || 'Erro na validação'}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: PRÉVIA & OPÇÃO ASH */}
                    {step === 2 && validationStatus?.success && (
                        <div className="space-y-4">
                            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-sm text-cyan-300">
                                ℹ️ Você pode otimizar suas tarefas com Ash antes de importar. Ash analisará o contexto de energia, ciclo menstrual e humor para dar prioridades e insights melhores.
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Dados a importar: <span className="text-white font-semibold">{previewData?.total || 0} cards</span></p>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PROCESSANDO */}
                    {step === 4 && (
                        <div className="text-center py-8 space-y-6">
                            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                {isProcessing ? (
                                    <IconLoader2 className="w-12 h-12 animate-spin text-cyan-400" />
                                ) : (
                                    <IconUpload className="w-12 h-12 text-green-400" />
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-white">
                                    {isProcessing ? 'Conectando ao Trello...' : 'Importação Concluída!'}
                                </h3>
                                {importStats.total > 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        {importStats.total} cards importados
                                        {importStats.errors > 0 && <span className="text-red-400"> ({importStats.errors} erros)</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 1 && (
                        <Button 
                            onClick={handleValidateConnection} 
                            disabled={!trelloToken || !trelloBoardId || isValidating}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
                        >
                            {isValidating ? '...' : '🔗 Testar Conexão'} <IconArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                    {step === 1.5 && validationStatus?.success && (
                        <Button 
                            onClick={handleImport}
                            className="w-full bg-primary text-white gap-2"
                        >
                            Prosseguir <IconArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                    {step === 1.5 && !validationStatus?.success && (
                        <Button 
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="w-full"
                        >
                            Voltar
                        </Button>
                    )}
                    {step === 2 && (
                        <div className="w-full flex gap-2">
                            <Button 
                                onClick={handleImportWithoutAsh}
                                disabled={ashProcessing}
                                variant="outline"
                                className="flex-1"
                            >
                                Importar Direto
                            </Button>
                            <Button 
                                onClick={handleAshProcess}
                                disabled={ashProcessing}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
                            >
                                {ashProcessing ? <IconLoader2 className="w-4 h-4 animate-spin" /> : '✨'} Otimizar com Ash
                            </Button>
                        </div>
                    )}
                    {step === 4 && !isProcessing && (
                        <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            Concluir
                        </Button>
                    )}
                </DialogFooter>

                <AshImportPreviewModal
                    isOpen={showAshPreview}
                    onClose={() => setShowAshPreview(false)}
                    preview={ashPreviewData}
                    onConfirm={handleConfirmAshOptimizations}
                    onReject={() => setShowAshPreview(false)}
                    isConfirming={isProcessing}
                />
            </DialogContent>
        </Dialog>
    );
}
