/* src/pages/ImporterPage.jsx
   desc: Página centralizada para importar dados de múltiplas plataformas
*/

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IconUpload, 
  IconFileText, 
  IconLink,
  IconBriefcase 
} from '@/components/icons/PranaLandscapeIcons';
import { CSVImportModal, NotionImportModal, AsanaImportModal } from '@/components/importer';
import { toast } from 'sonner';

const IMPORTERS = [
  {
    id: 'csv',
    name: 'CSV',
    description: 'Importar de Excel, Google Sheets ou qualquer arquivo CSV',
    icon: IconFileText,
    color: 'bg-green-900/20 border-green-500/30 text-green-400',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sincronize suas databases do Notion diretamente',
    icon: IconLink,
    color: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Importe seus projetos e tarefas do Asana',
    icon: IconBriefcase,
    color: 'bg-purple-900/20 border-purple-500/30 text-purple-400',
    buttonColor: 'bg-purple-600 hover:bg-purple-700'
  }
];

export default function ImporterPage() {
  const [activeModal, setActiveModal] = useState(null);

  const handleImportComplete = () => {
    toast.success('Dados importados com sucesso! Atualizando...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconUpload className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-white">Importador de Dados</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Traga seus dados de outras plataformas para o Prana. Suportamos importação de CSV, Notion, Asana e muito mais.
          </p>
        </div>

        {/* Grid de Importadores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMPORTERS.map(importer => {
            const Icon = importer.icon;
            return (
              <Card key={importer.id} className={`border ${importer.color.split(' ').slice(1).join(' ')} ${importer.color.split(' ')[0]}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{importer.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {importer.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg ${importer.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Button
                    onClick={() => setActiveModal(importer.id)}
                    className={`w-full text-white ${importer.buttonColor}`}
                  >
                    Importar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações Adicionais */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="bg-blue-900/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400">💡 Dica</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-400 space-y-2">
              <p>Seus dados são processados de forma segura e adicionados ao seu workspace imediatamente.</p>
              <p>Duplicatas são automaticamente detectadas e ignoradas.</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">⚡ Compatibilidade</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-400 space-y-2">
              <p>CSV funciona com: Excel, Google Sheets, Monday, Todoist</p>
              <p>Notion: Qualquer database compartilhada</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CSVImportModal 
        isOpen={activeModal === 'csv'}
        onClose={() => setActiveModal(null)}
        onImportComplete={handleImportComplete}
      />
      <NotionImportModal 
        isOpen={activeModal === 'notion'}
        onClose={() => setActiveModal(null)}
        onImportComplete={handleImportComplete}
      />
      <AsanaImportModal 
        isOpen={activeModal === 'asana'}
        onClose={() => setActiveModal(null)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
