/* src/components/importer/AsanaImportModal.jsx
   desc: Modal para importar dados do Asana via API
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

export default function AsanaImportModal({ isOpen, onClose, onImportComplete }) {
    const [step, setStep] = useState(1); // 1: Credenciais, 1.5: Validação, 2: Preview, 3: Ash, 4: Processando
    const [asanaToken, setAsanaToken] = useState('');
    const [asanaProjectId, setAsanaProjectId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validationStatus, setValidationStatus] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [importStats, setImportStats] = useState({ total: 0, current: 0, errors: 0 });
    const [ashProcessing, setAshProcessing] = useState(false);
    const [ashPreviewData, setAshPreviewData] = useState(null);
    const [showAshPreview, setShowAshPreview] = useState(false);

    const handleValidateConnection = async () => {
        if (!asanaToken.trim()) {
            return toast.error("Insira o token do Asana");
        }
        if (!asanaProjectId.trim()) {
            return toast.error("Insira o ID do projeto");
        }

        setIsValidating(true);
        try {
            const response = await apiClient.post('/import/validate/asana', {
                token: asanaToken.trim(),
                projectId: asanaProjectId.trim()
            });

            if (response.data?.success) {
                setValidationStatus({ success: true });
                toast.success("✅ Conexão validada com sucesso!");
                setStep(1.5); // Vai para preview
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
            const response = await apiClient.post('/import/preview/asana', {
                token: asanaToken.trim(),
                projectId: asanaProjectId.trim()
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
            const tasksToProcess = previewData.data.slice(0, 100); // Limita a 100 para não sobrecarregar
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
            const response = await apiClient.post('/import/asana', {
                asanaToken: asanaToken.trim(),
                asanaProjectId: asanaProjectId.trim()
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
            console.error("Falha ao importar Asana:", error);
            toast.error(error.response?.data?.error || "Erro ao conectar ao Asana");
            setIsProcessing(false);
            setStep(2);
        }
    };

    const handleClose = () => {
        setStep(1);
        setAsanaToken('');
        setAsanaProjectId('');
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
                        <IconUpload className="w-5 h-5 text-purple-400" />
                        Importar do Asana
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* STEP 1: CREDENCIAIS */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="asana-token" className="text-sm font-medium">
                                    Token de Acesso do Asana
                                </Label>
                                <Input
                                    id="asana-token"
                                    type="password"
                                    placeholder="0/xxxxxxxxxxxxxxxxxxxxx"
                                    value={asanaToken}
                                    onChange={(e) => setAsanaToken(e.target.value)}
                                    className="mt-2 bg-black/20 border-white/10"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Crie em: <a href="https://app.asana.com/-/account_api" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">app.asana.com/-/account_api</a>
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="asana-project-id" className="text-sm font-medium">
                                    ID do Projeto
                                </Label>
                                <Input
                                    id="asana-project-id"
                                    placeholder="1234567890123456"
                                    value={asanaProjectId}
                                    onChange={(e) => setAsanaProjectId(e.target.value)}
                                    className="mt-2 bg-black/20 border-white/10"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Copie do URL: asana.com/0/123456789/<b>1234567890123456</b>/list
                                </p>
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs text-purple-300">
                                <p className="font-medium mb-1">📌 Passos:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Acesse account_api em Asana</li>
                                    <li>Crie um token de acesso pessoal</li>
                                    <li>Copie o token completo</li>
                                    <li>Copie o ID do projeto da URL</li>
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
                                                            <span className="text-purple-400">{item.status || 'incomplete'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">Total: {previewData.total} tasks</p>
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
                            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-300">
                                ℹ️ Você pode otimizar suas tarefas com Ash antes de importar. Ash analisará o contexto de energia, ciclo menstrual e humor para dar prioridades e insights melhores.
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Dados a importar: <span className="text-white font-semibold">{previewData?.total || 0} tasks</span></p>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PROCESSANDO */}
                    {step === 4 && (
                        <div className="text-center py-8 space-y-6">
                            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                {isProcessing ? (
                                    <IconLoader2 className="w-12 h-12 animate-spin text-purple-400" />
                                ) : (
                                    <IconUpload className="w-12 h-12 text-green-400" />
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-white">
                                    {isProcessing ? 'Conectando ao Asana...' : 'Importação Concluída!'}
                                </h3>
                                {importStats.total > 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        {importStats.total} tasks importadas
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
                            disabled={!asanaToken || !asanaProjectId || isValidating}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
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
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2"
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
