/* src/views/TeamsView.jsx
   desc: Centro de Comando de Equipes (Team Pulse).
   feat: Híbrido - Visual do Team Pulse + Lógica de Dados Reais da V2.0.
*/
import React, { useState, useEffect } from 'react';
import { 
    IconUsers, IconPlus, IconZap, IconSettings, 
    IconCrown, IconActivity, IconMessageSquare, IconDashboard,
    IconMail, IconShield, IconTrash
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import PranaLoader from '@/components/PranaLoader';

// Integrações do Sistema
import { calculateTeamSynergy, getTeamInsights } from '@/utils/teamAnalytics';
import ProjectChat from '@/components/chat/ProjectChat'; 
import { Team, User } from '@/api/entities'; // Usando suas entidades reais

// Dados de fallback para quando a API falhar ou estiver vazia
const DEFAULT_TEAM = { id: 'default', name: "Círculo Principal", description: "Núcleo Operacional", members: [] };

export default function TeamsView() {
    // Estado de Dados
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estado de UI
    const [activeTab, setActiveTab] = useState('overview');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');

    // --- CARREGAMENTO DE DADOS (Lógica da V2.0) ---
    const loadTeamData = async () => {
        setLoading(true);
        try {
            // Timeout de proteção
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));

            const [teamsList, currentUser] = await Promise.race([
                Promise.all([
                    Team.list().catch(e => []),
                    User.me().catch(e => ({ id: '1', name: 'Você', email: 'user@prana.app', avatarUrl: null }))
                ]),
                timeoutPromise
            ]).catch(() => [[], { id: '1', name: 'Você' }]);

            // Se não houver times, cria o default na memória
            const finalTeams = teamsList.length > 0 ? teamsList : [DEFAULT_TEAM];
            setTeams(finalTeams);
            
            // Seleciona o primeiro time se nenhum estiver selecionado
            if (!selectedTeamId) setSelectedTeamId(finalTeams[0].id);

            // Carrega membros (Mockado com dados do usuário real + bots para preencher)
            // Num sistema real, faríamos Team.getMembers(selectedTeamId)
            const mockMembers = [
                { 
                    id: currentUser.id || '1', 
                    name: currentUser.name || 'Você', 
                    email: currentUser.email, 
                    role: 'admin', 
                    energy_level: 85, // Simulação de dado que viria do Check-In
                    status: 'online', 
                    avatarUrl: currentUser.avatarUrl 
                },
                { id: '2', name: 'Ash (IA)', role: 'bot', energy_level: 100, status: 'online', avatarUrl: null },
                { id: '3', name: 'Designer Convidado', role: 'member', energy_level: 60, status: 'offline', avatarUrl: null }
            ];
            setMembers(mockMembers);

        } catch (e) {
            console.error("Erro ao carregar dados:", e);
            toast.error("Usando modo offline para equipes.");
            setTeams([DEFAULT_TEAM]);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTeamData(); }, []);

    // Atualiza membros ao mudar de time (Mockado por enquanto)
    useEffect(() => {
        if (selectedTeamId === 'default') {
            // Recarrega membros padrão
        }
    }, [selectedTeamId]);

    // --- CÁLCULOS ---
    const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0] || DEFAULT_TEAM;
    const synergy = calculateTeamSynergy(members);
    const insight = getTeamInsights(synergy);

    // --- ACTIONS ---
    const handleInvite = () => {
        if (!inviteEmail) return;
        toast.success(`Convite enviado para ${inviteEmail}`);
        setIsInviteOpen(false);
        setInviteEmail('');
    };

    if (loading) return <PranaLoader text="Sincronizando frequências..." />;

    return (
        <div className="flex h-full bg-[#09090b] text-white overflow-hidden">
            
            {/* 1. SIDEBAR (Lista de Times) */}
            <div className="w-64 border-r border-white/10 flex flex-col bg-[#0c0c0e]">
                <div className="p-4 h-14 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <IconUsers className="w-4 h-4" /> Esquadrões
                    </h2>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => setIsInviteOpen(true)}>
                        <IconPlus className="w-3.5 h-3.5" />
                    </Button>
                </div>
                <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {teams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all group ${selectedTeamId === team.id ? 'bg-white/5 border-white/10' : 'border-transparent hover:bg-white/5'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-medium ${selectedTeamId === team.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{team.name}</span>
                                {selectedTeamId === team.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                <IconUsers className="w-3 h-3" /> {members.length} membros
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
                
                {/* Header Contextual */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#09090b]">
                    <div className="flex items-center gap-3">
                        <h1 className="text-base font-bold text-white">{activeTeam.name}</h1>
                        <Badge variant="outline" className="text-[10px] h-5 border-white/10 text-gray-400 font-normal">
                            {activeTeam.description || 'Equipe Prana'}
                        </Badge>
                    </div>

                    {/* Controles de Aba */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-8">
                        <TabsList className="bg-white/5 border border-white/5 h-full p-0.5">
                            <TabsTrigger value="overview" className="text-xs h-7 px-3 gap-2 data-[state=active]:bg-white/10">
                                <IconDashboard className="w-3.5 h-3.5" /> Pulso
                            </TabsTrigger>
                            <TabsTrigger value="chat" className="text-xs h-7 px-3 gap-2 data-[state=active]:bg-white/10">
                                <IconMessageSquare className="w-3.5 h-3.5" /> Chat
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-hidden relative">
                    
                    {/* VIEW: PULSO (Overview) */}
                    {activeTab === 'overview' && (
                        <div className="p-6 h-full overflow-y-auto space-y-6 animate-in fade-in duration-300">
                            
                            {/* Card de Energia Principal */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border-white/10 lg:col-span-2 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <IconActivity className="w-4 h-4 text-indigo-400" /> Sinergia da Equipe
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-end gap-3 mb-4">
                                            <span className="text-5xl font-bold text-white tracking-tighter">{synergy.synergyScore}</span>
                                            <div className="mb-1.5 flex flex-col">
                                                <span className={`text-sm font-medium ${synergy.color}`}>{synergy.label}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">Potencial Atual</span>
                                            </div>
                                        </div>
                                        
                                        <Progress value={synergy.synergyScore} className="h-1.5 bg-black/40 mb-4" indicatorClassName={`bg-gradient-to-r ${synergy.synergyScore > 70 ? 'from-indigo-500 to-purple-500' : 'from-yellow-600 to-yellow-400'}`} />
                                        
                                        <div className="bg-black/20 border border-white/5 rounded p-3 flex gap-3 items-start">
                                            <div className="mt-0.5 text-lg">💡</div>
                                            <p className="text-xs text-gray-300 leading-relaxed italic">"{insight}"</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Mini Stats */}
                                <div className="space-y-4">
                                    <Card className="bg-white/5 border-white/10">
                                        <CardHeader className="pb-2 pt-4"><CardTitle className="text-xs text-gray-400 uppercase">Média de Energia</CardTitle></CardHeader>
                                        <CardContent>
                                            <span className="text-2xl font-bold text-white">{synergy.avgEnergy}%</span>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white/5 border-white/10">
                                        <CardHeader className="pb-2 pt-4"><CardTitle className="text-xs text-gray-400 uppercase">Coerência (Desvio)</CardTitle></CardHeader>
                                        <CardContent>
                                            <span className={`text-2xl font-bold ${synergy.stdDev < 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {Math.round(synergy.stdDev)} <span className="text-xs text-gray-500 font-normal">pts</span>
                                            </span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Lista de Membros */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Membros Ativos</h3>
                                    <span className="text-[10px] text-gray-600">{members.length} Total</span>
                                </div>
                                <div className="space-y-2">
                                    {members.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/5 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar className="h-9 w-9 border border-white/10 bg-black/20">
                                                        <AvatarImage src={member.avatarUrl} />
                                                        <AvatarFallback className="text-xs text-gray-300">{member.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#09090b] ${member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-200">{member.name}</span>
                                                        {member.role === 'admin' && <IconCrown className="w-3 h-3 text-yellow-500" />}
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{member.role}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Indicador de Energia */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-end gap-1 w-20">
                                                    <span className={`text-[10px] font-mono ${member.energy_level > 70 ? 'text-green-400' : member.energy_level < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                                                        {member.energy_level}%
                                                    </span>
                                                    <Progress value={member.energy_level} className="h-1 bg-white/10" />
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                                    <IconTrash className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: CHAT (Integrado) */}
                    {activeTab === 'chat' && (
                        <div className="h-full flex flex-col bg-[#0c0c0e]">
                            <ProjectChat 
                                contextId={activeTeam.id} 
                                contextTitle={activeTeam.name}
                                className="flex-1 border-none"
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Modal de Convite */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-[#1e1e1e] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-serif text-xl">
                            <IconMail className="w-5 h-5 text-indigo-400" /> Convidar Guardião
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase opacity-70 font-bold tracking-wide">E-mail do Colaborador</label>
                            <Input 
                                placeholder="colega@prana.app" 
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="bg-black/20 border-white/10 focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase opacity-70 font-bold tracking-wide">Permissão de Acesso</label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="member">Membro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsInviteOpen(false)} className="hover:bg-white/5">Cancelar</Button>
                        <Button onClick={handleInvite} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enviar Convite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}