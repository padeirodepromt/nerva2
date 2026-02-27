// src/components/ErrorBoundary.jsx

import React from 'react';
import { AlertCircle, RotateCcw } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro
    console.error("ERRO DE RENDERIZAÇÃO CRÍTICO:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }
  
  handleReload = () => {
      // Limpa o estado de erro e recarrega a janela
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-6">
          <div className="prana-form-modal text-center max-w-lg p-8 space-y-4 border-l-4 border-red-500">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-red-400">ERRO FATAL NA RENDERIZAÇÃO</h1>
            <p className="text-sm opacity-80">
              Ocorreu um erro ao carregar esta página. Isso pode ser um bug ou um componente que falhou ao buscar dados. 
              Por favor, verifique o Console do Navegador (F12) para o **erro de contexto/propriedade exato**.
            </p>
            
            {/* Botão de Ação */}
            <Button onClick={this.handleReload} className="glow-effect bg-red-600 hover:bg-red-700">
                <RotateCcw className="w-4 h-4 mr-2"/> Tentar Recarregar
            </Button>

            {/* Detalhes Técnicos (Opcional) */}
            {/* <details className="text-xs opacity-50 mt-4 text-left cursor-pointer">
              <summary>Mostrar Detalhes do Erro</summary>
              <pre className="whitespace-pre-wrap break-all mt-2 p-2 bg-black/10 rounded-lg">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details> */}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;