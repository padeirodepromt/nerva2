/* src/components/dashboard/UpcomingEventsCard.jsx
   desc: Card com eventos dos próximos 7 dias - Identidade Prana
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconClock, IconCosmos } from '@/components/icons/PranaLandscapeIcons';
import { useAuth } from '@/hooks/useAuth';

export default function UpcomingEventsCard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return;
      
      try {
        const today = new Date();
        const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const response = await fetch(
          `/api/calendar/events?startDate=${today.toISOString().split('T')[0]}&endDate=${in7Days.toISOString().split('T')[0]}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass-pure p-8 relative overflow-hidden"
    >
      {/* Textura de Papel Sutil */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Header */}
      <div className="space-y-2 mb-6 border-b border-white/5 pb-6 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--accent-rgb))] flex items-center gap-2">
          <IconCosmos className="w-4 h-4" /> Próximos Eventos
        </h3>
        <p className="text-sm text-muted-foreground">
          {events.length === 0 ? 'Nenhum evento nos próximos 7 dias' : `${events.length} evento(s) planejado(s)`}
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-3 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-24 opacity-40">
            <div className="animate-spin">
              <IconClock className="w-6 h-6" />
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 opacity-50">
            <IconCosmos className="w-12 h-12 mb-3 text-muted-foreground/50" />
            <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground/60">
              Calendário livre
            </p>
          </div>
        ) : (
          events.slice(0, 5).map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors shrink-0">
                <span className="text-[10px] font-bold uppercase text-[rgb(var(--accent-rgb))] leading-tight">
                  {new Date(event.date).getDate()}
                </span>
                <span className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">
                  {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
              </div>

              <div className="flex-1 min-w-0 py-1">
                <h4 className="font-medium text-sm text-foreground/90 group-hover:text-[rgb(var(--accent-rgb))] transition-colors truncate">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-[11px] text-muted-foreground/60 line-clamp-1 mt-1">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="text-[10px] text-muted-foreground/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {formatDate(event.date)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer: Total count if more than 5 */}
      {events.length > 5 && (
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-medium">
            +{events.length - 5} evento(s) adicional(is)
          </p>
        </div>
      )}
    </motion.div>
  );
}
