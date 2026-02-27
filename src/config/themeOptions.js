/* src/config/themeOptions.js
   desc: Configuração de Temas (Apenas 3 temas originais de AntigaPagina.jsx).
   feat: Mantém apenas os temas definidos originalmente: prana-dark (Void), wabi-sabi-dark (Cartography) e wabi-sabi-light (Rice Paper).
*/

export const DEFAULT_THEME = 'prana-dark';

export const THEME_KEYS = [
  'prana-dark', 
  'wabi-sabi-dark', 
  'wabi-sabi-light',
  'concrete-gray',
  'gray-orange',
  'linen-cream'
];

export const THEME_OPTION_GROUPS = [
    {
        id: 'atmospheres',
        label: 'Atmosferas Prana',
        options: [
            { 
                value: 'prana-dark', 
                label: 'Void (Padrão)', 
                type: 'dark',
                swatchStyle: { 
                    backgroundColor: '#0C0A09',
                    border: '1px solid #333',
                    backgroundImage: 'linear-gradient(135deg, transparent 50%, #D97706 50%)'
                } 
            },
            { 
                value: 'wabi-sabi-dark', 
                label: 'Cartography (Textura)', 
                type: 'dark',
                swatchStyle: { 
                    backgroundColor: '#18120f', 
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/cartographer.png')" 
                } 
            },
            { 
                value: 'wabi-sabi-light', 
                label: 'Rice Paper (Claro)', 
                type: 'light',
                swatchStyle: { 
                    backgroundColor: '#F9F7F1', 
                    border: '1px solid #e5e5e5',
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/sand-paper.png')"
                } 
            }
        ]
    },
    {
        id: 'modern',
        label: 'Modernas (Novos Tons)',
        options: [
            { 
                value: 'concrete-gray', 
                label: 'Concrete Gray (Concreto)', 
                type: 'dark',
                swatchStyle: { 
                    backgroundColor: '#3a3a3a', 
                    border: '1px solid #555',
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/concrete.png')"
                } 
            },
            { 
                value: 'gray-orange', 
                label: 'Gray & Orange (Contraste)', 
                type: 'dark',
                swatchStyle: { 
                    backgroundColor: '#2d2d2d', 
                    border: '1px solid #666',
                    backgroundImage: 'linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 50%, #D97706 100%)'
                } 
            },
            { 
                value: 'linen-cream', 
                label: 'Linen Cream (Linho)', 
                type: 'light',
                swatchStyle: { 
                    backgroundColor: '#f5f1ed', 
                    border: '1px solid #d0c4b8',
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/linen.png')"
                } 
            }
        ]
    }
];

export const AVAILABLE_THEMES = THEME_OPTION_GROUPS.reduce((acc, group) => {
    group.options.forEach(opt => {
        acc[opt.value] = { name: opt.label, type: opt.type };
    });
    return acc;
}, {});