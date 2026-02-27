/**
 * AdminPlansPanel.jsx
 * 
 * Painel de administração para gerenciar planos de assinatura
 * Permite editar features, limites e preços dos planos
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  IconCheck, IconX, IconEdit, IconPlus, 
  IconSettings, IconDollarSign
} from '@/components/icons/PranaLandscapeIcons';
import { getAllPlans, ALL_FEATURES, getAvailableFeatures } from '@/config/plansConfig';
import { toast } from 'sonner';

const AdminPlansPanel = () => {
  const [plans, setPlans] = useState(getAllPlans());
  const [editingPlan, setEditingPlan] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  /**
   * Começar a editar um plano
   */
  const handleEditPlan = (plan) => {
    setEditingPlan({ ...plan });
    setSelectedFeatures([...plan.features]);
    setShowFeatureModal(true);
  };

  /**
   * Salvar mudanças do plano
   */
  const handleSavePlan = () => {
    if (!editingPlan) return;

    const updatedPlan = {
      ...editingPlan,
      features: selectedFeatures,
    };

    setPlans(plans.map(p => p.id === editingPlan.id ? updatedPlan : p));
    
    // Aqui você salvaria no banco de dados
    // await savePlanToDatabase(updatedPlan);
    
    toast.success(`Plano "${editingPlan.name}" atualizado com sucesso!`);
    setEditingPlan(null);
    setShowFeatureModal(false);
  };

  /**
   * Toggle feature no plano
   */
  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  /**
   * Atualizar limite do plano
   */
  const updateLimit = (limitKey, value) => {
    setEditingPlan(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limitKey]: value === 'unlimited' ? null : parseInt(value),
      }
    }));
  };

  /**
   * Atualizar preço
   */
  const updatePrice = (value) => {
    setEditingPlan(prev => ({
      ...prev,
      price: value === 'custom' ? null : parseFloat(value),
    }));
  };

  return (
    <div className="w-full h-full p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Planos de Assinatura</h1>
          <p className="text-muted-foreground">
            Configure quais features estão disponíveis em cada plano
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map(plan => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative border border-white/10 rounded-lg p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              {/* Badge cor */}
              <div className={`absolute top-0 right-0 w-1 h-12 rounded-l bg-${plan.color}-500`} />

              {/* Header do plano */}
              <div className="mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Preço */}
              <div className="mb-4">
                {plan.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">R$ {plan.price}</span>
                    <span className="text-xs text-muted-foreground">/{plan.cycle}</span>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-amber-500">Preço Customizado</div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-6 text-sm border-t border-b border-white/5 py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projetos:</span>
                  <span className="font-semibold">
                    {plan.limits.maxProjects === null ? '∞' : plan.limits.maxProjects}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarefas:</span>
                  <span className="font-semibold">
                    {plan.limits.maxTasks === null ? '∞' : plan.limits.maxTasks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features:</span>
                  <span className="font-semibold">{plan.features.length}</span>
                </div>
              </div>

              {/* Botão Editar */}
              <Button
                onClick={() => handleEditPlan(plan)}
                className="w-full gap-2"
                variant="outline"
                size="sm"
              >
                <IconEdit className="w-4 h-4" />
                Editar Plano
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Modal de Edição */}
        <AnimatePresence>
          {editingPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              >
                <div className="sticky top-0 bg-card border-b border-white/10 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Editar Plano: {editingPlan.name}</h2>
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-8">
                  {/* Seção de Informações Básicas */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <IconDollarSign className="w-5 h-5" />
                      Informações Básicas
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Preço */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                        <select
                          value={editingPlan.price === null ? 'custom' : editingPlan.price}
                          onChange={(e) => updatePrice(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                        >
                          <option value="0">Gratuito</option>
                          <option value="29">R$ 29</option>
                          <option value="49">R$ 49</option>
                          <option value="99">R$ 99</option>
                          <option value="custom">Customizado</option>
                        </select>
                      </div>

                      {/* Ciclo */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Ciclo</label>
                        <select
                          value={editingPlan.cycle}
                          onChange={(e) => setEditingPlan(prev => ({ ...prev, cycle: e.target.value }))}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                        >
                          <option value="mensal">Mensal</option>
                          <option value="anual">Anual</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Limites */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <IconSettings className="w-5 h-5" />
                      Limites
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Max Projetos */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Máximo de Projetos</label>
                        <select
                          value={editingPlan.limits.maxProjects === null ? 'unlimited' : editingPlan.limits.maxProjects}
                          onChange={(e) => updateLimit('maxProjects', e.target.value)}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                        >
                          <option value="3">3</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="100">100</option>
                          <option value="unlimited">Ilimitado</option>
                        </select>
                      </div>

                      {/* Max Tarefas */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Máximo de Tarefas</label>
                        <select
                          value={editingPlan.limits.maxTasks === null ? 'unlimited' : editingPlan.limits.maxTasks}
                          onChange={(e) => updateLimit('maxTasks', e.target.value)}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                        >
                          <option value="50">50</option>
                          <option value="200">200</option>
                          <option value="500">500</option>
                          <option value="5000">5000</option>
                          <option value="unlimited">Ilimitado</option>
                        </select>
                      </div>

                      {/* Storage */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Armazenamento (GB)</label>
                        <select
                          value={editingPlan.limits.storageGB === null ? 'unlimited' : editingPlan.limits.storageGB}
                          onChange={(e) => updateLimit('storageGB', e.target.value)}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                        >
                          <option value="1">1 GB</option>
                          <option value="5">5 GB</option>
                          <option value="10">10 GB</option>
                          <option value="500">500 GB</option>
                          <option value="unlimited">Ilimitado</option>
                        </select>
                      </div>

                      {/* Membros da Equipe */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Membros da Equipe</label>
                        <select
                          value={editingPlan.limits.maxTeamMembers === null ? 'unlimited' : editingPlan.limits.maxTeamMembers}
                          onChange={(e) => updateLimit('maxTeamMembers', e.target.value)}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="10">10</option>
                          <option value="unlimited">Ilimitado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <IconSettings className="w-5 h-5" />
                      Features ({selectedFeatures.length} de {getAvailableFeatures().length})
                    </h3>

                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 bg-white/[0.02] rounded border border-white/5">
                      {getAvailableFeatures().map(feature => (
                        <button
                          key={feature}
                          onClick={() => toggleFeature(feature)}
                          className={`p-3 rounded border text-left transition-colors ${
                            selectedFeatures.includes(feature)
                              ? 'bg-primary/20 border-primary text-white'
                              : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                              selectedFeatures.includes(feature)
                                ? 'bg-primary border-primary'
                                : 'border-white/20'
                            }`}>
                              {selectedFeatures.includes(feature) && (
                                <IconCheck className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium capitalize flex-1">
                              {feature.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer com botões */}
                <div className="sticky bottom-0 border-t border-white/10 bg-card p-6 flex gap-3 justify-end">
                  <Button
                    onClick={() => setEditingPlan(null)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSavePlan}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <IconCheck className="w-4 h-4 mr-2" />
                    Salvar Mudanças
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPlansPanel;
