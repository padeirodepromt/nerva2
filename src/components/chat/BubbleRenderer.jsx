import React from 'react';
import { 
  TaskListBubble, 
  QuickActionBubble, 
  CalendarBubble, 
  FormBubble 
} from './bubbles';

/**
 * BubbleRenderer - DESKTOP VERSION
 * Renderiza automaticamente o tipo correto de bubble
 * Baseado no tipo de conteúdo da mensagem Ash
 * 
 * ⚠️ NOTA: Tool Calls são MOBILE-ONLY
 * Para Mobile, use MobileChat com chatServiceTestInjector
 * 
 * Tipos suportados (Desktop):
 * - task_list: TaskListBubble
 * - actions: QuickActionBubble
 * - calendar: CalendarBubble
 * - form: FormBubble
 */
export default function BubbleRenderer({ message, onInteraction }) {
  if (!message) return null;

  const { type, content, data } = message;

  switch (type) {
    case 'task_list':
      return (
        <TaskListBubble
          tasks={data?.tasks || []}
          maxItems={data?.maxItems || 5}
          onTaskSelect={(task) => onInteraction?.('task_selected', task)}
          onCreateTask={() => onInteraction?.('create_task', {})}
        />
      );

    case 'actions':
      return (
        <QuickActionBubble
          actions={data?.actions || []}
          onActionComplete={(result) => onInteraction?.('action_completed', result)}
        />
      );

    case 'calendar':
      return (
        <CalendarBubble
          month={data?.month}
          year={data?.year}
          onSelectDate={(date) => onInteraction?.('date_selected', { date })}
        />
      );

    case 'form':
      return (
        <FormBubble
          title={data?.title}
          fields={data?.fields || []}
          submitLabel={data?.submitLabel}
          isLoading={data?.isLoading}
          onSubmit={(formData) => onInteraction?.('form_submitted', formData)}
        />
      );

    case 'metrics':
      return (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-sm font-semibold mb-3">📊 Métricas</div>
          <div className="space-y-2 text-xs">
            {Object.entries(data?.metrics || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="opacity-60">{key}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-sm font-semibold mb-3">⏱️ Timeline</div>
          <div className="space-y-2">
            {data?.events?.map((event, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <span className="opacity-50">{event.time}</span>
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
