/* canvas: src/hooks/useTheme.jsx
   desc: Hook para acessar o tema. Garante que estamos usando o contexto do ThemeProvider.jsx.
*/
import { useContext } from 'react';
// Importa o Contexto DIRETAMENTE do arquivo do Provider
import { ThemeProviderContext } from '@/components/ThemeProvider'; 

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um <ThemeProvider>");
  }

  return context;
};

export default useTheme;