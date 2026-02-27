/* src/components/importer/CSVImportModal.jsx
   desc: Wizard de Importação Universal.
   flow: Upload -> Mapeamento de Colunas -> Preview -> Ash Otimização -> Ingestão em Massa.
*/

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { IconUpload, IconArrowRight, IconCheckCircle, IconLoader2, IconAlertCircle } from '@/components/icons/PranaLandscapeIcons';
import { parseCSV } from '@/utils/csvParser';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { apiClient } from '@/api/apiClient';
import { AshImportPreviewModal } from './AshImportPreviewModal';

// Campos do Prana que aceitam importação
const PRANA_FIELDS = [
    { key: 'title', label: 'Título da Tarefa', required: true },
    { key: 'description', label: 'Descrição / Notas', required: false },
    { key: 'status', label: 'Status (Todo/Done)', required: false },
    { key: 'priority', label: 'Prioridade', required: false },
    { key: 'dueDate', label: 'Data de Entrega', required: false },
    { key: 'tags', label: 'Tags (separadas por vírgula)', required: false },
];

export default function CSVImportModal({ isOpen, onClose, projectId, onImportComplete }) {
    const [step, setStep] = useState(1); // 1: Upload, 2: Map, 2.5: Preview, 3: Ash, 4: Progress
    const [csvData, setCsvData] = useState({ headers: [], rows: [] });
    const [mapping, setMapping] = useState({}); // { prana_field: csv_header }
    const [importStats, setImportStats] = useState({ total: 0, current: 0, errors: 0, duplicates: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationStatus, setValidationStatus] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [duplicateCheck, setDuplicateCheck] = useState(null);
    const [ashProcessing, setAshProcessing] = useState(false);
    const [ashPreviewData, setAshPreviewData] = useState(null);
    const [showAshPreview, setShowAshPreview] = useState(false);

    // STEP 1: UPLOAD & PARSE
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const { headers, data } = parseCSV(evt.target.result);
                if (headers.length === 0 || data.length === 0) throw new Error("CSV vazio ou inválido.");
                
                setCsvData({ headers, rows: data });
                
                // Validar CSV
                const validation = { success: true, rowCount: data.length, headers };
                setValidationStatus(validation);
                
                // Gerar preview
                setPreviewData({
                  preview: data.slice(0, 5),
                  total: data.length,
                  showing: Math.min(5, data.length)
                });
                
                // Tentativa de Auto-Map (Match Fuzzy)
                const autoMap = {};
                headers.forEach(h => {
                    PRANA_FIELDS.forEach(field => {
                        if (h.toLowerCase().includes(field.label.split(' ')[0].toLowerCase()) || h.toLowerCase() === field.key.toLowerCase()) {
                            autoMap[field.key] = h;
                        }
                    });
                });
                setMapping(autoMap);
                setStep(2);
            } catch (err) {
                toast.error("Erro ao ler CSV. Verifique o formato.");
                setValidationStatus({ success: false, error: err.message });
            }
        };
        reader.readAsText(file);
    };

    // STEP 2.5: PREVIEW BEFORE IMPORT
    const handlePreview = async () => {
        setIsLoading(true);
        
        try {
            // Preparar dados para preview
            const previewRows = csvData.rows.slice(0, 5);
            const mappedPreview = previewRows.map(row => ({
                title: row[mapping['title']] || 'Sem Título',
                description: mapping['description'] ? row[mapping['description']] : '',
                status: mapping['status'] ? row[mapping['status']] : 'todo',
                priority: mapping['priority'] ? row[mapping['priority']] : 'medium',
                tags: mapping['tags'] ? row[mapping['tags']] : '',
            }));
            
            setPreviewData({
                preview: mappedPreview,
                total: csvData.rows.length
            });
            
            // Detectar duplicatas
            const response = await apiClient.post('/import/check-duplicates', {
                csvData: JSON.stringify(csvData.rows)
            });
            
            if (response.data?.duplicateCount > 0) {
                setDuplicateCheck(response.data);
                toast.warning(`⚠️ ${response.data.duplicateCount} items duplicados encontrados`);
            } else {
                setDuplicateCheck({ duplicateCount: 0 });
                toast.success('✅ Nenhum item duplicado encontrado');
            }
            
            setStep(2.5);
        } catch (error) {
            console.log('Verificação de duplicatas:', error);
            // Mesmo com erro, vamos prosseguir com preview
            setStep(2.5);
        } finally {
            setIsLoading(false);
        }
    };

    // STEP 3: PROCESS WITH ASH
    const handleAshProcess = async () => {
        try {
            setAshProcessing(true);
            toast.loading('✨ Ash analisando suas tarefas...');

            // Preparar tarefas para Ash
            const tasksToProcess = previewData.preview.map(item => ({
                title: item.title || item.name || item.task,
                description: item.description || '',
                dueDate: item.dueDate || item.due_date || null,
                priority: item.priority || 'medium',
                projectId: projectId || null
            }));

            // Chamar endpoint de processamento Ash
            const { data } = await apiClient.post('/import/ash-process', {
                tasks: tasksToProcess
            });

            toast.dismiss();
            
            if (data.success) {
                setAshPreviewData(data.processedTasks);
                setShowAshPreview(true);
                toast.success('✨ Ash otimizou suas tarefas!');
            } else {
                toast.error('Erro ao processar com Ash');
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.error || 'Erro ao processar com Ash');
            console.error('Ash processing error:', err);
        } finally {
            setAshProcessing(false);
        }
    };

    const handleConfirmAshOptimizations = async (processedTasks) => {
        try {
            setIsProcessing(true);
            toast.loading('📦 Aplicando otimizações...');

            const { data } = await apiClient.post('/import/apply-optimizations', {
                processedTasks
            });

            toast.dismiss();
            
            if (data.success) {
                setImportStats({
                    total: data.totalProcessed,
                    current: data.tasksCreated,
                    errors: data.errors.length,
                    duplicates: 0
                });
                
                toast.success(`✅ ${data.tasksCreated} tarefas importadas com sucesso!`);
                
                setTimeout(() => {
                    onImportComplete?.();
                    onClose();
                    setStep(1);
                    setCsvData({ headers: [], rows: [] });
                }, 1500);
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.error || 'Erro ao aplicar otimizações');
            console.error('Error applying optimizations:', err);
        } finally {
            setIsProcessing(false);
            setShowAshPreview(false);
        }
    };

    // STEP 4: EXECUTE IMPORT
    const executeImport = async () => {
        if (!mapping['title']) return toast.error("Por favor, mapeie a coluna de Título.");
        
        setStep(3);
        setIsProcessing(true);

        try {
            // Constrói payload com o CSV parseado
            const csvPayload = csvData.rows.map(row => {
                const taskData = {
                    title: row[mapping['title']] || 'Sem Título',
                    description: mapping['description'] ? row[mapping['description']] : '',
                    status: 'todo',
                    priority: 'medium'
                };

                if (mapping['dueDate'] && row[mapping['dueDate']]) {
                    const dateVal = Date.parse(row[mapping['dueDate']]);
                    if (!isNaN(dateVal)) taskData.dueDate = new Date(dateVal).toISOString();
                }

                if (mapping['status'] && row[mapping['status']]) {
                    const s = row[mapping['status']].toLowerCase();
                    if (s.includes('done') || s.includes('feito') || s.includes('completo')) taskData.status = 'done';
                    else if (s.includes('doing') || s.includes('andamento')) taskData.status = 'in_progress';
                }

                if (mapping['tags'] && row[mapping['tags']]) {
                    taskData.tags = row[mapping['tags']].split(',').map(t => t.trim());
                }

                return taskData;
            });

            // Envia para o backend via API
            const response = await apiClient.post('/import/csv', {
                csvData: JSON.stringify(csvPayload)
            });

            setImportStats({ 
                total: csvData.rows.length, 
                current: csvData.rows.length, 
                errors: response.data?.data?.errors?.length || 0 
            });

            toast.success(`${response.data?.data?.tasksCreated || csvData.rows.length} tarefas importadas com sucesso!`);
            if (onImportComplete) onImportComplete();
            setTimeout(handleClose, 1000);
        } catch (error) {
            console.error("Falha ao importar CSV:", error);
            toast.error(error.response?.data?.error || "Erro ao importar dados");
            setIsProcessing(false);
            setStep(2);
        }
    };

    const handleClose = () => {
        setStep(1);
        setCsvData({ headers: [], rows: [] });
        setMapping({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] bg-secondary/30 border-white/10 text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconUpload className="w-5 h-5 text-primary" />
                        Assistente de Migração
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* STEP 1: UPLOAD */}
                    {step === 1 && (
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <IconUpload className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-white">Arraste seu CSV aqui</p>
                                <p className="text-xs text-gray-500 mt-1">Compatível com Notion, Asana, Monday e Excel.</p>
                            </div>
                            <Input 
                                type="file" 
                                accept=".csv" 
                                className="hidden" 
                                id="csv-upload"
                                onChange={handleFileUpload}
                            />
                            <Button variant="outline" onClick={() => document.getElementById('csv-upload').click()}>
                                Selecionar Arquivo
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: MAP COLUMNS */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400">Encontramos <b>{csvData.rows.length} linhas</b>. Ajude-nos a organizar os dados:</p>
                            
                            <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-2 mb-2 text-xs font-bold uppercase tracking-widest opacity-50">
                                <span>Campo no Prana</span>
                                <span>Coluna no seu CSV</span>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {PRANA_FIELDS.map(field => (
                                    <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                                        <label className="text-sm flex items-center gap-1">
                                            {field.label}
                                            {field.required && <span className="text-red-400">*</span>}
                                        </label>
                                        <Select 
                                            value={mapping[field.key] || ''} 
                                            onValueChange={(val) => setMapping({...mapping, [field.key]: val})}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10 h-8 text-xs">
                                                <SelectValue placeholder="Ignorar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {csvData.headers.map(h => (
                                                    <SelectItem key={h} value={h}>{h}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2.5: PREVIEW */}
                    {step === 2.5 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-white">📋 Prévia dos Dados</h3>
                                <p className="text-xs text-gray-500">Aqui estão os primeiros 5 itens que serão importados:</p>
                            </div>

                            <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 max-h-[250px] overflow-y-auto">
                                <div className="sticky top-0 bg-white/5 border-b border-white/10 p-3 grid grid-cols-3 gap-2 text-xs font-bold opacity-50">
                                    <span>Título</span>
                                    <span>Status</span>
                                    <span>Prioridade</span>
                                </div>
                                <div className="space-y-1 p-3">
                                    {previewData?.preview?.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-3 gap-2 text-xs p-2 rounded border border-white/5 hover:bg-white/5 transition-colors">
                                            <span className="truncate">{item.title || '—'}</span>
                                            <span className="text-blue-400">{item.status || 'todo'}</span>
                                            <span className="text-amber-400">{item.priority || 'medium'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {duplicateCheck?.duplicateCount > 0 && (
                                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-300">
                                    ⚠️ {duplicateCheck.duplicateCount} items podem ser duplicatas. Vamos pular esses na importação.
                                </div>
                            )}

                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300">
                                ✅ Total: {previewData?.total} items
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PROGRESS */}
                    {step === 3 && (
                        <div className="text-center py-8 space-y-6">
                            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                                    <circle 
                                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                                        className="text-primary transition-all duration-300"
                                        strokeDasharray="283"
                                        strokeDashoffset={283 - (283 * (importStats.current / importStats.total))}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                                    {Math.round((importStats.current / importStats.total) * 100)}%
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-medium text-white">Importando dados...</h3>
                                <p className="text-sm text-gray-500">
                                    {importStats.current} de {importStats.total} processados
                                    {importStats.errors > 0 && <span className="text-red-400 ml-2">({importStats.errors} erros)</span>}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 2 && (
                        <div className="flex w-full justify-between">
                            <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
                            <Button 
                                onClick={handlePreview} 
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                {isLoading ? '...' : '📋 Ver Prévia'} <IconArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                    {step === 2.5 && (
                        <div className="flex w-full justify-between">
                            <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
                            <Button 
                                onClick={handleAshProcess}
                                disabled={ashProcessing}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2"
                            >
                                {ashProcessing ? (
                                    <>
                                        <IconLoader2 className="w-4 h-4 animate-spin" />
                                        Ash otimizando...
                                    </>
                                ) : (
                                    <>
                                        ✨ Otimizar com Ash
                                        <IconArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    {step === 3 && !isProcessing && (
                        <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            Concluir
                        </Button>
                    )}
                </DialogFooter>

                {/* Ash Preview Modal */}
                <AshImportPreviewModal
                    isOpen={showAshPreview}
                    preview={ashPreviewData}
                    onConfirm={handleConfirmAshOptimizations}
                    onReject={() => {
                        setShowAshPreview(false);
                        setAshPreviewData(null);
                        setStep(2.5);
                    }}
                    isConfirming={isProcessing}
                />
            </DialogContent>
        </Dialog>
    );
}