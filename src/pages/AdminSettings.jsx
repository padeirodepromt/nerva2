import React, { useState, useEffect, useCallback } from 'react';
import { MenuConfig } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Save, Loader2, AlertTriangle } from '@/components/icons/PranaLandscapeIcons';
import { motion } from 'framer-motion';
import PageIntroTrigger from '@/components/PageIntroTrigger';
import { IconGeneral } from '@/components/icons/PranaLandscapeIcons';

const defaultSettings = {
  maxWidth: 1400,
  menuPaddingX: 3,
  sectionGap: 2,
  iconGap: 1,
  iconPadding: 2,
  iconSize: 5,
};

export default function AdminSettingsPage() {
    const [config, setConfig] = useState(defaultSettings);
    const [originalConfig, setOriginalConfig] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadConfig = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            if (currentUser?.role !== 'admin') {
                setIsLoading(false);
                return;
            }
            const configs = await MenuConfig.list();
            if (configs && configs.length > 0) {
                setConfig(configs[0]);
                setOriginalConfig(configs[0]);
            } else {
                setOriginalConfig({ ...defaultSettings, isNew: true });
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (originalConfig?.isNew) {
                await MenuConfig.create(config);
            } else {
                await MenuConfig.update(originalConfig.id, config);
            }
            // Recarrega a página para que o Layout pegue as novas configurações
            window.location.reload();
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }
    
    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold">Acesso Negado</h2>
                <p className="opacity-70">Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }
    
    const SettingSlider = ({ label, description, value, onValueChange, min, max, step }) => (
        <div className="space-y-3">
            <Label className="font-medium">{label} <span className="opacity-70 ml-2 font-mono">({value})</span></Label>
            <p className="text-sm opacity-60">{description}</p>
            <Slider
                value={[value]}
                onValueChange={onValueChange}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-4 sm:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start justify-between gap-4 mb-8"
            >
                <div className="flex items-center gap-3">
                    <PageIntroTrigger
                        icon={IconGeneral}
                        title="Configurações do Menu"
                        description="Ajuste espaçamentos, tamanhos e proporções da barra de navegação para alinhar o layout com a identidade visual do Prana."
                        className="bg-transparent"
                        iconClassName="h-8 w-8"
                    />
                    <p className="text-sm opacity-70 max-w-xs">
                        Personalize a apresentação dos ícones e seções da navegação principal.
                    </p>
                </div>
            </motion.div>

            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle>Aparência do Menu de Navegação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                    <SettingSlider
                        label="Largura Máxima do Menu (px)"
                        description="Define a largura máxima que o menu pode ocupar na tela."
                        value={config.maxWidth}
                        onValueChange={(val) => setConfig(p => ({ ...p, maxWidth: val[0] }))}
                        min={800} max={2500} step={10}
                    />
                    <SettingSlider
                        label="Padding Horizontal do Menu"
                        description="Espaçamento nas laterais do menu. (Valor x 4px)"
                        value={config.menuPaddingX}
                        onValueChange={(val) => setConfig(p => ({ ...p, menuPaddingX: val[0] }))}
                        min={0} max={8} step={1}
                    />
                    <SettingSlider
                        label="Espaço entre Seções"
                        description="Espaço entre o logo, os ícones e o seletor de tema."
                        value={config.sectionGap}
                        onValueChange={(val) => setConfig(p => ({ ...p, sectionGap: val[0] }))}
                        min={0} max={8} step={1}
                    />
                    <SettingSlider
                        label="Espaço entre Ícones"
                        description="Espaçamento entre cada um dos ícones de navegação."
                        value={config.iconGap}
                        onValueChange={(val) => setConfig(p => ({ ...p, iconGap: val[0] }))}
                        min={0} max={4} step={0.5}
                    />
                    <SettingSlider
                        label="Padding de Cada Ícone"
                        description="Espaçamento interno ao redor de cada ícone."
                        value={config.iconPadding}
                        onValueChange={(val) => setConfig(p => ({ ...p, iconPadding: val[0] }))}
                        min={0} max={4} step={0.5}
                    />
                    <SettingSlider
                        label="Tamanho dos Ícones"
                        description="Define a largura e altura dos ícones."
                        value={config.iconSize}
                        onValueChange={(val) => setConfig(p => ({ ...p, iconSize: val[0] }))}
                        min={3} max={8} step={0.5}
                    />
                </CardContent>
            </Card>

            <div className="mt-8 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="glow-effect px-8 py-3">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Salvar e Recarregar</>}
                </Button>
            </div>
        </motion.div>
    );
}