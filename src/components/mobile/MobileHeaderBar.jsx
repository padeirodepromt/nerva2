/* src/components/mobile/MobileHeaderBar.jsx
   desc: Cabeçalho com ícones consistentes ao Desktop.
*/
import React from 'react';
import { PranaLogo } from '@/components/ui/PranaLogo';
import { IconMenu, IconArrowLeft } from '@/components/icons/PranaLandscapeIcons';
import { Sun, Moon, Globe } from '@/components/icons/PranaLandscapeIcons';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTranslations } from '@/components/LanguageProvider';

export default function MobileHeaderBar({ title, onMenuToggle, onBack }) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useTranslations();
  // Idiomas permitidos
  const languages = [
    { value: 'pt', label: 'Português' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ];
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  return (
    <header className="h-24 shrink-0 flex items-end justify-between px-6 pb-5 relative z-[50]">
      <div className="flex items-center gap-4">
        {onBack ? (
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform"
          >
            <IconArrowLeft className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <div className="relative group">
            <PranaLogo className="w-9 h-9 text-primary drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" ativo={true} />
          </div>
        )}
        <div className="flex flex-col">
           <h1 className="font-serif text-xl font-bold tracking-tight capitalize leading-tight">
             {title}
           </h1>
           <span className="text-[8px] uppercase tracking-[0.3em] opacity-30 font-mono font-bold">Neural Core</span>
        </div>
      </div>
      {/* Ações rápidas: tema, idioma, switch desktop */}
      <div className="flex items-center gap-2">
        {/* Botão de alternância de tema */}
        <button
          onClick={() => setTheme(theme === 'wabi-sabi-light' ? 'wabi-sabi-dark' : 'wabi-sabi-light')}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${theme === 'wabi-sabi-light' ? 'bg-white/5 border-white/10 text-muted-foreground' : 'bg-primary text-primary-foreground border-primary'}`}
          title={theme === 'wabi-sabi-light' ? 'Tema Escuro' : 'Tema Claro'}
        >
          {theme === 'wabi-sabi-light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        {/* Dropdown de idiomas */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen((v) => !v)}
            className={`w-9 h-9 flex items-center justify-center rounded-full border bg-white/5 border-white/10 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all`}
            title="Selecionar idioma"
          >
            <Globe className="w-5 h-5" />
          </button>
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-background border border-white/10 rounded-xl shadow-xl z-50">
              {languages.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setLanguage(opt.value); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-all ${language === opt.value ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-white/5'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Switch Desktop */}
        {/* Ícone de desktop removido pois não há um ícone Monitor na biblioteca. Adicione aqui se criar um ícone correspondente. */}
        {/* Menu */}
        <button 
          onClick={onMenuToggle}
          className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-white/5 border border-white/10 backdrop-blur-md active:scale-95 transition-all shadow-xl ml-2"
        >
          <IconMenu className="w-6 h-6 text-primary" />
        </button>
      </div>
    </header>
  );
}