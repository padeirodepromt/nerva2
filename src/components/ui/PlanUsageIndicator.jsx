import React from 'react';
import { useCredits } from '@/hooks/usePermission';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { IconZap, IconCrown } from '@/components/icons/PranaLandscapeIcons';

export const PlanUsageIndicator = ({ compact = false }) => {
    const { used, limit, percentage, status, planName } = useCredits();

    if (limit === Infinity) return null; // Não mostra para Enterprise/Ilimitado

    if (compact) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-2 group cursor-help" title={`Plano ${planName}: ${used}/${limit} créditos`}>
                 <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <path
                            className="text-white/10"
                            strokeDasharray="100, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        {/* Progress Circle */}
                        <path
                            className={`${status === 'danger' ? 'text-red-500' : status === 'warning' ? 'text-yellow-500' : 'text-indigo-500'} transition-all duration-1000 ease-out`}
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    <IconZap className={`absolute w-3 h-3 ${status === 'danger' ? 'text-red-400' : 'text-gray-400'} group-hover:text-white transition-colors`} />
                 </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                    Plano {planName}
                </span>
                <span className={`text-[10px] font-bold ${status === 'danger' ? 'text-red-400' : 'text-gray-300'}`}>
                    {used}/{limit}
                </span>
            </div>
            
            <Progress 
                value={percentage} 
                className="h-1 bg-white/10 mb-3" 
                indicatorClassName={`transition-all duration-500 ${
                    status === 'danger' ? 'bg-red-500' : 
                    status === 'warning' ? 'bg-yellow-500' : 
                    'bg-indigo-500'
                }`} 
            />
            
            {status === 'danger' ? (
                <Button size="sm" variant="destructive" className="w-full h-7 text-xs gap-2">
                    <IconCrown className="w-3 h-3" /> Esgotado - Upgrade
                </Button>
            ) : (
                <Button size="sm" variant="ghost" className="w-full h-7 text-xs text-gray-400 hover:text-white hover:bg-white/5 gap-2 group">
                    <IconZap className="w-3 h-3 group-hover:text-yellow-400 transition-colors" /> 
                    {limit - used} créditos restantes
                </Button>
            )}
        </div>
    );
};
