/* src/components/forms/PranaFormModal.jsx
   desc: Modal Mestre V10 (Integridade Neural OS).
   feat: Orquestração de Entidades com herança de Realms.
   arch: Desacoplado - Consome 'canUseRealms' do Store para permissões.
   design: Wabi-Sabi (Transparências e sobriedade).
*/
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 
import { toast } from 'sonner';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

// Ícones Oficiais do Sistema
import { 
  IconLoader2, IconStar, IconLock, IconTarget, IconHash, IconZap
} from '@/components/icons/PranaLandscapeIcons';

// Componentes de Overlay Especializados
import TaskWorkspaceOverlay from '@/components/tasks/TaskWorkspaceOverlay';

// Form Contents (Modularizados)
import SparkFormContent from '@/components/forms/spark/SparkFormContent';
import ProjectFormContent from '@/components/forms/project/ProjectFormContent';
import DocumentFormContent from '@/components/forms/document/DocumentFormContent';
import EventFormContent from '@/components/forms/event/EventFormContent';
import RoutineFormContent from '@/components/forms/checklist/RoutineFormContent';
import ChecklistFormContent from '@/components/forms/checklist/ChecklistFormContent';
import SankalpaFormModal from './SankalpaFormModal'; 

// Entidades (API Communication Layer)
import { 
  Task, Project, Document, User, Record, Checklist, Routine, Sankalpa 
} from '@/api/entities';
import { cn } from '@/lib/utils';

// Seletores Bio-Digitais
import { EnergySelector } from '@/components/forms/document/EnergySelector';
import { TaskTypeSelector } from '@/components/tasks/TaskTypeSelector.jsx';

export default function PranaFormModal({ 
  isOpen: externalIsOpen, 
  onClose: externalOnClose, 
  itemType: externalItemType = 'task', 
  editingItemId = null,
  defaultProjectId = null,
  initialData = {}, 
  onSave: externalOnSave = null
}) {
  const { 
    isPranaFormOpen, 
    pranaFormConfig, 
    closePranaForm, 
    activeRealmId,
    canUseRealms // [V10] Função de permissão original do seu Store
  } = useWorkspaceStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRealmId, setSelectedRealmId] = useState('personal');
  const [projectSchema, setProjectSchema] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({});
  const [recordTitle, setRecordTitle] = useState('');
  const [isFixed, setIsFixed] = useState(false); 
  const [schemaLoading, setSchemaLoading] = useState(false);

  // Resolvendo visibilidade e contexto
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : isPranaFormOpen;
  const onClose = externalOnClose || closePranaForm;
  const itemType = externalItemType || pranaFormConfig?.itemType || 'task';
  const resolvedDefaultProjectId = defaultProjectId || pranaFormConfig?.defaultProjectId;
  const type = itemType?.toLowerCase() || 'task';

  useEffect(() => {
    const initModal = async () => {
      if (!isOpen) return;

      const data = initialData.id ? initialData : (pranaFormConfig?.initialData || {});
      
      setRecordTitle(data.title || '');
      setIsFixed(data.is_fixed || false);
      
      // Lógica de Herança de Realm V10
      const targetRealm = data.realmId || (activeRealmId === 'all' ? 'personal' : activeRealmId);
      setSelectedRealmId(targetRealm);

      if (data.properties) setDynamicValues(data.properties);
      else setDynamicValues({});

      if (resolvedDefaultProjectId && type === 'record') {
        setSchemaLoading(true);
        try {
          const project = await Project.get(resolvedDefaultProjectId);
          const schema = project.fields_schema || project.settings?.fields_schema || [];
          setProjectSchema(schema);
        } catch (e) {
          console.warn("V10 Kernel: Schema load failed", e);
        } finally {
          setSchemaLoading(false);
        }
      }
    };

    initModal();
  }, [isOpen, resolvedDefaultProjectId, type, editingItemId, initialData, pranaFormConfig, activeRealmId]);

  const handleDynamicChange = (key, value) => {
      setDynamicValues(prev => ({ ...prev, [key]: value }));
  };

  // --- DELEGAÇÃO: TAREFAS USAM OVERLAY DEDICADO ---
  if (type === 'task') {
    return (
      <TaskWorkspaceOverlay 
        isOpen={isOpen}
        onClose={onClose}
        taskData={editingItemId ? { id: editingItemId } : { project_id: resolvedDefaultProjectId, realmId: selectedRealmId }}
        customSchema={projectSchema} 
        onSave={() => { externalOnSave?.(); onClose(); }}
      />
    );
  }

  // --- HANDLER DE SALVAMENTO MASTER ---
  const handleSave = async (payload = {}) => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      const finalPayload = {
          ...payload,
          realmId: selectedRealmId, 
          is_fixed: isFixed,
          properties: {
              ...(payload.properties || {}),
              ...dynamicValues 
          }
      };

      if (resolvedDefaultProjectId && !finalPayload.project_id) {
          finalPayload.project_id = resolvedDefaultProjectId;
      }

      let entity;
      switch (type) {
        case 'spark':
        case 'thought':entity = Thought; 
          if (!editingItemId) finalPayload.status = 'seed'; // Status inicial de um insight
          break;
        case 'event': entity = Event; break;
        case 'project': entity = Project; break;
        case 'document': entity = Document; break;
        case 'event': entity = Task; break;
        case 'routine': entity = Routine; break;
        case 'checklist': entity = Checklist; break;
        case 'record': entity = Record; break;
        case 'sankalpa': entity = Sankalpa; break;
        default: entity = Task;
      }

      if (editingItemId) {
        await entity.update(editingItemId, finalPayload);
        toast.success(`${getTypeName()} atualizado.`);
      } else {
        if (user) finalPayload.created_by = user.email;
        const result = await entity.create(finalPayload);
        toast.success(`${getTypeName()} manifestado.`);
        
        window.dispatchEvent(new CustomEvent('prana:refresh-explorer', { 
          detail: { itemType: type, itemId: result.id, projectId: resolvedDefaultProjectId } 
        }));
      }

      externalOnSave?.();
      onClose();
    } catch (error) {
      console.error("Save Critical Error:", error);
      toast.error('Erro na persistência neural.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeName = () => {
    const map = { 
        spark: 'Pensamento', thought: 'Insight', project: 'Projeto', 
        document: 'Documento', record: 'Registro', routine: 'Rotina', 
        checklist: 'Item', sankalpa: 'Sankalpa' 
    };
    return map[type] || 'Item';
  };

  // --- SUB-COMPONENTE: REALM SELECTOR (Sintonizado com canUseRealms) ---
  const renderRealmSelector = () => {
      // Uso da função exata do seu useWorkspaceStore
      if (!canUseRealms()) return null;

      return (
          <div className="flex items-center gap-3 mb-6 bg-white/[0.03] p-1.5 rounded-full w-fit border border-white/5">
              {[
                  { id: 'personal', label: 'Pessoal', color: 'bg-emerald-500' },
                  { id: 'professional', label: 'Profissional', color: 'bg-indigo-500' }
              ].map(realm => (
                  <button
                    key={realm.id}
                    type="button"
                    onClick={() => setSelectedRealmId(realm.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        selectedRealmId === realm.id 
                            ? "bg-zinc-800 text-white shadow-lg border border-white/10" 
                            : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                      <div className={cn("w-1.5 h-1.5 rounded-full", realm.color, selectedRealmId !== realm.id && "opacity-30")} />
                      {realm.label}
                  </button>
              ))}
          </div>
      );
  };

  const renderDynamicFields = () => {
      if (schemaLoading) return <div className="py-2 text-xs opacity-50"><IconLoader2 className="animate-spin w-3 h-3 inline mr-2"/> Carregando arquitetura...</div>;
      if (!projectSchema || projectSchema.length === 0) return null;

      return (
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-2">
              <div className="col-span-2 text-[10px] uppercase tracking-widest opacity-40 font-black mb-1 px-1">Propriedades de Contexto</div>
              {projectSchema.map(field => (
                  <div key={field.key} className={cn("space-y-1.5", (field.type === 'text' || field.type === 'url') ? "col-span-2" : "col-span-1")}>
                      <Label className="text-[11px] text-muted-foreground font-bold ml-1">{field.label}</Label>
                      {field.type === 'rating' ? (
                          <div className="flex gap-1.5 px-1">
                              {[1,2,3,4,5].map(star => (
                                  <button key={star} type="button" onClick={() => handleDynamicChange(field.key, star)} className="focus:outline-none transition-transform active:scale-90">
                                      <IconStar className={cn("w-4 h-4", (dynamicValues[field.key] || 0) >= star ? "text-amber-400 fill-amber-400" : "text-white/10")} />
                                  </button>
                              ))}
                          </div>
                      ) : (field.type === 'select' || field.type === 'multi_select') ? (
                          <Select value={dynamicValues[field.key] || ''} onValueChange={(v) => handleDynamicChange(field.key, v)}>
                              <SelectTrigger className="bg-black/40 border-white/10 h-9 text-xs"><SelectValue placeholder="Escolher..." /></SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10">
                                  {(field.options || []).map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      ) : (
                          <Input 
                              type={field.type === 'number' ? 'number' : 'text'}
                              value={dynamicValues[field.key] || ''}
                              onChange={e => handleDynamicChange(field.key, e.target.value)}
                              className="bg-black/40 border-white/10 h-9 text-xs"
                          />
                      )}
                  </div>
              ))}
          </div>
      );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[600px] bg-background border border-white/10 p-0 overflow-hidden shadow-2xl max-h-[90vh] rounded-[32px] font-sans">
        <div className="max-h-[85vh] overflow-y-auto no-scrollbar">
            
            {type === 'record' && (
                 <DialogHeader className="px-8 pt-8 pb-2">
                    <DialogTitle className="font-serif text-2xl italic tracking-tight text-white/90">
                        {editingItemId ? 'Refinar Registro' : 'Novo Registro de Dados'}
                    </DialogTitle>
                 </DialogHeader>
            )}

            <div className="p-8">
                {type === 'sankalpa' ? (
                  <SankalpaFormModal 
                    isOpen={true} 
                    onClose={onClose} 
                    onCreated={() => { externalOnSave?.(); onClose(); }}
                    initialData={initialData}
                  />
                ) : (
                  <>
                    {renderRealmSelector()}

                    {(type === 'spark' || type === 'thought') && <SparkFormContent initialData={initialData} onSave={handleSave} onCancel={onClose} isLoading={isLoading} />}
                    {type === 'project' && <ProjectFormContent initialData={pranaFormConfig?.defaultValues || initialData} onSave={handleSave} onCancel={onClose} isLoading={isLoading} />}
                    {type === 'document' && <DocumentFormContent initialData={initialData} onSave={handleSave} onCancel={onClose} isLoading={isLoading} />}
                    {type === 'event' && <EventFormContent defaultValues={initialData} onSuccess={handleSave} isLoading={isLoading} />}
                    {type === 'routine' && <RoutineFormContent defaultValues={initialData} onSuccess={handleSave} isLoading={isLoading} />}
                    {type === 'checklist' && <ChecklistFormContent defaultValues={initialData} onSuccess={handleSave} isLoading={isLoading} />}

                    {type === 'record' && (
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 ml-1">Identificação</Label>
                                <Input 
                                    autoFocus
                                    placeholder="Ex: Nome do Cliente..."
                                    value={recordTitle}
                                    onChange={(e) => setRecordTitle(e.target.value)}
                                    className="bg-black/40 border-white/5 font-serif text-xl h-14 italic rounded-2xl px-5"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-[28px] border border-white/5 relative">
                                <div className="col-span-1">
                                     <EnergySelector 
                                        value={dynamicValues.energy_level} 
                                        onChange={(val) => handleDynamicChange('energy_level', val)}
                                        context="task"
                                     />
                                </div>
                                <div className="col-span-1">
                                     <TaskTypeSelector
                                        value={dynamicValues.task_type}
                                        onChange={(val) => handleDynamicChange('task_type', val)}
                                     />
                                </div>

                                <div className="col-span-full pt-4 border-t border-white/5 flex items-center gap-3">
                                    <Checkbox 
                                        id="fixed-record" 
                                        checked={isFixed} 
                                        onCheckedChange={setIsFixed}
                                        className="border-white/20 data-[state=checked]:bg-indigo-500"
                                    />
                                    <label htmlFor="fixed-record" className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        <IconLock className="w-3.5 h-3.5 text-indigo-400"/> Registro Imutável
                                    </label>
                                </div>
                            </div>
                            
                            {renderDynamicFields()}

                            <div className="flex justify-end gap-3 pt-8 border-t border-white/5">
                                <Button variant="ghost" onClick={onClose} className="rounded-xl h-12 px-6 hover:bg-white/5">Cancelar</Button>
                                <Button 
                                    onClick={() => handleSave({ title: recordTitle })}
                                    disabled={isLoading || !recordTitle} 
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[160px] h-12 rounded-2xl font-bold shadow-xl shadow-indigo-500/10 transition-all active:scale-95"
                                >
                                    {isLoading ? <IconLoader2 className="animate-spin w-5 h-5 mr-2"/> : null}
                                    Manifestar Dado
                                </Button>
                            </div>
                        </div>
                    )}
                  </>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}