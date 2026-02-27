import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconX, IconFile, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// CORREÇÃO: Importa a função correta ('uploadWithCredits') do local correto ('@/api/functions').
import { uploadWithCredits } from '@/api/functions';

const AttachmentUploader = ({ onFileUpload, onRemoveFile, attachedFiles = [] }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        // A função de upload real é chamada aqui.
        await uploadWithCredits(file);
        onFileUpload(file); // Adiciona o ficheiro à lista no componente pai (Chat.jsx)
      }
      toast({
        title: "Sucesso!",
        description: `${acceptedFiles.length} ficheiro(s) anexado(s).`,
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        variant: "destructive",
        title: "Erro no Upload",
        description: error.message || "Não foi possível anexar o ficheiro.",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`mt-2 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex justify-center items-center">
            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>A enviar...</span>
          </div>
        ) : (
          <p>Arraste e solte ficheiros aqui, ou clique para selecionar.</p>
        )}
      </div>

      {attachedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <IconFile className="w-4 h-4" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemoveFile(index)}>
                <IconX className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;