/* src/hooks/useProjectEntities.js
   desc: O Cérebro de Dados V8.
   feat: Unifica Tasks e Records, carrega Schema de Colunas e gerencia ações polimórficas.
   V10 Patch: Poda de Realm injetada na fonte de dados.
*/
import { useState, useEffect, useCallback } from 'react';
import { Task, Record, Project } from '@/api/entities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'; // [V10]
import { toast } from 'sonner';

export function useProjectEntities(projectId, mode = 'tasks') {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [projectConfig, setProjectConfig] = useState(null);

    // [V10] Consciência de Contexto
    const { activeRealmId } = useWorkspaceStore();

    // 1. CARREGAR DADOS E SCHEMA
    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            // A. Carrega o Projeto para ler o Schema de Colunas
            let projectSchema = [];
            let currentProjectRealm = null;

            if (projectId) {
                try {
                    const project = await Project.get(projectId);
                    setProjectConfig(project);
                    projectSchema = project.fields_schema || project.settings?.fields_schema || [];
                    currentProjectRealm = project.realmId; // Captura o Realm do Projeto
                } catch (e) {
                    console.warn("Não foi possível carregar config do projeto", e);
                }
            }

            // B. Carrega os Dados (Polimorfismo V8)
            let tasks = [];
            let records = [];

            // Modo Tasks ou Híbrido
            if (mode === 'tasks' || mode === null) {
                const filter = projectId ? { project_id: projectId } : {}; 
                let rawTasks = await Task.list({ ...filter, status_not: 'archived' });

                // [V10] Poda de Realm para Tasks
                if (activeRealmId !== 'all') {
                    rawTasks = rawTasks.filter(t => {
                        const tRealm = t.realmId || t.project?.realmId || currentProjectRealm || 'personal';
                        return tRealm === activeRealmId;
                    });
                }
                
                // Normalização de Tasks Original (PRESERVADA)
                tasks = rawTasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    status: t.status, 
                    priority: t.priority,
                    dueDate: t.dueDate || t.due_date,
                    assignee: t.ownerId,
                    tags: t.tags || [],
                    properties: t.properties || {}, 
                    type: 'task',
                    blockedBy: t.blockedBy || [], 
                    blocking: t.blocking || [],   
                    mindMapPosition: t.mindMapPosition, 
                    realmId: t.realmId || currentProjectRealm,
                    _original: t
                }));
            }

            // Modo Records ou Híbrido
            if (mode === 'records' || mode === null) {
                if (projectId) {
                    let rawRecords = await Record.list(projectId);

                    // [V10] Poda de Realm para Records
                    if (activeRealmId !== 'all') {
                        rawRecords = rawRecords.filter(r => (r.realmId || currentProjectRealm || 'personal') === activeRealmId);
                    }
                    
                    // Normalização de Records Original (PRESERVADA)
                    records = rawRecords.map(r => ({
                        id: r.id,
                        title: r.title,
                        status: r.properties?.status || 'active', 
                        properties: r.properties || {},
                        type: 'record',
                        blockedBy: r.blockedBy || [],
                        blocking: r.blocking || [],
                        mindMapPosition: r.mindMapPosition,
                        realmId: r.realmId || currentProjectRealm,
                        _original: r
                    }));
                }
            }

            // Unifica dados filtrados
            setItems([...tasks, ...records]);

            // C. Define as Colunas da View (Preservado V8)
            const defaultColumns = [
                { key: 'title', label: 'Nome', type: 'text', width: '300px', fixed: true },
                { key: 'status', label: 'Status', type: 'status', width: '120px', fixed: true }
            ];

            if (projectSchema.length === 0 && records.length > 0) {
                 const inferredKeys = Object.keys(records[0].properties || {});
                 projectSchema = inferredKeys.map(k => ({ key: k, label: k, type: 'text', width: '150px' }));
            }

            setColumns([...defaultColumns, ...projectSchema]);

        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados do projeto");
        } finally {
            setLoading(false);
        }
    }, [projectId, mode, activeRealmId]); // Refresh se o Realm mudar

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // 2. AÇÕES GENÉRICAS (Abstraction Layer V8)
    
    const createItem = async (payload) => {
        try {
            const targetType = payload.type || (mode === 'records' ? 'record' : 'task');
            const { type, ...cleanPayload } = payload;
            
            // Injeta Realm Ativo na criação se não for 'all'
            const creationRealm = activeRealmId === 'all' ? 'personal' : activeRealmId;

            let newItem;
            if (targetType === 'task') {
                newItem = await Task.create({ 
                    ...cleanPayload, 
                    project_id: projectId, 
                    realmId: cleanPayload.realmId || creationRealm 
                });
            } else {
                newItem = await Record.create({ 
                    ...cleanPayload, 
                    projectId, 
                    realmId: cleanPayload.realmId || creationRealm 
                });
            }
            
            await fetchItems(); 
            return newItem;
        } catch (e) {
            console.error(e);
            toast.error("Erro ao criar item");
            throw e;
        }
    };

    const updateItem = async (id, payload) => {
        try {
            const item = items.find(i => i.id === id);
            if (!item) return;

            const { properties, ...rootData } = payload;
            const updatePayload = { ...rootData };
            
            if (properties) {
                updatePayload.properties = {
                    ...(item.properties || {}),
                    ...properties
                };
            }

            if (item.type === 'task') {
                await Task.update(id, updatePayload);
            } else {
                await Record.update(id, updatePayload);
            }

            setItems(prev => prev.map(i => i.id === id ? { ...i, ...payload, properties: updatePayload.properties || i.properties } : i));
        } catch (e) {
            console.error(e);
            toast.error("Erro ao atualizar");
            fetchItems(); 
        }
    };

    const deleteItem = async (id) => {
        try {
            const item = items.find(i => i.id === id);
            if (!item) return;

            if (item.type === 'task') await Task.delete(id);
            else await Record.delete(id);
            
            setItems(prev => prev.filter(i => i.id !== id));
            toast.success("Item removido");
        } catch (e) {
            toast.error("Erro ao deletar");
        }
    };

    return {
        items,
        columns,
        loading,
        projectConfig, 
        actions: {
            refresh: fetchItems,
            create: createItem,
            update: updateItem,
            delete: deleteItem
        }
    };
}