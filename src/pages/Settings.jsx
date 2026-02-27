/* src/pages/Settings.jsx
   desc: Painel de Controle Neural com Layout VS Code.
   feat: Integrações refatoradas e estéticas Wabi-Sabi para modais e importadores.
*/
import React, { useState, useEffect } from 'react';
import { 
    IconSettings, IconVision, IconFlux, IconNeural, IconCosmos, IconSoul, 
    IconLogOut, IconSave, IconBrainCircuit, IconBookOpen, IconUpload, IconTrash, 
    IconFileText, IconGitBranch, IconCheckCircle, IconZap, IconPlus
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Hooks & API
import { useTranslations } from '@/components/LanguageProvider'; 
import { useTheme } from '@/hooks/useTheme'; 
import { useAuth } from '@/hooks/useAuth';
import { THEME_OPTION_GROUPS } from '@/config/themeOptions';
import { UserProfile, Document } from '@/api/entities'; 
import { apiClient } from '@/api/apiClient';
import { uploadToKnowledgeBase } from '@/api/functions';

// Novo Layout VS Code
import { VSCodeSettingsLayout } from '@/components/settings';
import MobilePreview from '@/components/desktop/MobilePreview';
import AdminPlansPanel from '@/components/admin/AdminPlansPanel';

// Modais de Importação
import { CSVImportModal, NotionImportModal, AsanaImportModal } from '@/components/importer';

// View de Integrações (Nova)
import IntegrationsSettings from '@/views/settings/IntegrationsSettings';

// --- SUB-COMPONENTE: CÉREBRO DO ASH ---
const AshBrainSettings = ({ settings, onSave, t }) => {
    const [localSettings, setLocalSettings] = useState(settings || {});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { if (settings) setLocalSettings(settings); }, [settings]);
    
    const handleChange = (key, val) => {
        setLocalSettings(prev => ({ ...prev, [key]: val }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(localSettings);
        setIsSaving(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs uppercase opacity-50 tracking-widest font-medium ml-1">{t('main_role')}</label>
                    <Input 
                        placeholder="Ex: Mentor, Arquiteto, Oráculo..." 
                        value={localSettings.role || ''}
                        onChange={e => handleChange('role', e.target.value)}
                        className="bg-black/20 border-white/5 text-white/80 focus:border-white/30 rounded-lg h-10"
                    />
                    <p className="text-[10px] opacity-30 ml-1">{t('main_role_desc')}</p>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase opacity-50 tracking-widest font-medium ml-1">{t('voice_tone')}</label>
                    <Input 
                        placeholder="Ex: Direto, Estóico, Suave..." 
                        value={localSettings.tone || ''}
                        onChange={e => handleChange('tone', e.target.value)}
                        className="bg-black/20 border-white/5 text-white/80 focus:border-white/30 rounded-lg h-10"
                    />
                    <p className="text-[10px] opacity-30 ml-1">{t('voice_tone_desc')}</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase opacity-50 tracking-widest font-medium ml-1">{t('tech_stack')}</label>
                <Input 
                    placeholder="Ferramentas em foco (Ex: React, Obsidian, Jung...)" 
                    value={localSettings.tech_stack || ''}
                    onChange={e => handleChange('tech_stack', e.target.value)}
                    className="bg-black/20 border-white/5 text-white/80 focus:border-white/30 rounded-lg h-10 font-mono text-sm"
                />
                <p className="text-[10px] opacity-30 ml-1">{t('tech_stack_desc')}</p>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase opacity-50 tracking-widest font-medium ml-1">{t('custom_instructions')}</label>
                <textarea 
                    className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm h-32 focus:border-white/30 outline-none resize-none custom-scrollbar text-white/80"
                    placeholder={t('custom_instructions_desc')}
                    value={localSettings.custom_instructions || ''}
                    onChange={e => handleChange('custom_instructions', e.target.value)}
                />
            </div>
            
            <div className="flex justify-end pt-4 border-t border-white/5">
                <Button onClick={handleSave} disabled={isSaving} variant="outline" className="border-white/10 hover:bg-white/10 text-white/70">
                    {isSaving ? <IconFlux className="w-4 h-4 animate-spin mr-2 opacity-50"/> : <IconSave className="w-4 h-4 mr-2 opacity-50"/>}
                    {isSaving ? "Assimilando..." : "Gravar Consciência"}
                </Button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: BASE DE CONHECIMENTO (RAG) ---
const KnowledgeBaseManager = ({ userId }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDocs = async () => {
        setLoading(true);
        try {
            const docs = await Document.list({ tags: 'knowledge-base' }); 
            setDocuments(docs || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if(userId) loadDocs(); }, [userId]);

    const handleUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.md,.json,.csv,.js,.jsx'; 
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                setLoading(true);
                await uploadToKnowledgeBase(file, userId);
                await loadDocs(); 
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        input.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-white/40 leading-relaxed font-light">
                    Pergaminhos listados aqui compõem a memória fixa do sistema.<br/> O Ash os lerá silenciosamente antes de formular respostas.
                </p>
                <Button onClick={handleUpload} size="sm" variant="outline" className="gap-2 border-white/10 hover:bg-white/5 text-white/60 h-8">
                    <IconUpload className="w-3.5 h-3.5" /> Adicionar
                </Button>
            </div>

            <div className="border border-white/5 rounded-xl bg-black/20 min-h-[200px] overflow-hidden flex flex-col shadow-inner">
                <div className="p-3 border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-white/30 flex justify-between">
                    <span>Artefato</span>
                    <span>Status</span>
                </div>
                
                <div className="flex-1 p-2 space-y-1">
                    {loading ? (
                        <div className="p-8 flex items-center justify-center text-xs text-white/30 gap-2">
                            <IconLoader2 className="w-4 h-4 animate-spin"/> Mapeando memórias...
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-10 text-white/20 gap-3">
                            <IconBookOpen className="w-6 h-6 opacity-50" />
                            <span className="text-xs font-serif italic">O cofre está vazio.</span>
                        </div>
                    ) : (
                        documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 group border border-transparent hover:border-white/5 transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <IconFileText className="w-4 h-4 text-white/40" />
                                    <span className="text-sm text-white/70 truncate font-light">{doc.title}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span> Gravado
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/80 p-1.5 rounded-md transition-all">
                                        <IconTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL ---
export default function SettingsPage() {
    const { t, language, setLanguage } = useTranslations(); 
    const { theme, setTheme, animationsEnabled, setAnimationsEnabled } = useTheme(); 
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('general');
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    
    // Import Modals State
    const [csvModalOpen, setCsvModalOpen] = useState(false);
    const [notionModalOpen, setNotionModalOpen] = useState(false);
    const [asanaModalOpen, setAsanaModalOpen] = useState(false);

    // Carrega perfil
    useEffect(() => {
        const loadData = async () => {
            if (!user) { setIsLoadingProfile(false); return; }
            setIsLoadingProfile(true);
            try {
                let profileDataArray = await UserProfile.filter({ user_email: user.email });
                let profileData = profileDataArray[0] || { agent_settings: { astrology_enabled: true, energy_enabled: true } };
                setProfile(profileData);
            } catch (error) { console.error(error); } finally { setIsLoadingProfile(false); }
        };
        loadData();
    }, [user]);

    const handleThemeChange = (option) => {
        const themeId = option.value ?? option.id;
        if (!themeId) return;
        setTheme(themeId);
        toast.success(`Atmosfera assimilada: ${option.label}`);
    };

    const handleAgentSettingChange = async (key, value) => {
        if (!profile) return;
        const updatedSettings = { ...profile.agent_settings, [key]: value };
        setProfile(p => ({ ...p, agent_settings: updatedSettings }));

        try {
            if (profile.id) {
                await UserProfile.update(profile.id, { agent_settings: updatedSettings });
            } else {
                const newProfile = await UserProfile.create({
                    user_email: user.email,
                    agent_settings: updatedSettings
                });
                setProfile(newProfile);
            }
            toast.success("Harmonia registrada.");
        } catch (error) { toast.error("Falha ao registrar fluxo."); }
    };

    const handleBrainSave = async (newBrainSettings) => {
        try {
            await apiClient.put(`/users/${user.id}`, { aiSettings: newBrainSettings });
            toast.success("Estrutura cognitiva atualizada.");
        } catch (e) {
            toast.error("Ruptura na gravação da mente.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const agentSettings = profile?.agent_settings || {};

    if (!user) return null;

    if (showMobilePreview) {
        return <MobilePreview />;
    }

    return (
        <VSCodeSettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            
            {/* === SEÇÃO: GERAL === */}
            {activeSection === 'general' && (
                <div className="space-y-6">
                    {/* Aparência */}
                    <Card className="bg-transparent border-white/5 shadow-none">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 font-serif text-lg text-white/80">
                                <IconVision className="w-4 h-4 text-white/40" /> A Forma
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#121212]">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium flex items-center gap-2 text-white/80">
                                        <IconFlux className="w-3.5 h-3.5 opacity-50" /> {t('animations')}
                                    </label>
                                    <p className="text-xs text-white/40 font-light">{t('animations_desc')}</p>
                                </div>
                                <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} className="data-[state=checked]:bg-white/20 data-[state=unchecked]:bg-black" />
                            </div>

                            <div className="space-y-4 pt-2">
                                <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] ml-1">Atmosferas Locais</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {THEME_OPTION_GROUPS.map((group) => (
                                        <React.Fragment key={group.id}>
                                            {group.options.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleThemeChange(option)}
                                                    className={`
                                                        relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 text-left group
                                                        ${theme === option.value 
                                                            ? 'bg-white/10 border-white/20' 
                                                            : 'bg-[#121212] border-white/5 hover:border-white/10 hover:bg-white/5'}
                                                    `}
                                                >
                                                    <div className="w-5 h-5 rounded-full border border-white/10 shrink-0 shadow-inner" style={option.swatchStyle} />
                                                    <span className={`text-xs font-light tracking-wide ${theme === option.value ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{option.label}</span>
                                                </button>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button variant="ghost" className="text-xs text-white/40 hover:text-white/80 hover:bg-white/5" onClick={() => setShowMobilePreview(true)}>
                                        Testar Lente Mobile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conta e Região */}
                    <Card className="bg-transparent border-white/5 shadow-none mt-8">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 font-serif text-lg text-white/80">
                                <IconCosmos className="w-4 h-4 text-white/40" /> O Observador
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#121212]">
                                <label className="text-sm font-light text-white/70">
                                    {t('system_language')}
                                </label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger className="w-40 bg-black/40 border-white/10 text-white/60 h-9 rounded-lg"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                                        <SelectItem value="pt" className="focus:bg-white/10">Português (BR)</SelectItem>
                                        <SelectItem value="en" className="focus:bg-white/10">English (US)</SelectItem>
                                        <SelectItem value="es" className="focus:bg-white/10">Español</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-[11px] text-white/30 font-mono tracking-widest">{user?.email}</span>
                                <Button variant="ghost" onClick={handleLogout} className="text-white/30 hover:bg-red-500/10 hover:text-red-400 h-8 text-xs transition-colors rounded-lg">
                                    <IconLogOut className="w-3 h-3 mr-2" /> Desconectar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* === SEÇÃO: PLANOS DE ASSINATURA (ADMIN) === */}
            {activeSection === 'plans' && user?.role === 'admin' && (
                <div>
                    <AdminPlansPanel />
                </div>
            )}

            {/* === SEÇÃO: INTELIGÊNCIA === */}
            {activeSection === 'brain' && (
                <Card className="bg-transparent border-white/5 shadow-none">
                    <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3 font-serif text-lg text-white/80">
                            <IconBrainCircuit className="w-4 h-4 text-white/40" /> 
                            Configuração Cognitiva
                        </CardTitle>
                        <CardDescription className="text-xs text-white/40 font-light mt-2">
                            Alinhe os receptores internos e defina os parâmetros de consciência do Ash.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {isLoadingProfile ? (
                            <div className="py-12 flex flex-col items-center gap-3 text-white/30 text-xs font-serif italic">
                                <IconLoader2 className="w-5 h-5 animate-spin opacity-50"/> 
                                Lendo a mente...
                            </div>
                        ) : (
                            <>
                                {/* Configurações Básicas (Energia/Astrologia) */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-[#121212]">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-white/80 flex items-center gap-2"><IconCosmos className="w-3.5 h-3.5 opacity-50" /> Astrologia</label>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Leitura Astral</p>
                                        </div>
                                        <Switch checked={!!agentSettings.astrology_enabled} onCheckedChange={(c) => handleAgentSettingChange('astrology_enabled', c)} className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-black/50" />
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-[#121212]">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-white/80 flex items-center gap-2"><IconZap className="w-3.5 h-3.5 opacity-50" /> Energia</label>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Bio-ritmos</p>
                                        </div>
                                        <Switch checked={!!agentSettings.energy_enabled} onCheckedChange={(c) => handleAgentSettingChange('energy_enabled', c)} className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-black/50"/>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full my-6"/>

                                {/* Configuração Avançada */}
                                <AshBrainSettings 
                                    settings={user?.aiSettings} 
                                    onSave={handleBrainSave} 
                                    t={t}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* === SEÇÃO: CONHECIMENTO === */}
            {activeSection === 'knowledge' && (
                <Card className="bg-transparent border-white/5 shadow-none">
                    <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3 font-serif text-lg text-white/80">
                            <IconBookOpen className="w-4 h-4 text-white/40" /> 
                            Registro Akáshico
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <KnowledgeBaseManager userId={user.id} />
                    </CardContent>
                </Card>
            )}

            {/* === SEÇÃO: IMPORTAÇÃO === */}
            {activeSection === 'migration' && (
                <div className="space-y-8">
                    <div className="pb-4">
                        <h2 className="text-lg font-serif text-white/80">Transmutação de Dados</h2>
                        <p className="text-xs text-white/40 font-light mt-1">Traga matéria do passado para o Prana.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {/* CSV */}
                        <Card className="bg-[#121212] border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-none" onClick={() => setCsvModalOpen(true)}>
                            <CardContent className="pt-8 pb-8">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full border border-white/5 bg-black/40 flex items-center justify-center text-white/30 group-hover:text-white/70 group-hover:bg-white/5 transition-all">
                                        <IconFileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm text-white/80 group-hover:text-white transition-colors">CSV</h3>
                                        <p className="text-[10px] text-white/40 mt-1 tracking-widest uppercase">Estrutura Bruta</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notion */}
                        <Card className="bg-[#121212] border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-none" onClick={() => setNotionModalOpen(true)}>
                            <CardContent className="pt-8 pb-8">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full border border-white/5 bg-black/40 flex items-center justify-center text-white/30 group-hover:text-white/70 group-hover:bg-white/5 transition-all">
                                        <IconGitBranch className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm text-white/80 group-hover:text-white transition-colors">Notion</h3>
                                        <p className="text-[10px] text-white/40 mt-1 tracking-widest uppercase">Páginas Dinâmicas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Asana */}
                        <Card className="bg-[#121212] border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group shadow-none" onClick={() => setAsanaModalOpen(true)}>
                            <CardContent className="pt-8 pb-8">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full border border-white/5 bg-black/40 flex items-center justify-center text-white/30 group-hover:text-white/70 group-hover:bg-white/5 transition-all">
                                        <IconCheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm text-white/80 group-hover:text-white transition-colors">Asana</h3>
                                        <p className="text-[10px] text-white/40 mt-1 tracking-widest uppercase">Mapeamento de Tarefas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Histórico */}
                    <div className="pt-6">
                        <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-4">Registro de Transmutações</h3>
                        <div className="p-4 rounded-xl bg-[#121212] border border-white/5 flex items-center gap-4 text-white/30">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <span className="text-xs font-serif italic">Nenhum rastro encontrado no éter.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* === SEÇÃO: INTEGRAÇÕES (NOVO) === */}
            {activeSection === 'integrations' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <IntegrationsSettings />
                </div>
            )}

            {/* Modais de Importação */}
            <CSVImportModal 
                isOpen={csvModalOpen}
                onClose={() => setCsvModalOpen(false)}
                projectId={null}
                onImportComplete={() => toast.success("Matéria incorporada.")}
            />
            <NotionImportModal 
                isOpen={notionModalOpen}
                onClose={() => setNotionModalOpen(false)}
                onImportComplete={() => toast.success("Mundo paralelo sincronizado.")}
            />
            <AsanaImportModal 
                isOpen={asanaModalOpen}
                onClose={() => setAsanaModalOpen(false)}
                onImportComplete={() => toast.success("Fluxos realocados.")}
            />
        </VSCodeSettingsLayout>
    );
}