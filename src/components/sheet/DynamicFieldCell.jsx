/* src/components/sheet/DynamicFieldCell.jsx
   desc: Célula Inteligente V10.1 (Bio-Digital + Multiverse).
   feat: Integração completa de Sankalpa com Poda Radical e Preservação de Componentes V8.
*/
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useSankalpas } from '@/hooks/useSankalpas'; // Hook vital para o V10
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    IconCheck, IconStar, IconChevronDown, 
    IconZap, IconBrainCircuit, IconColetivo, IconSettings, IconVision,
    IconTarget, IconBox // [V10] Ícones para Sankalpa
} from '@/components/icons/PranaLandscapeIcons';
import { useFieldValidation } from '@/hooks/useFieldValidation';

// --- CONFIGURAÇÃO BIO-DIGITAL (V8.3) ---

const ENERGY_CONFIG = {
  1: { color: 'text-emerald-500', label: 'Automático' },
  2: { color: 'text-teal-400',    label: 'Leve' },
  3: { color: 'text-yellow-400',  label: 'Moderado' },
  4: { color: 'text-orange-400',  label: 'Intenso' },
  5: { color: 'text-red-400',     label: 'Drenante' },
};

const ARCHETYPE_CONFIG = {
  cognitive: { icon: IconBrainCircuit, color: 'text-blue-400', label: 'Foco' },
  social:    { icon: IconColetivo,     color: 'text-orange-400', label: 'Social' },
  routine:   { icon: IconSettings,     color: 'text-slate-400', label: 'Rotina' },
  creative:  { icon: IconVision,       color: 'text-purple-400', label: 'Criação' },
};

/**
 * DynamicFieldCell Master Component
 */
export const DynamicFieldCell = ({ 
  item, 
  field, 
  value, 
  onUpdate, 
  members = [],
  placeholder,
  showError = true,
  onValidate = null
}) => {
  const validation = useFieldValidation(field);

  const handleSave = (newValue) => {
    if (newValue === value) return;
    const isValid = validation.validate(newValue);
    if (onValidate) onValidate({ isValid, error: validation.error });
    if (!isValid && newValue !== '') return; 

    const payload = field.fixed 
        ? { [field.key]: newValue }
        : { properties: { [field.key]: newValue } };

    if (onUpdate && item?.id) {
        onUpdate(item.id, payload);
    }
  };

  const commonProps = {
    value,
    onBlur: handleSave,
    placeholder: placeholder || field.label,
    field,
    validation: showError ? validation : null,
    isRequired: field.is_required
  };

  switch (field.type) {
    case 'energy': return <EnergyFieldCell {...commonProps} />;
    case 'archetype': 
    case 'task_type': return <ArchetypeFieldCell {...commonProps} />;
    case 'sankalpa': return <SankalpaFieldCell {...commonProps} />; // [V10] Injetado
    case 'text':
    case 'url': return <TextFieldCell {...commonProps} />;
    case 'number': return <NumberFieldCell {...commonProps} />;
    case 'rating': return <RatingFieldCell {...commonProps} />;
    case 'select':
    case 'dropdown':
    case 'status':
      return (
        <DropdownFieldCell 
            {...commonProps} 
            options={field.options || (field.type === 'status' ? ['todo', 'doing', 'done'] : [])} 
        />
      );
    case 'date': return <DateFieldCell {...commonProps} />;
    case 'member': return <MemberFieldCell {...commonProps} members={members} />;
    case 'checkbox': return <CheckboxFieldCell {...commonProps} />;
    default: return <TextFieldCell {...commonProps} />;
  }
};

// --- [V10] NOVO COMPONENTE: SELETOR DE SANKALPA (PODA RADICAL) ---
const SankalpaFieldCell = ({ value, onBlur }) => {
    const { sankalpas, loading } = useSankalpas();
    const activeSankalpa = sankalpas.find(s => s.id === value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-full px-3 flex items-center outline-none hover:bg-white/5 rounded transition-colors group">
                {activeSankalpa ? (
                    <div className="flex items-center gap-2 text-indigo-400">
                        <IconTarget className="w-3 h-3" />
                        <span className="text-[11px] font-bold truncate max-w-[120px]">{activeSankalpa.title}</span>
                    </div>
                ) : (
                    <span className="text-[10px] text-muted-foreground/30 group-hover:text-muted-foreground italic">Propósito?</span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0c0a09] border-white/10 min-w-[220px] shadow-2xl z-50">
                {loading ? (
                    <div className="p-4 text-center"><IconZap className="w-4 h-4 animate-spin mx-auto opacity-20 text-indigo-500" /></div>
                ) : sankalpas.length === 0 ? (
                    <div className="p-6 text-center space-y-2 opacity-40">
                        <IconBox className="w-6 h-6 mx-auto" />
                        <p className="text-[10px] uppercase font-black tracking-widest leading-tight">Nenhuma Meta<br/>neste Universo</p>
                    </div>
                ) : (
                    sankalpas.map(s => (
                        <DropdownMenuItem 
                            key={s.id} 
                            onClick={() => onBlur(s.id)}
                            className="flex flex-col items-start gap-0.5 cursor-pointer py-2.5 px-3 hover:bg-white/5 focus:bg-white/10"
                        >
                            <span className="text-xs font-bold text-indigo-100">{s.title}</span>
                            <span className="text-[9px] opacity-40 line-clamp-1 italic">{s.description || 'Manifestação sem briefing'}</span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// --- SUB-COMPONENTES BIO-DIGITAL (V8.3) ---

const EnergyFieldCell = ({ value, onBlur }) => (
    <DropdownMenu>
        <DropdownMenuTrigger className="w-full h-full px-2 flex items-center outline-none hover:bg-white/5 rounded transition-colors group">
            {value ? (
                <div className={cn("flex items-center gap-1", ENERGY_CONFIG[value]?.color || 'text-muted-foreground')}>
                    <div className="flex gap-0.5">
                        {[...Array(value > 3 ? 3 : (value > 1 ? 2 : 1))].map((_, i) => (
                            <IconZap key={i} className="w-3 h-3 fill-current" />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold ml-1">{value}</span>
                </div>
            ) : <span className="text-[10px] text-muted-foreground/30 group-hover:text-muted-foreground">Energia?</span>}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-white/10 min-w-[140px]">
            {[1, 2, 3, 4, 5].map((level) => (
                <DropdownMenuItem key={level} onClick={() => onBlur(level)} className="flex items-center justify-between text-xs cursor-pointer hover:bg-white/10">
                    <span className={cn("font-medium", ENERGY_CONFIG[level].color)}>{ENERGY_CONFIG[level].label}</span>
                    <div className="flex gap-0.5">
                        {[...Array(level > 3 ? 3 : (level > 1 ? 2 : 1))].map((_, i) => (
                            <IconZap key={i} className={cn("w-3 h-3", ENERGY_CONFIG[level].color, "fill-current")} />
                        ))}
                    </div>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);

const ArchetypeFieldCell = ({ value, onBlur }) => {
    const active = ARCHETYPE_CONFIG[value];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-full px-2 flex items-center outline-none hover:bg-white/5 rounded transition-colors group">
                {active ? (
                    <div className={cn("flex items-center gap-2", active.color)}>
                        <active.icon className="w-3.5 h-3.5" />
                        <span className="text-xs">{active.label}</span>
                    </div>
                ) : <span className="text-[10px] text-muted-foreground/30 group-hover:text-muted-foreground">Tipo?</span>}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-white/10 min-w-[140px]">
                {Object.entries(ARCHETYPE_CONFIG).map(([key, config]) => (
                    <DropdownMenuItem key={key} onClick={() => onBlur(key)} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10">
                        <div className={cn("p-1 rounded bg-white/5", config.color)}><config.icon className="w-3 h-3" /></div>
                        <span>{config.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// --- SUB-COMPONENTES STANDARD (V8.2 + Otimizações) ---

export const TextFieldCell = ({ value, onBlur, placeholder, validation, isRequired }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const hasError = validation && validation.error;
  useEffect(() => { setLocalValue(value || ''); }, [value]);

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <div className="flex items-center gap-1.5 h-full">
        <input
          className={cn(
            "w-full h-full bg-transparent px-3 py-1.5 outline-none text-xs text-zinc-300 transition-all truncate placeholder:text-muted-foreground/20 rounded-md",
            "hover:bg-white/5 focus:bg-white/10 focus:ring-0",
            hasError && "text-red-400 focus:bg-red-500/10"
          )}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => localValue !== value && onBlur(localValue)}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          placeholder={placeholder || '-'}
        />
        {isRequired && !localValue && (
          <span className="text-red-500 text-[10px] font-bold mr-1 absolute right-0">*</span>
        )}
      </div>
      {hasError && validation && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-red-900/90 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
          {validation.error}
        </div>
      )}
    </div>
  );
};

export const NumberFieldCell = ({ value, onBlur, placeholder, min, max, validation }) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const hasError = validation && validation.error;
  useEffect(() => { setLocalValue(value ?? ''); }, [value]);

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
        <input
        type="number"
        className={cn(
            "w-full h-full bg-transparent px-3 py-1.5 outline-none text-xs text-foreground/90 font-mono transition-all rounded-md",
            "hover:bg-white/5 focus:bg-white/10",
            hasError && "text-red-400 focus:bg-red-500/10"
        )}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => {
            const num = localValue === '' ? null : Number(localValue);
            if (num !== value) onBlur(num);
        }}
        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
        placeholder={placeholder || '0'}
        min={min} max={max}
        />
    </div>
  );
};

export const RatingFieldCell = ({ value, onBlur }) => {
    const currentRating = Number(value) || 0;
    return (
        <div className="w-full h-full px-3 flex items-center gap-1 group">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onBlur(star)}
                    className="focus:outline-none transition-transform active:scale-90"
                >
                    <IconStar 
                        className={cn(
                            "w-3 h-3 transition-colors",
                            currentRating >= star 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-white/10 group-hover:text-white/20 hover:!text-amber-400"
                        )} 
                    />
                </button>
            ))}
        </div>
    );
};

export const DropdownFieldCell = ({ value, options = [], onBlur, placeholder, validation }) => {
  const hasError = validation && validation.error;
  const getLabel = (val) => {
      if(!val) return placeholder || '-';
      const map = { 'todo': 'A Fazer', 'doing': 'Fazendo', 'done': 'Feito' };
      return map[val] || val;
  };

  return (
    <div className="w-full h-full relative">
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
            "w-full h-full px-3 py-1.5 flex items-center justify-between outline-none group hover:bg-white/5 transition-colors text-left rounded-md",
            hasError && "bg-red-500/10 text-red-400"
        )}>
          <span className="text-xs text-foreground/80 truncate">
            {getLabel(value)}
          </span>
          <IconChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-white/10 min-w-[140px]">
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground opacity-50">Vazio</div>
          ) : (
            options.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onBlur(option)}
                className="text-xs cursor-pointer hover:bg-white/10 flex justify-between"
              >
                <span>{getLabel(option)}</span>
                {value === option && <IconCheck className="w-3 h-3 text-[rgb(var(--accent-rgb))]" />}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const DateFieldCell = ({ value, onBlur, validation }) => {
    const hasError = validation && validation.error;
    return (
        <div className="w-full h-full px-2 py-1.5 hover:bg-white/5 rounded-md transition-colors relative">
            <input
                type="date"
                className={cn(
                    "w-full bg-transparent outline-none text-xs font-mono uppercase tracking-wider text-muted-foreground focus:text-foreground cursor-pointer",
                    hasError && "text-red-400"
                )}
                value={value ? format(new Date(value), 'yyyy-MM-dd') : ''}
                onChange={(e) => onBlur(e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
        </div>
    );
};

export const CheckboxFieldCell = ({ value, onBlur }) => (
    <div className="w-full h-full flex items-center justify-center">
        <input
            type="checkbox"
            className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer accent-[rgb(var(--accent-rgb))]"
            checked={Boolean(value)}
            onChange={(e) => onBlur(e.target.checked)}
        />
    </div>
);

export const MemberFieldCell = ({ value, members = [], onBlur, placeholder }) => {
    const selected = members.find(m => m.id === value);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-full px-2 flex items-center outline-none hover:bg-white/5 rounded-md">
                {selected ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[9px] font-bold text-indigo-300">
                            {selected.name.charAt(0)}
                        </div>
                        <span className="text-xs truncate max-w-[100px]">{selected.name}</span>
                    </div>
                ) : <span className="text-xs text-muted-foreground/30 px-1">{placeholder || 'Assignar'}</span>}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-white/10">
                {members.map(m => (
                    <DropdownMenuItem key={m.id} onClick={() => onBlur(m.id)} className="text-xs cursor-pointer">{m.name}</DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// --- HELPERS ---

export const getFieldTypeIcon = (type) => {
  const iconMap = {
    text: '📝',
    number: '🔢',
    dropdown: '📋',
    select: '📋',
    date: '📅',
    member: '👤',
    checkbox: '✓',
    rating: '⭐',
    energy: '⚡',
    archetype: '🧠',
    sankalpa: '🎯',
  };
  return iconMap[type] || '📌';
};

export const getFieldTypeLabel = (type) => {
  const labelMap = {
    text: 'Texto',
    number: 'Número',
    dropdown: 'Seleção',
    select: 'Seleção',
    date: 'Data',
    member: 'Membro',
    checkbox: 'Checkbox',
    rating: 'Avaliação',
    energy: 'Energia',
    archetype: 'Arquétipo',
    sankalpa: 'Sankalpa',
  };
  return labelMap[type] || type;
};