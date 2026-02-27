/* src/api/services/automationService.js */
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const automationService = {
    
    /**
     * Verifica regras para um registro específico que acabou de ser alterado
     */
    async checkAndExecute(projectId, record) {
        console.log(`[Auto] Verificando regras para projeto ${projectId}...`);

        // 1. Busca todas as regras ativas deste projeto
        const rules = await db.query.projectAutomations.findMany({
            where: eq(schema.projectAutomations.projectId, projectId)
        });

        if (rules.length === 0) return;

        // 2. Itera sobre as regras e verifica condições
        for (const rule of rules) {
            const shouldRun = this.evaluateCondition(record, rule);
            
            if (shouldRun) {
                console.log(`[Auto] Regra "${rule.name}" disparada!`);
                await this.executeAction(rule, record);
            }
        }
    },

    /**
     * Avalia: O registro atende à condição da regra?
     */
    evaluateCondition(record, rule) {
        const field = rule.triggerField; // ex: 'stock'
        
        // Busca valor no nível raiz (title) ou dentro de properties
        let value = record[field] || (record.properties ? record.properties[field] : null);
        
        if (value === undefined || value === null) return false;

        // Normaliza para comparação
        const ruleValue = rule.triggerValue; // O que está salvo no DB (string)
        
        // Tenta converter para número se possível para comparações matemáticas
        const numValue = parseFloat(value);
        const numRule = parseFloat(ruleValue);
        const isNumber = !isNaN(numValue) && !isNaN(numRule);

        switch (rule.triggerCondition) {
            case 'eq': return String(value) === String(ruleValue);
            case 'neq': return String(value) !== String(ruleValue);
            case 'contains': return String(value).toLowerCase().includes(String(ruleValue).toLowerCase());
            
            case 'gt': // Maior que
                return isNumber ? numValue > numRule : false;
            
            case 'lt': // Menor que
                return isNumber ? numValue < numRule : false;
                
            default: return false;
        }
    },

    /**
     * Executa a ação definida (Criar Tarefa, Notificar, etc)
     */
    async executeAction(rule, record) {
        try {
            const config = rule.actionConfig || {};

            if (rule.actionType === 'create_task') {
                // Substituição de variáveis (Template String simples)
                // Ex: "Comprar {{title}}" vira "Comprar Café"
                let title = config.title || "Tarefa Automática";
                title = title.replace(/{{title}}/g, record.title);
                
                // Verifica se tem outras variáveis nas propriedades
                if (record.properties) {
                    for (const [key, val] of Object.entries(record.properties)) {
                        title = title.replace(new RegExp(`{{${key}}}`, 'g'), val);
                    }
                }

                // Cria a tarefa
                await db.insert(schema.tasks).values({
                    id: createId('task'),
                    projectId: rule.projectId,
                    relatedRecordId: record.id, // Vincula ao record que disparou!
                    title: title,
                    status: 'todo',
                    priority: config.priority || 'medium',
                    automationOriginId: rule.id, // Rastreabilidade
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                console.log(`[Auto] Tarefa criada: ${title}`);
            }
            
            // Aqui você pode adicionar 'notify_ash', 'send_email', etc.

        } catch (error) {
            console.error(`[Auto] Erro ao executar regra ${rule.id}:`, error);
        }
    }
};