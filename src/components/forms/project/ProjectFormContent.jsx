/* src/components/forms/project/ProjectFormContent.jsx
   desc: Formulário para criar/editar Projetos com identidade visual Prana + Integração GitHub.
   feat: glassmorphism, Framer Motion, gradients temáticos, GitHub Repo Selector.
*/
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconLayers, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { Github, AlertCircle, Loader2 } from 'lucide-react'; // Ícones adicionais
import { useTranslations } from '@/components/LanguageProvider';
import { usePermission } from '@/hooks/usePermission';
import TagPicker from '@/components/forms/TagPicker';
import SaveAsTemplateModal from '@/components/forms/SaveAsTemplateModal';

export default function ProjectFormContent({ 
    initialData = {}, 
    onSave, 
    onCancel, 
    isLoading = false 
}) {
    const t = useTranslations();
    const { hasAccess: canFilterContext } = usePermission('work_life_balance_filter');

    const [title, setTitle] = React.useState(initialData.title || '');
    const [description, setDescription] = React.useState(initialData.description || '');
    const [status, setStatus] = React.useState(initialData.status || 'active');
    const [projectType, setProjectType] = React.useState(initialData.type || 'personal');
    const [isShared, setIsShared] = React.useState(initialData.isShared || false);
    const [selectedTags, setSelectedTags] = React.useState(initialData.tags || []);
    const [suggestedTags, setSuggestedTags] = React.useState([]);
    const [showSaveTemplateModal, setShowSaveTemplateModal] = React.useState(false);
    const [createdProject, setCreatedProject] = React.useState(null);

    // --- GITHUB STATES ---
    const [repos, setRepos] = React.useState([]);
    const [loadingRepos, setLoadingRepos] = React.useState(false);
    const [selectedRepo, setSelectedRepo] = React.useState("");
    const [githubError, setGithubError] = React.useState(null);

    // 1. Carregar tags sugeridas ao montar
    React.useEffect(() => {
        const loadSuggestedTags = async () => {
            try {
                const response = await fetch('/api/tags/suggested');
                const tags = await response.json();
                setSuggestedTags(tags);
            } catch (error) {
                console.error('Erro ao carregar tags sugeridas:', error);
            }
        };
        loadSuggestedTags();
    }, []);

    // 2. Inicializar GitHub: Extrair repo atual e Buscar Lista
    React.useEffect(() => {
        // A) Tenta ler da descrição inicial se já existe vínculo
        if (initialData.description) {
            const match = initialData.description.match(/\[github_repo:(.*?)\]/);
            if (match) setSelectedRepo(match[1]);
        }

        // B) Busca repositórios da API
        const fetchRepos = async () => {
            setLoadingRepos(true);
            try {
                const res = await fetch('/api/integrations/github/repos');
                const json = await res.json();
                
                if (json.success) {
                    setRepos(json.repos);
                } else {
                    // Se falhar (ex: 401 ou msg de erro), assume não conectado
                    if (json.message?.includes('não conectado') || json.message?.includes('GitHub não')) {
                        setGithubError('not_connected');
                    }
                }
            } catch (e) {
                console.error("Erro ao buscar repos:", e);
            } finally {
                setLoadingRepos(false);
            }
        };
        fetchRepos();
    }, [initialData.description]);

    const handleCreateTag = async (tagData) => {
        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tagData)
            });
            const newTag = await response.json();
            setSuggestedTags([...suggestedTags, newTag]);
            return newTag;
        } catch (error) {
            console.error('Erro ao criar tag:', error);
            return null;
        }
    };

    // Lógica inteligente: Ao mudar o repo, injeta a tag na descrição
    const handleRepoChange = (repoFullName) => {
        setSelectedRepo(repoFullName);
        
        let newDesc = description;
        // Remove tag antiga se existir (limpa sujeira)
        newDesc = newDesc.replace(/\[github_repo:.*?\]\s*/g, "").trim();
        
        // Adiciona nova tag se um repo válido foi escolhido
        if (repoFullName && repoFullName !== 'none') {
            newDesc = `${newDesc}\n\n[github_repo:${repoFullName}]`.trim();
        }
        
        setDescription(newDesc);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        await onSave({
            title: title.trim(),
            description: description.trim(), // A descrição já contém a tag do GitHub
            status,
            type: projectType,
            isShared: projectType === 'professional' ? isShared : false,
            visibility: isShared ? 'shared' : 'private',
            tags: selectedTags
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass-effect border border-white/10 rounded-2xl bg-card prana-form-modal overflow-hidden"
        >
            {/* Header com Gradient Purple */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <IconLayers className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-serif font-semibold text-white text-glow">Novo Projeto</h3>
                        <p className="text-xs text-muted-foreground/70">Crie um novo espaço para suas ideias</p>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Título do Projeto
                    </label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Website v3..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-purple-400"
                        autoFocus
                        disabled={isLoading}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Descrição
                    </label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o seu projeto, objetivos e visão..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-purple-400 min-h-[80px]"
                        disabled={isLoading}
                    />
                     <p className="text-[10px] text-muted-foreground/50 mt-1 ml-1">
                        Tags de sistema (como [github_repo]) são gerenciadas automaticamente.
                    </p>
                </div>

                {/* === INTEGRAÇÃO GITHUB === */}
                <div className="pt-2 pb-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        <Github className="w-3 h-3" /> Repositório GitHub
                    </label>
                    
                    {githubError === 'not_connected' ? (
                        <Alert variant="default" className="py-2 h-auto bg-yellow-500/10 border-yellow-500/20">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="ml-2 text-xs text-yellow-200/80">
                                GitHub não conectado. Vá em <strong>Configurações</strong> para ativar.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Select 
                            value={selectedRepo} 
                            onValueChange={handleRepoChange} 
                            disabled={loadingRepos || isLoading}
                        >
                            <SelectTrigger className="bg-black/20 border-white/10 focus:border-purple-400 text-white">
                                <SelectValue placeholder={loadingRepos ? "Carregando repos..." : "Selecione um repositório (Opcional)"} />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border border-white/10 max-h-[200px]">
                                <SelectItem value="none" className="text-white/70">-- Nenhum --</SelectItem>
                                {repos.map((repo) => (
                                    <SelectItem key={repo.id} value={repo.full_name} className="text-white hover:bg-white/10">
                                        {repo.full_name} {repo.private ? '🔒' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* === TIPO DE PROJETO (Personal/Professional) === */}
                {canFilterContext && (
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-3">
                            {t('project_type_label') || 'Tipo de Projeto'}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Pessoal */}
                            <button
                                type="button"
                                onClick={() => {
                                    setProjectType('personal');
                                    setIsShared(false);
                                }}
                                disabled={isLoading}
                                className={`p-3 border-2 rounded-lg transition-all ${
                                    projectType === 'personal'
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="text-sm font-semibold text-white">🔒 {t('project_personal') || 'Pessoal'}</div>
                                <div className="text-xs text-muted-foreground mt-1">{t('project_personal_desc') || 'Apenas você vê'}</div>
                            </button>

                            {/* Profissional */}
                            <button
                                type="button"
                                onClick={() => setProjectType('professional')}
                                disabled={isLoading}
                                className={`p-3 border-2 rounded-lg transition-all ${
                                    projectType === 'professional'
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="text-sm font-semibold text-white">👥 {t('project_professional') || 'Profissional'}</div>
                                <div className="text-xs text-muted-foreground mt-1">{t('project_professional_desc') || 'Pode compartilhar com time'}</div>
                            </button>
                        </div>
                    </div>
                )}

                {/* === Compartilhamento === */}
                {canFilterContext && projectType === 'professional' && (
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isShared}
                                onChange={(e) => setIsShared(e.target.checked)}
                                disabled={isLoading}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-white">{t('project_share_team') || 'Compartilhar com time'}</span>
                        </label>
                    </div>
                )}

                {/* Status */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Status
                    </label>
                    <Select value={status} onValueChange={setStatus} disabled={isLoading}>
                        <SelectTrigger className="bg-black/20 border-white/10 focus:border-purple-400">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 border border-white/10">
                            <SelectItem value="active" className="text-white hover:bg-white/10">Ativo</SelectItem>
                            <SelectItem value="pending" className="text-white hover:bg-white/10">Pendente</SelectItem>
                            <SelectItem value="completed" className="text-white hover:bg-white/10">Completo</SelectItem>
                            <SelectItem value="archived" className="text-white hover:bg-white/10">Arquivado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* TagPicker */}
                <TagPicker
                    selectedTags={selectedTags}
                    onChange={setSelectedTags}
                    onCreateTag={handleCreateTag}
                    suggestedTags={suggestedTags}
                />

                {/* Help Text */}
                <p className="text-xs text-muted-foreground/70 italic">
                    Defina o status e a descrição do seu projeto para organizar melhor.
                </p>

                {/* Footer */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button 
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit"
                        disabled={!title.trim() || isLoading}
                        className="flex-1 glow-effect gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    >
                        {isLoading && <IconLoader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? 'Salvando...' : 'Criar Projeto'}
                    </Button>
                </div>
            </form>

            {/* Modal para Salvar como Template */}
            {createdProject && (
                <SaveAsTemplateModal 
                    project={createdProject}
                    isOpen={showSaveTemplateModal}
                    onClose={() => {
                        setShowSaveTemplateModal(false);
                        setCreatedProject(null);
                    }}
                    onSave={() => {
                        setShowSaveTemplateModal(false);
                        setCreatedProject(null);
                    }}
                />
            )}
        </motion.div>
    );
}