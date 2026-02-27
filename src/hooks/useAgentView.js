import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';

export function useAgentView(dataType, itemData) {
    const [agentView, setAgentView] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!itemData) {
            setAgentView(null);
            return;
        }

        const fetchAgentMatch = async () => {
            setIsLoading(true);
            try {
                // Pergunta ao Registry quem é o especialista para este item
                const response = await apiClient.post('/agents/resolve-view', {
                    dataType,
                    metadata: itemData
                });

                if (response.data.match) {
                    setAgentView(response.data.match.agent);
                } else {
                    setAgentView(null);
                }
            } catch (error) {
                console.error("[AgentView] Erro ao resolver agente:", error);
                setAgentView(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgentMatch();
    }, [dataType, itemData?.id]); // Reage se o ID do item mudar

    return { agentView, isLoading };
}