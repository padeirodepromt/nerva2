/* src/components/importer/GithubImportModal.jsx */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, FileArchive, Check, AlertCircle, Loader2, GitBranch } from 'lucide-react';
import { apiClient } from '../../api/apiClient'; // Caminho relativo ajustado para src/api/apiClient
import { useToast } from '../ui/use-toast'; // Caminho relativo ajustado para src/components/ui/use-toast

export function GithubImportModal({ isOpen, onClose, parentId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [repoName, setRepoName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Verificação simples de extensão
      if (!selectedFile.name.endsWith('.zip')) {
        toast({ title: "Arquivo inválido", description: "Por favor, envie um arquivo .zip", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      if (!repoName) {
        setRepoName(selectedFile.name.replace('.zip', ''));
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('repoName', repoName);
    
    if (parentId) {
        formData.append('parentId', parentId);
    }

    try {
      // CORREÇÃO CRÍTICA: Ao enviar FormData com Axios/Fetch, 
      // NÃO defina 'Content-Type': 'multipart/form-data' manualmente.
      // O navegador precisa definir o boundary automaticamente.
      const response = await apiClient.post('/import/zip', formData);

      setResult(response.data);
      toast({
        title: "Ingestão Concluída",
        description: `${response.data.message}`,
        variant: "success", // Certifique-se que seu toaster suporta variants customizados ou use default
      });
      
      if (onSuccess) onSuccess(response.data);
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.message || "Falha ao enviar o arquivo.";
      toast({
        title: "Erro na Importação",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRepoName('');
    setResult(null);
    if(onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && reset()}>
      <DialogContent className="sm:max-w-[500px] bg-background text-foreground border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <GitBranch className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <DialogTitle>
                  {parentId ? "Importar ZIP na Pasta" : "Importar Repositório (ZIP)"}
              </DialogTitle>
              <DialogDescription>
                {parentId 
                  ? "O conteúdo será criado como documentos filhos desta pasta." 
                  : "Crie um novo projeto raiz a partir de um código fonte."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Nome do Projeto / Pasta</Label>
              <Input 
                value={repoName} 
                onChange={(e) => setRepoName(e.target.value)} 
                placeholder="Ex: Prana Backend V3" 
              />
            </div>

            <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
              {file ? (
                <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full">
                  <FileArchive className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-6 w-6 p-0 ml-2 text-muted-foreground">×</Button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arraste o arquivo ZIP ou clique para selecionar
                  </p>
                  <Input 
                    type="file" 
                    accept=".zip" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="zip-upload" 
                  />
                  <Button variant="outline" onClick={() => document.getElementById('zip-upload').click()}>
                    Selecionar Arquivo
                  </Button>
                </>
              )}
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Arquivos binários e <code>node_modules</code> serão ignorados automaticamente.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">Sucesso!</h3>
            <p className="text-muted-foreground text-sm">
              Processado com sucesso.<br/>
              {result.stats?.filesProcessed || 'Vários'} arquivos extraídos.
            </p>
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={reset} disabled={isLoading}>Cancelar</Button>
              <Button onClick={handleImport} disabled={!file || isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Lendo...</> : 'Importar Código'}
              </Button>
            </div>
          ) : (
            <Button onClick={reset} className="w-full">Concluir</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}