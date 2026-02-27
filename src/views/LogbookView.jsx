/* canvas: src/views/LogbookView.jsx
   desc: O Espelho da Alma (Logbook V3.1). Correção de Ícones para integridade.
   fix: IconCheckCircle -> IconDone (PranaIcons.Done)
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

// Hooks & API
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
import { EnergyState, Astral, Task } from '@/api/entities';

// Componentes UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import PranaLoader from '@/components/PranaLoader';
import ViewHeader from '@/components/ViewHeader';

// Ícones Corrigidos
import { 
    PranaIcons, IconZap, IconCosmos, IconDiario, IconSun, IconLua, IconDone
} from '@/components/icons/PranaLandscapeIcons';

// === SUB-COMPONENTES ===

const EnergyChart = ({ history }) => {
    const height = 60; const width = 300;
    const dataPoints = history.length > 1 ? history : [{level: 5}, {level: 5}];
    const points = dataPoints.map((entry, i) => {
        const x = (i / (dataPoints.length - 1)) * width;
        const y = height - ((entry.level / 10) * height);
        return `${x},${y}`;
    }).join(' ');
    return (
        <div className="w-full h-[80px] flex items-end gap-1">
             <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height + 20}`} className="overflow-visible">
                 <polyline points={points} fill="none" stroke="rgb(var(--accent-rgb))" strokeWidth="2" className="drop-shadow-md" />
                 {history.map((entry, i) => {
                     const x = (i / (history.length - 1)) * width;
                     const y = height - ((entry.level / 10) * height);
                     return ( <g key={i} className="group"><circle cx={x} cy={y} r="3" className="fill-background stroke-primary stroke-2" /></g> );
                 })}
             </svg>
        </div>
    );
};

const AstralCard = ({ data }) => {
    if (!data) return <div className="glass-effect p-4 rounded-xl border border-white/10 opacity-50 text-xs">Sem dados astrais.</div>;
    return (
        <div className="glass-effect p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20"><IconCosmos className="w-16 h-16 text-indigo-400" /></div>
            <h3 className="text-sm font-serif font-bold text-indigo-300 mb-1 flex items-center gap-2"><PranaIcons.Star className="w-4 h-4" /> Clima Astral</h3>
            <p className="text-xs text-muted-foreground relative z-10">{data.summary || `Lua em ${data.moon_sign || 'Trânsito'}.`}</p>
        </div>
    );
};

const DailyAchievements = ({ tasks }) => (
    <div className="bg-black/20 rounded-xl border border-white/5 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
            <IconDone className="w-4 h-4 text-emerald-500" /> Conquistas de Hoje
        </h4>
        {tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Nenhuma tarefa concluída ainda.</p>
        ) : (
            <ul className="space-y-2">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="line-through opacity-70 decoration-white/20">{task.name}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default function LogbookView() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('checkin');
    
    const [energyLevel, setEnergyLevel] = useState([5]);
    const [sleepQuality, setSleepQuality] = useState([7]); 
    const [mood, setMood] = useState('');
    const [intention, setIntention] = useState('');
    const [reflection, setReflection] = useState('');
    
    const [energyHistory, setEnergyHistory] = useState([]);
    const [todaysLog, setTodaysLog] = useState(null);
    const [astralData, setAstralData] = useState(null);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const logs = await EnergyState.filter({ user_email: user.email, _sort: '-date', _limit: 7 });
                setEnergyHistory(logs.reverse());

                const today = new Date();
                const todayLog = logs.find(l => isSameDay(new Date(l.date), today));
                if (todayLog) {
                    setTodaysLog(todayLog);
                    setEnergyLevel([todayLog.level]);
                    setSleepQuality([todayLog.sleep_quality || 7]);
                    setMood(todayLog.mood || '');
                    setIntention(todayLog.intention || '');
                    setActiveTab(todayLog.checkout_time ? 'history' : 'checkout');
                }

                try { const astral = await Astral.getToday(); setAstralData(astral); } catch (e) {}

                const doneTasks = await Task.filter({ status: 'concluido' }); 
                const todayDone = doneTasks.filter(t => new Date(t.updated_at || t.created_at) >= startOfDay(today));
                setCompletedTasks(todayDone);

            } catch (error) { console.error(error); } 
            finally { setIsLoading(false); }
        };
        loadData();
    }, [user]);

    const handleSaveCheckIn = async () => {
        try {
            const payload = {
                date: new Date().toISOString(),
                level: energyLevel[0],
                sleep_quality: sleepQuality[0],
                mood,
                intention,
                user_email: user.email,
                type: 'check_in'
            };
            const newLog = await EnergyState.create(payload);
            setTodaysLog(newLog);
            toast.success("Sankalpa definido.");
            setActiveTab('checkout'); 
        } catch (e) { toast.error("Erro ao iniciar dia."); }
    };

    const handleSaveCheckOut = async () => {
        if (!todaysLog) return;
        try {
            await EnergyState.update(todaysLog.id, {
                reflection,
                checkout_time: new Date().toISOString(),
                final_energy_level: energyLevel[0] 
            });
            toast.success("Ciclo encerrado.");
            setActiveTab('history');
        } catch (e) { toast.error("Erro ao encerrar dia."); }
    };

    if (isLoading) return <PranaLoader text="Acessando registros..." />;

    return (
        <div className="h-full w-full flex flex-col gap-6 overflow-y-auto prana-scrollbar">
            <ViewHeader 
                icon={IconDiario}
                title="Diário de Bordo"
                subtitle="Calibração Energética"
                className="px-4 pt-4"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 px-4">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <Card className="glass-effect border-border/30">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bateria Vital</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between mb-4">
                                <span className="text-4xl font-serif font-bold text-primary">{energyLevel[0]}<span className="text-lg text-muted-foreground font-sans">/10</span></span>
                                <span className="text-xs text-muted-foreground mb-1">Tendência: {energyHistory.length > 0 ? 'Estável' : '-'}</span>
                            </div>
                            <div className="p-2 bg-black/20 rounded-lg border border-white/5"><EnergyChart history={energyHistory} /></div>
                        </CardContent>
                    </Card>
                    <AstralCard data={astralData} />
                </div>

                <div className="lg:col-span-2">
                    <Card className="glass-effect border-border/30 h-full flex flex-col">
                        <CardHeader className="border-b border-white/5 pb-0">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="bg-transparent p-0 gap-6">
                                    <TabsTrigger value="checkin" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-muted-foreground data-[state=active]:text-primary"><IconSun className="w-4 h-4 mr-2" /> Iniciar Dia</TabsTrigger>
                                    <TabsTrigger value="checkout" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-0 pb-2 text-muted-foreground data-[state=active]:text-purple-500"><IconLua className="w-4 h-4 mr-2" /> Encerrar Dia</TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-2 text-muted-foreground data-[state=active]:text-blue-500"><PranaIcons.Layers className="w-4 h-4 mr-2" /> Histórico</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardHeader>
                        
                        <CardContent className="flex-1 p-6 overflow-y-auto">
                            {activeTab === 'checkin' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-lg mx-auto">
                                    {todaysLog ? (
                                        <div className="text-center py-10">
                                            {/* Ícone Corrigido */}
                                            <IconDone className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                            <p>Check-in realizado.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Energia Física</label>
                                                    <div className="flex items-center gap-3">
                                                        <IconZap className="w-4 h-4 text-muted-foreground" />
                                                        <Slider value={energyLevel} onValueChange={setEnergyLevel} max={10} step={1} className="flex-1" />
                                                        <span className="font-mono w-6">{energyLevel[0]}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Sono (Qualidade)</label>
                                                    <div className="flex items-center gap-3">
                                                        <IconLua className="w-4 h-4 text-muted-foreground" />
                                                        <Slider value={sleepQuality} onValueChange={setSleepQuality} max={10} step={1} className="flex-1" />
                                                        <span className="font-mono w-6">{sleepQuality[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 pt-2">
                                                <label className="text-sm font-medium text-primary">Sankalpa (Sua Intenção)</label>
                                                <Textarea value={intention} onChange={(e) => setIntention(e.target.value)} className="bg-black/20 border-white/10 h-24 resize-none" />
                                            </div>
                                            <Button onClick={handleSaveCheckIn} className="w-full bg-primary text-white h-12"><IconSun className="w-5 h-5 mr-2" /> Registrar</Button>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'checkout' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-lg mx-auto">
                                    {/* Lista de Conquistas Integrada */}
                                    <DailyAchievements tasks={completedTasks} />

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Reflexão</label>
                                        <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)} className="bg-black/20 border-white/10 h-32" />
                                    </div>
                                    <Button onClick={handleSaveCheckOut} className="w-full bg-purple-600 text-white">Encerrar Ciclo</Button>
                                </motion.div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    {energyHistory.map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-mono font-bold text-primary text-xs">{log.level}</div>
                                                <span className="text-sm font-medium">{format(new Date(log.date), "dd/MM")}</span>
                                            </div>
                                            {log.checkout_time ? <IconDone className="w-4 h-4 text-emerald-500" /> : <span className="text-[10px] opacity-50">Aberto</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}