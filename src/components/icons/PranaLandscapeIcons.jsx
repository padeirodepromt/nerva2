/* canvas: src/components/icons/PranaLandscapeIcons.jsx
   desc: Biblioteca Mestra de Ícones V11.0 (Master & Corrected).
   feat: Todos os ícones desenhados + Mapa de Exportação corrigido.
*/

import React from 'react';

// ==================================================================================
// 1. UTILITÁRIOS E ESTILO BASE
// ==================================================================================

const LINE_STYLE = (ativo) => ({ 
    stroke: ativo ? 'none' : 'currentColor', 
    fill: 'none', 
    strokeWidth: 4 
});
const SHAPE_STYLE = (ativo) => ({ 
    fill: ativo ? 'rgb(217, 119, 6)' : 'none', 
    stroke: ativo ? 'none' : 'currentColor', 
    strokeWidth: ativo ? 0 : 4 
});

const IconBase = ({ children, className = '', ativo = false, spin = false, viewBox = "0 0 100 100", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    style={{ color: ativo ? 'rgb(217, 119, 6)' : 'rgb(var(--accent-dark-earthy))' }}
    className={`icon-hero ${ativo ? 'icon-ativo' : ''} ${spin ? 'animate-spin-slow' : ''} ${className}`}
    {...props}
  >
    {children}
  </svg>
);

const TechPath = (props) => <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props} />;

// ==================================================================================
// 2. OS ARCANOS (Metáforas Naturais - 100x100)
// ==================================================================================

export const IconDashboard = (props) => (
  <IconBase {...props}>
    <circle className="icon-nature-energia" cx="50" cy="50" r="35" style={{strokeDasharray: "4 4", animationDelay: "-0.8s"}}/>
    <circle className="icon-nature-energia" cx="50" cy="50" r="45" style={{strokeDasharray: "4 4", animationDelay: "-1.2s"}}/>
    <path className="icon-nature-base" d="M 50 25 Q 78 50, 50 75 Q 22 50, 50 25 Z" style={SHAPE_STYLE(props.ativo)}/>
    <circle className="icon-hero-detalhe" cx="50" cy="50" r="10" style={{fill: props.ativo ? "var(--bg-color)" : "rgb(var(--accent-dark-earthy))", stroke: "none"}}/>
  </IconBase>
);

export const IconChat = (props) => (
  <IconBase {...props}>
    <path className="icon-loader-wave" d="M 20 60 Q 10 50, 20 40 T 40 40 T 60 40 T 80 40 Q 90 50, 80 60 T 60 60 T 40 60 T 20 60 Z" style={{ fill: 'none', strokeWidth: 4 }}/>
  </IconBase>
);

export const IconSankalpa = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-energia" d="M 50 5 Q 90 20, 90 50 Q 90 80, 50 95 Q 10 80, 10 50 Q 10 20, 50 5 Z" style={{strokeDasharray: "4 4"}}/>
    <path className="icon-nature-base" d="M 50 15 L 75 40 L 50 85 L 25 40 Z" style={SHAPE_STYLE(props.ativo)}/>
    <path className="icon-hero-detalhe" d="M 50 15 L 50 85 M 25 40 L 75 40" style={{fill: "none", stroke: props.ativo ? "var(--bg-color)" : "currentColor", strokeWidth: 4}}/>
  </IconBase>
);

export const IconCronos = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-energia" d="M 25 10 Q 60 50, 25 90 Q 35 50, 25 10 Z" style={{strokeDasharray: "4 4", opacity: "0.5"}}/>
    <path className="icon-nature-base" d="M 40 10 Q 75 50, 40 90 Q 50 50, 40 10 Z" style={SHAPE_STYLE(props.ativo)}/>
    <path className="icon-nature-energia" d="M 55 10 Q 90 50, 55 90" style={{strokeDasharray: "3 3", opacity: 0.3}}/>
  </IconBase>
);

export const IconCosmos = (props) => (
  <IconBase {...props}>
    <circle className="icon-nature-energia" cx="50" cy="50" r="30" style={{strokeDasharray: "4 4", animationDelay: "-0.8s"}}/>
    <path className="icon-nature-energia" d="M 18 50 C 18 25, 82 25, 82 50 C 82 75, 18 75, 18 50 Z" style={{animationDelay: "-1.2s"}}/>
    <circle className="icon-nature-base" cx="50" cy="50" r="16" style={SHAPE_STYLE(props.ativo)}/>
  </IconBase>
);

export const IconNexus = (props) => (
  <IconBase {...props}>
    <g className="icon-flow-energia" style={{opacity: props.ativo ? 0.8 : 0}}>
        <circle cx="25" cy="25" r="4" style={{animationDelay: "-0.2s"}}/>
        <circle cx="50" cy="50" r="4" style={{animationDelay: "-0.4s"}}/>
        <circle cx="75" cy="75" r="4" style={{animationDelay: "-0.6s"}}/>
    </g>
    <path className="icon-nature-base" d="M 15 5 Q 60 40, 50 50 T 85 95" style={LINE_STYLE(false)}/>
    <path className="icon-nature-base" d="M 35 5 Q 80 40, 70 50 T 105 95" style={{opacity: 0.5, ...LINE_STYLE(false)}}/>
  </IconBase>
);

export const IconDiario = (props) => (
  <IconBase {...props}>
    <g className="icon-nature-energia">
        <path d="M 50 20 V 5"/><path d="M 80 50 H 95"/><path d="M 50 80 V 95"/><path d="M 20 50 H 5"/><path d="M 72 28 L 85 15"/><path d="M 72 72 L 85 85"/><path d="M 28 72 L 15 85"/><path d="M 28 28 L 15 15"/>
    </g>
    <circle className="icon-nature-base" cx="50" cy="50" r="28" style={SHAPE_STYLE(props.ativo)}/>
  </IconBase>
);

export const IconPapyrus = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-energia" d="M 50 25 Q 20 15, 10 40" style={{animationDelay: "-0.5s"}}/>
    <path className="icon-nature-energia" d="M 50 25 Q 80 15, 90 40" style={{animationDelay: "-1s"}}/>
    <path className="icon-nature-base" d="M 20 80 L 45 40 L 55 55 L 70 35 L 85 80 Z" style={SHAPE_STYLE(props.ativo)}/>
  </IconBase>
);

export const IconNeural = (props) => (
  <IconBase {...props}>
    <circle className="icon-nature-energia" cx="50" cy="35" r="25" style={{strokeDasharray: "4 4", animationDelay: "-0.8s"}}/>
    <path className="icon-nature-base" d="M 50 85 V 40" style={LINE_STYLE(false)}/>
    <path className="icon-nature-base" d="M 50 60 L 30 40" style={LINE_STYLE(false)}/>
    <path className="icon-nature-base" d="M 50 60 L 70 40" style={LINE_STYLE(false)}/>
  </IconBase>
);

export const IconColetivo = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-energia" d="M 30 30 Q 50 35, 70 30" style={{strokeDasharray: "2 2", animationDelay: "-0.2s"}}/>
    <path className="icon-nature-energia" d="M 30 30 Q 35 50, 30 70" style={{strokeDasharray: "2 2", animationDelay: "-0.4s"}}/>
    <path className="icon-nature-energia" d="M 70 30 Q 65 50, 70 70" style={{strokeDasharray: "2 2", animationDelay: "-0.6s"}}/>
    <path className="icon-nature-energia" d="M 30 70 Q 50 65, 70 70" style={{strokeDasharray: "2 2", animationDelay: "-0.8s"}}/>
    <circle className="icon-nature-base" cx="30" cy="30" r="8" style={SHAPE_STYLE(props.ativo)}/>
    <circle className="icon-nature-base" cx="70" cy="30" r="8" style={SHAPE_STYLE(props.ativo)}/>
    <circle className="icon-nature-base" cx="30" cy="70" r="8" style={SHAPE_STYLE(props.ativo)}/>
    <circle className="icon-nature-base" cx="70" cy="70" r="8" style={SHAPE_STYLE(props.ativo)}/>
  </IconBase>
);

export const IconMatrix = (props) => (
  <IconBase {...props}>
    <circle className="icon-nature-energia" cx="30" cy="30" r="2" style={{animationDelay: "-0.2s"}}/>
    <circle className="icon-nature-energia" cx="40" cy="25" r="2" style={{animationDelay: "-0.8s"}}/>
    <circle className="icon-nature-energia" cx="50" cy="32" r="2" style={{animationDelay: "-1.2s"}}/>
    <path className="icon-nature-base" d="M 10 80 Q 30 40, 50 60 T 90 40 V 80 H 10 Z" style={SHAPE_STYLE(props.ativo)}/>
  </IconBase>
);

export const IconFlux = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-energia" d="M 10 7 H 17 V 14" style={{strokeDasharray: "3 3"}}/>
    <path className="icon-nature-energia" d="M 7 10 V 17 H 14" style={{strokeDasharray: "3 3"}}/>
    <rect className="icon-nature-base" width="20" height="20" x="15" y="15" rx="5" style={SHAPE_STYLE(props.ativo)}/>
    <rect className="icon-nature-base" width="20" height="20" x="65" y="65" rx="5" style={SHAPE_STYLE(props.ativo)}/>
  </IconBase>
);

export const IconGlass = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-base" d="M 25 20 H 75 L 50 55 L 25 20 Z" style={SHAPE_STYLE(props.ativo)}/>
    <path className="icon-nature-base" d="M 25 80 H 75 L 50 45 L 25 80 Z" style={SHAPE_STYLE(props.ativo)}/>
    <path className="icon-nature-energia" d="M 50 55 V 80" style={{strokeDasharray: "2 2"}}/>
  </IconBase>
);

export const IconSettings = (props) => (
  <IconBase {...props}>
    <path className="icon-nature-base" d="M 20 40 Q 40 40, 60 40" style={SHAPE_STYLE(props.ativo)}/>
    <path className="icon-nature-base" d="M 20 60 Q 40 60, 60 60" style={SHAPE_STYLE(props.ativo)}/>
    <circle className="icon-nature-energia" cx="30" cy="40" r="6" style={{fill: "none", stroke: "currentColor", strokeWidth: 3, opacity: props.ativo ? 1 : 0.6}}/>
    <circle className="icon-nature-energia" cx="50" cy="60" r="6" style={{fill: "none", stroke: "currentColor", strokeWidth: 3, opacity: props.ativo ? 1 : 0.6}}/>
  </IconBase>
);

// Elementais
export const IconLua = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 65 20 C 50 25, 40 40, 40 55 C 40 70, 50 80, 62 84 C 46 86, 34 72, 34 55 C 34 38, 46 24, 62 20 Z" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 55 32 C 50 37, 47 45, 47 53"/></IconBase>;
export const IconRio = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 25 25 C 35 35, 45 20, 55 30 C 65 40, 75 35, 82 40" style={LINE_STYLE(false)}/><path className="icon-nature-base" d="M 18 60 C 30 55, 40 70, 52 62 C 64 54, 74 66, 85 60" style={LINE_STYLE(false)}/><path className="icon-nature-energia" d="M 25 45 Q 40 52, 55 44 T 85 46" style={{strokeDasharray: "4 4"}}/></IconBase>;
export const IconFogo = (props) => <IconBase {...props}><g className="icon-spark-energia" style={{opacity: props.ativo ? 1 : 0}}><path d="M 50 5 L 50 0" style={{animationDelay: "-0.1s"}}/><path d="M 40 15 L 35 10" style={{animationDelay: "-0.3s"}}/><path d="M 60 15 L 65 10" style={{animationDelay: "-0.5s"}}/></g><path className="icon-nature-base" d="M 50 90 Q 40 70, 30 60 C 20 40, 40 20, 50 10 C 60 20, 80 40, 70 60 Q 60 70, 50 90 Z" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconZap = (props) => <IconBase {...props}><path className="icon-spark-energia" d="M 50 10 L 40 40 L 60 40 L 30 90 M 50 10 L 60 40 L 40 40 L 70 90" style={{fill: "none", strokeDasharray: "2 2"}}/><path className="icon-nature-base" d="M 50 15 L 40 42 L 58 42 L 35 85 L 60 42 L 42 42 L 65 15" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconClock = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><TechPath d="M12 6v6l4 2" /></IconBase>;

// ==================================================================================
// 3. ÍCONES DE SUPORTE (100x100)
// ==================================================================================

export const IconVision = (props) => <IconBase {...props}><circle className="icon-nature-energia" cx="50" cy="50" r="28" style={{strokeDasharray: "2 2", animationDelay: "-0.5s"}}/><path className="icon-nature-energia" d="M 72 72 L 90 90" style={{strokeWidth: 3, strokeLinecap: "round"}}/><circle className="icon-nature-base" cx="50" cy="50" r="22" style={SHAPE_STYLE(props.ativo)}/><circle className="icon-hero-detalhe" cx="50" cy="50" r="8" style={{fill: props.ativo ? "rgb(var(--accent-dark-earthy))" : "none", stroke: "none"}}/></IconBase>;
export const IconAlert = (props) => <IconBase {...props}><path className="icon-nature-energia" d="M 18 25 Q 8 50, 18 75" style={{strokeDasharray: "2 2", animationDelay: "-0.2s"}}/><path className="icon-nature-energia" d="M 82 25 Q 92 50, 82 75" style={{strokeDasharray: "2 2", animationDelay: "-0.4s"}}/><path className="icon-nature-base" d="M 50 12 Q 72 12, 72 38 V 75 H 28 V 38 Q 28 12, 50 12 Z" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 42 12 V 8"/><circle className="icon-hero-detalhe" cx="50" cy="75" r="6" style={{fill: props.ativo ? "rgb(var(--accent-dark-earthy))" : "var(--bg-color)"}}/></IconBase>;
export const IconCraft = (props) => <IconBase {...props}><path className="icon-nature-energia" d="M 20 80 Q 30 90, 50 80 T 80 90" style={{strokeDasharray: "2 2"}}/><path className="icon-nature-base" d="M 20 80 L 30 50 L 70 10 L 90 30 L 50 70 Z" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 30 50 L 50 70" style={LINE_STYLE(false)}/></IconBase>;
export const IconGrowth = (props) => <IconBase {...props}><circle className="icon-nature-energia" cx="50" cy="50" r="24" style={{strokeDasharray: "4 4", animationDelay: "-0.5s"}}/><path className="icon-nature-base" d="M 50 15 V 85"/><path className="icon-nature-base" d="M 15 50 H 85"/>{props.ativo && <circle className="icon-hero-detalhe" cx="50" cy="50" r="7" style={{fill: "rgb(var(--accent-dark-earthy))"}}/>}</IconBase>;
export const IconVoid = (props) => <IconBase {...props}><g className="icon-spark-energia" style={{opacity: props.ativo ? 1 : 0}}><circle cx="30" cy="30" r="2" fill="var(--accent)"/><circle cx="50" cy="20" r="2" fill="var(--accent)"/><circle cx="70" cy="30" r="2" fill="var(--accent)"/></g><path className="icon-nature-base" d="M 30 30 L 35 85 H 65 L 70 30" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 20 30 H 80"/><path className="icon-nature-base" d="M 40 30 V 80"/><path className="icon-nature-base" d="M 50 30 V 80"/><path className="icon-nature-base" d="M 60 30 V 80"/></IconBase>;
export const IconLayers = (props) => <IconBase {...props}><g className="icon-nature-energia" style={{opacity: props.ativo ? 0.3 : 0}}><rect x="15" y="25" width="70" height="20" rx="3" style={{fill: "none", strokeDasharray: "2 2", animationDelay: "-0.2s"}}/></g><path className="icon-nature-base" d="M 20 30 H 80" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 20 50 H 80" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 20 70 H 80" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 15 30 V 75 M 85 30 V 75" style={{strokeWidth: 2}} /></IconBase>;
export const IconKeep = (props) => <IconBase {...props}><circle className="icon-nature-energia" cx="50" cy="50" r="10"/><rect className="icon-nature-base" x="20" y="20" width="60" height="60" rx="5" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 35 20 V 40 H 65 V 20"/><path className="icon-nature-base" d="M 30 80 V 60 H 70 V 80"/></IconBase>;
export const IconDone = (props) => <IconBase {...props}><path className="icon-nature-energia" d="M 25 50 L 45 70 L 85 25" style={{strokeDasharray: "2 2", transform: "translate(5px, -5px)"}}/><path className="icon-nature-base" d="M 20 50 L 40 70 L 80 30"/></IconBase>;
export const IconBlock = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 30 30 L 70 70"/><path className="icon-nature-base" d="M 70 30 L 30 70"/><circle className="icon-nature-energia" cx="50" cy="50" r="15" style={{opacity: props.ativo ? 0.8 : 0}}/></IconBase>;
export const IconSoul = (props) => <IconBase {...props}><path className="icon-nature-energia" d="M 20 80 Q 20 40, 50 20 Q 80 40, 80 80" style={{strokeDasharray: "4 4"}}/><circle className="icon-nature-base" cx="50" cy="40" r="12" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 25 90 Q 25 60, 50 60 Q 75 60, 75 90"/></IconBase>;

// ==================================================================================
// 4. FERRAMENTAS TÉCNICAS (24x24 Traço Fino)
// ==================================================================================

export const IconBold = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><TechPath d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></IconBase>;
export const IconItalic = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M19 4h-9" /><TechPath d="M14 20H5" /><TechPath d="M15 4L9 20" /></IconBase>;
export const IconH1 = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M4 12h8" /><TechPath d="M4 18V6" /><TechPath d="M12 18V6" /><TechPath d="M17 12l3-2v8" /></IconBase>;
export const IconH2 = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M4 12h8" /><TechPath d="M4 18V6" /><TechPath d="M12 18V6" /><TechPath d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" /></IconBase>;
export const IconQuote = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><TechPath d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></IconBase>;
export const IconHash = (props) => <IconBase {...props}><g className="icon-nature-energia" style={{opacity: props.ativo ? 0.3 : 0}}><circle cx="50" cy="50" r="30" style={{strokeDasharray: "2 2", animationDelay: "-0.2s"}}/></g><path className="icon-nature-base" d="M 25 35 H 75 M 25 65 H 75 M 35 20 L 30 80 M 65 20 L 60 80" style={{strokeWidth: 3, stroke: "currentColor", fill: "none"}} /></IconBase>;
export const IconLightbulb = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><TechPath d="M9 18h6" /><TechPath d="M10 22h4" /></IconBase>;
export const IconFeather = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><TechPath d="M16 8L2 22" /><TechPath d="M17.5 15H9" /></IconBase>;
export const IconKanban = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M3 5h6v14H3z" /><TechPath d="M15 5h6v14h-6z" /><path d="M3 10h6" stroke="currentColor" strokeWidth="0.5" /><path d="M15 10h6" stroke="currentColor" strokeWidth="0.5" /></IconBase>;
export const IconMap = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><TechPath d="M12 9V3" /><TechPath d="M12 21v-6" /><TechPath d="M9 12H3" /><TechPath d="M21 12h-6" /><circle cx="12" cy="3" r="1" fill="currentColor"/><circle cx="12" cy="21" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="21" cy="12" r="1" fill="currentColor"/></IconBase>;
export const IconCloud = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M17.5 19c0-1.7-1.3-3-3-3h-1.1c-.2-1.8-1.7-3.2-3.6-3.2-1.5 0-2.8.9-3.4 2.2h-.5C3.8 15 2 16.8 2 19s1.8 4 4 4h11.5c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5z" /></IconBase>;
export const IconFilter = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 25 H 80 L 55 55 V 80 L 45 75 V 55 Z" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconSearch = (props) => <IconBase {...props}><g className="icon-nature-energia" style={{opacity: props.ativo ? 0.4 : 0}}><circle cx="45" cy="45" r="25" style={{strokeDasharray: "3 2", animationDelay: "-0.5s"}}/><path d="M 65 65 L 85 85" style={{strokeDasharray: "2 2"}}/></g><circle className="icon-nature-base" cx="45" cy="45" r="25" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 65 65 L 85 85" style={{strokeWidth: 3}} /></IconBase>;
export const IconCheck = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 50 L 40 70 L 80 30"/></IconBase>;
export const IconCheckSquare = (props) => <IconBase {...props}><rect className="icon-nature-base" x="20" y="20" width="60" height="60" rx="10" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 35 50 L 45 60 L 65 40" style={{ strokeWidth: 4 }} /></IconBase>;
export const IconLink = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 35 50 C 35 40, 45 30, 55 40"/><path className="icon-nature-base" d="M 65 50 C 65 60, 55 70, 45 60"/><path className="icon-nature-energia" d="M 40 50 H 60"/><circle className="icon-nature-energia" cx="30" cy="50" r="5"/><circle className="icon-nature-energia" cx="70" cy="50" r="5"/></IconBase>;
export const IconChevronRight = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 40 20 L 70 50 L 40 80"/></IconBase>;
export const IconChevronLeft = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 60 20 L 30 50 L 60 80"/></IconBase>;
export const IconChevronDown = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 40 L 50 70 L 80 40"/></IconBase>;
export const IconChevronUp = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 60 L 50 30 L 80 60"/></IconBase>;
export const IconMoreHorizontal = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="30" cy="50" r="5" style={SHAPE_STYLE(props.ativo)}/><circle className="icon-nature-base" cx="50" cy="50" r="5" style={SHAPE_STYLE(props.ativo)}/><circle className="icon-nature-base" cx="70" cy="50" r="5" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconArrowRight = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 50 H 80"/><path className="icon-nature-base" d="M 60 30 L 80 50 L 60 70"/></IconBase>;
export const IconArrowLeft = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 80 50 H 20"/><path className="icon-nature-base" d="M 40 30 L 20 50 L 40 70"/></IconBase>;
export const IconPlus = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 50 20 V 80 M 20 50 H 80" /></IconBase>;
export const IconMinus = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 50 H 80" /></IconBase>;
export const IconCopy = (props) => <IconBase {...props}><rect className="icon-nature-base" x="35" y="35" width="45" height="45" rx="5" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 25 65 H 20 V 20 H 65 V 25" /></IconBase>;
export const IconPaperclip = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 35 40 V 70 Q 35 85, 50 85 T 65 70 V 30 Q 65 15, 50 15 T 35 30 V 60"/></IconBase>;
export const IconSend = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 15 50 L 85 50 M 60 25 L 85 50 L 60 75" /></IconBase>;
export const IconPin = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 30 20 L 70 20 L 60 50 L 70 80 L 50 80 L 50 95 L 50 80 L 30 80 L 40 50 Z" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconFile = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 20 15 H 60 L 80 35 V 85 H 20 V 15 Z" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 60 15 V 35 H 80"/></IconBase>;
export const IconFileText = (props) => <IconBase {...props}><g className="icon-nature-energia" style={{opacity: props.ativo ? 0.3 : 0}}><path d="M 20 20 L 50 50 L 20 80" style={{strokeDasharray: "2 2", animationDelay: "-0.2s"}}/></g><path className="icon-nature-base" d="M 20 15 H 60 L 80 35 V 85 H 20 V 15 Z" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 60 15 V 35 H 80" style={{strokeWidth: 3}}/><path className="icon-nature-energia" d="M 30 48 H 75 M 30 60 H 65 M 30 72 H 55" style={{strokeWidth: 2}} /></IconBase>;
export const IconHome = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 10 40 L 50 10 L 90 40 V 85 H 60 V 55 H 40 V 85 H 10 Z" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconStar = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 50 10 L 60 35 H 90 L 65 55 L 75 85 L 50 70 L 25 85 L 35 55 L 10 35 H 40 Z" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconSun = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="50" cy="50" r="20" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 50 10 V 20 M 50 80 V 90 M 10 50 H 20 M 80 50 H 90 M 22 22 L 30 30 M 70 70 L 78 78 M 22 78 L 30 70 M 70 30 L 78 22" /></IconBase>;
export const IconLoader2 = (props) => <IconBase {...props} spin={true}><path className="icon-nature-base" d="M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50" style={{strokeDasharray: "10 5", opacity: 0.8}}/></IconBase>;
export const IconMail = (props) => <IconBase {...props}><rect className="icon-nature-base" x="10" y="25" width="80" height="50" rx="5" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 10 25 L 50 55 L 90 25" /></IconBase>;
export const IconLock = (props) => <IconBase {...props}><rect className="icon-nature-base" x="25" y="40" width="50" height="40" rx="5" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 35 40 V 25 A 15 15 0 0 1 65 25 V 40" /><circle className="icon-nature-energia" cx="50" cy="60" r="5" /></IconBase>;
export const IconEye = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 10 50 Q 50 10, 90 50 Q 50 90, 10 50 Z" style={SHAPE_STYLE(props.ativo)}/><circle className="icon-nature-energia" cx="50" cy="50" r="12" /></IconBase>;
export const IconEyeOff = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 10 50 Q 50 90, 90 50" style={{opacity: 0.5}} /><path className="icon-nature-base" d="M 20 20 L 80 80" /><path className="icon-nature-base" d="M 50 30 Q 65 30, 75 40" /></IconBase>;
export const IconLogIn = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 35 20 H 20 V 80 H 35" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 60 50 H 90"/><path className="icon-nature-base" d="M 80 40 L 90 50 L 80 60"/></IconBase>;
export const IconLogOut = (props) => <IconBase {...props}><g className="icon-nature-energia" style={{opacity: props.ativo ? 0.5 : 0}}><path d="M 45 35 C 45 25, 55 15, 70 15 C 85 15, 95 25, 95 35" style={{strokeDasharray: "2 2", animationDelay: "-0.4s"}}/></g><path className="icon-nature-base" d="M 35 20 H 20 V 80 H 35" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 50 50 H 85" style={{strokeWidth: 3}}/><path className="icon-nature-base" d="M 75 40 L 85 50 L 75 60" /></IconBase>;
export const IconUserPlus = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="40" cy="35" r="15" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 10 80 Q 40 50, 70 80" /><path className="icon-nature-base" d="M 70 40 H 90 M 80 30 V 50" /></IconBase>;
export const IconBot = (props) => <IconBase {...props}><rect className="icon-nature-base" x="25" y="30" width="50" height="40" rx="5" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 30 50 H 40 M 60 50 H 70" /><path className="icon-nature-base" d="M 35 20 V 30 M 65 20 V 30" /><circle className="icon-nature-energia" cx="35" cy="15" r="3" /><circle className="icon-nature-energia" cx="65" cy="15" r="3" /></IconBase>;
export const IconPauseCircle = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="50" cy="50" r="40" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 40 35 V 65 M 60 35 V 65" style={{strokeWidth: 4}} /></IconBase>;
export const IconPlayCircle = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="50" cy="50" r="40" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 40 35 L 65 50 L 40 65 V 35" style={{strokeWidth: 4, fill: "none"}} /></IconBase>;
export const IconStopCircle = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="50" cy="50" r="40" style={SHAPE_STYLE(props.ativo)}/><rect className="icon-nature-energia" x="35" y="35" width="30" height="30" rx="2" style={{strokeWidth: 4, fill: "none"}} /></IconBase>;
export const IconCircle = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="50" cy="50" r="40" style={SHAPE_STYLE(props.ativo)}/></IconBase>;
export const IconAlertTriangle = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 50 15 L 15 80 H 85 Z" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-energia" d="M 50 40 V 60 M 50 70 V 71" /></IconBase>;
export const IconGripVertical = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="9" cy="5" r="1" fill="currentColor" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="9" cy="19" r="1" fill="currentColor" /><circle cx="15" cy="5" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="19" r="1" fill="currentColor" /></IconBase>;
export const IconGripHorizontal = (props) => <IconBase {...props}><circle className="icon-nature-base" cx="30" cy="35" r="4" style={{fill:"currentColor"}}/><circle className="icon-nature-base" cx="50" cy="35" r="4" style={{fill:"currentColor"}}/><circle className="icon-nature-base" cx="70" cy="35" r="4" style={{fill:"currentColor"}}/><circle className="icon-nature-base" cx="30" cy="65" r="4" style={{fill:"currentColor"}}/><circle className="icon-nature-base" cx="50" cy="65" r="4" style={{fill:"currentColor"}}/><circle className="icon-nature-base" cx="70" cy="65" r="4" style={{fill:"currentColor"}}/></IconBase>;
export const IconList = (props) => <IconBase {...props}><path className="icon-nature-base" d="M 30 30 H 80 M 30 50 H 80 M 30 70 H 80"/><circle className="icon-nature-energia" cx="15" cy="30" r="3"/><circle className="icon-nature-energia" cx="15" cy="50" r="3"/><circle className="icon-nature-energia" cx="15" cy="70" r="3"/></IconBase>;
export const IconLayout = (props) => <IconBase {...props}><rect className="icon-nature-base" x="10" y="10" width="80" height="80" rx="5" style={SHAPE_STYLE(props.ativo)}/><path className="icon-nature-base" d="M 40 10 V 90"/></IconBase>;

// ==================================================================================
// 5. NOVAS ADIÇÕES (V10) - Metáforas, Canvas e UI
// ==================================================================================
export const IconEdit = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><TechPath d="m15 5 4 4" /></IconBase>;
export const IconCode = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath points="16 18 22 12 16 6" /><TechPath points="8 6 2 12 8 18" /></IconBase>;
export const IconGitBranch = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M6 3v12" /><circle cx="18" cy="6" r="3" stroke="currentColor" fill="none" strokeWidth="1.5" /><circle cx="6" cy="18" r="3" stroke="currentColor" fill="none" strokeWidth="1.5" /><TechPath d="M18 9a9 9 0 0 1-9 9" /></IconBase>;
export const IconTerminal = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="m4 17 6-6-6-6" /><TechPath d="M12 19h8" /><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/></IconBase>;
export const IconDatabase = (props) => <IconBase viewBox="0 0 24 24" {...props}><ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" /><TechPath d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><TechPath d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></IconBase>;
export const IconCpu = (props) => <IconBase viewBox="0 0 24 24" {...props}><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><TechPath d="M9 1v3" /><TechPath d="M15 1v3" /><TechPath d="M9 20v3" /><TechPath d="M15 20v3" /><TechPath d="M20 9h3" /><TechPath d="M20 15h3" /><TechPath d="M1 9h3" /><TechPath d="M1 15h3" /></IconBase>;
export const IconKey = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="7.5" cy="15.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><TechPath d="m21 2-9.6 9.6" /><TechPath d="m15.5 7.5 3 3L22 7l-3-3" /></IconBase>;
export const IconServer = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M2 2h20v8H2z" /><TechPath d="M2 14h20v8H2z" /><TechPath d="M6 6h.01" /><TechPath d="M6 18h.01" /></IconBase>;
export const IconDiff = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><TechPath points="14 2 14 8 20 8" /><TechPath d="M9 15h6" /><TechPath d="M12 12v6" /></IconBase>;
export const IconBug = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M8 6h8v14H8z" /><TechPath d="m19 7-3 2" /><TechPath d="m5 7 3 2" /><TechPath d="m19 19-3-2" /><TechPath d="m5 19 3-2" /><TechPath d="M20 13h-4" /><TechPath d="M4 13h4" /><TechPath d="m10 4 1 2" /><TechPath d="m14 4-1 2" /></IconBase>;
export const IconBriefcase = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><TechPath d="M2 7h20v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" /><TechPath d="M12 12h.01" strokeWidth="3" /></IconBase>;
export const IconBox = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><TechPath d="M3.3 7l8.7 5 8.7-5" /><TechPath d="M12 22V12" /></IconBase>;
export const IconFolderPlus = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /><TechPath d="M12 10v6" /><TechPath d="M9 13h6" /></IconBase>;
export const IconFilePlus = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><TechPath points="14 2 14 8 20 8" /><TechPath d="M12 12v6" /><TechPath d="M9 15h6" /></IconBase>;
export const IconRefreshCcw = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M3 2v6h6" /><TechPath d="M21 12A9 9 0 0 0 6 5.3L3 8" /><TechPath d="M21 22v-6h-6" /><TechPath d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /></IconBase>;
export const IconPlay = (props) => <IconBase viewBox="0 0 24 24" {...props}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" /></IconBase>;
export const IconPause = (props) => <IconBase viewBox="0 0 24 24" {...props}><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" /><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" /></IconBase>;
export const IconVideo = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" /></IconBase>;
export const IconImage = (props) => <IconBase viewBox="0 0 24 24" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><TechPath d="m21 15-5-5L5 21" /></IconBase>;
export const IconDollarSign = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M12 1v22" /><TechPath d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></IconBase>;
export const IconMapPin = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></IconBase>;
export const IconTrash2 = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M3 6h18" /><TechPath d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><TechPath d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><TechPath d="M10 11v6" /><TechPath d="M14 11v6" /></IconBase>;
export const IconMenu = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M4 12h16" /><TechPath d="M4 6h16" /><TechPath d="M4 18h16" /></IconBase>;
export const IconMessageSquare = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></IconBase>;
export const IconMaximize = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M8 3H5a2 2 0 0 0-2 2v3" /><TechPath d="M21 8V5a2 2 0 0 0-2-2h-3" /><TechPath d="M3 16v3a2 2 0 0 0 2 2h3" /><TechPath d="M16 21h3a2 2 0 0 0 2-2v-3" /></IconBase>;
export const IconMinimize = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M8 3v3a2 2 0 0 1-2 2H3" /><TechPath d="M21 8h-3a2 2 0 0 1-2-2V3" /><TechPath d="M3 16h3a2 2 0 0 1 2 2v3" /><TechPath d="M16 21v-3a2 2 0 0 1 2-2h3" /></IconBase>;
export const IconVolume2 = (props) => <IconBase viewBox="0 0 24 24" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></IconBase>;
export const IconVolumeX = (props) => <IconBase viewBox="0 0 24 24" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></IconBase>;
export const IconUpload = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><TechPath d="M17 8l-5-5-5 5" /><TechPath d="M12 3v12" /></IconBase>;
export const IconAlertCircle = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" /><TechPath d="M12 8v4" /><TechPath d="M12 16h.01" /></IconBase>;
export const IconBookOpen = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><TechPath d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></IconBase>;
export const IconShield = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></IconBase>;
export const IconCrown = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></IconBase>;
export const IconX = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M18 6 6 18" /><TechPath d="m6 6 12 12" /></IconBase>;
export const IconSave = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><TechPath d="M17 21v-8H7v8" /><TechPath d="M7 3v5h8" /></IconBase>;
export const IconCheckCircle = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><TechPath d="M22 4 12 14.01 9 11.01" /></IconBase>;
export const IconCalendar = (props) => <IconBase viewBox="0 0 24 24" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><TechPath d="M16 2v4" /><TechPath d="M8 2v4" /><TechPath d="M3 10h18" /></IconBase>;
export const IconZoomIn = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><TechPath d="m21 21-4.3-4.3" /><TechPath d="M11 8v6" /><TechPath d="M8 11h6" /></IconBase>;
export const IconZoomOut = (props) => <IconBase viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><TechPath d="m21 21-4.3-4.3" /><TechPath d="M8 11h6" /></IconBase>;
export const IconBrainCircuit = (props) => <IconBase viewBox="0 0 24 24" {...props}><TechPath d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><TechPath d="M9 13a4.5 4.5 0 0 0 3-4" /><TechPath d="M6.003 5.125A3 3 0 0 0 10.407 8" /><TechPath d="M12 13a3 3 0 1 0 0-6" /></IconBase>;

// ==================================================================================
// 6. MAPA DOS NOMES (Aliases - resolveIcon e uso interno)
// ==================================================================================

export const PranaIcons = {
  // Arcanos
  Volume2: IconVolume2,
  VolumeX: IconVolumeX,
  Dashboard: IconDashboard, Chat: IconChat, Sankalpa: IconSankalpa,
  Cronos: IconCronos, Cosmos: IconCosmos, Nexus: IconNexus,
  Diario: IconDiario, Papyrus: IconPapyrus, Neural: IconNeural,
  Coletivo: IconColetivo, Matrix: IconMatrix, Flux: IconFlux,
  Settings: IconSettings, Glass: IconGlass,
  
  // UI & Utils
  Vision: IconVision, Search: IconSearch, 
  Soul: IconSoul, User: IconSoul,
  Alert: IconAlert, Notification: IconAlert, Bell: IconAlert,
  Craft: IconCraft, Edit: IconCraft, Edit2: IconCraft, Pen: IconCraft,
  Growth: IconGrowth, Add: IconGrowth, Plus: IconPlus,
  Void: IconVoid, Delete: IconVoid, Trash: IconVoid, Trash2: IconVoid,
  Layers: IconLayers, Menu: IconMenu, // Agora aponta para IconMenu
  Keep: IconKeep, Save: IconSave, // Agora aponta para IconSave
  Done: IconDone, Success: IconDone,
  Block: IconBlock, Close: IconBlock, X: IconX, // Agora aponta para IconX
  
  // Auth & Controls
  Loader: IconLoader2, Loader2: IconLoader2, RefreshCcw: IconLoader2,
  Mail: IconMail, Lock: IconLock, Eye: IconEye, EyeOff: IconEyeOff,
  LogIn: IconLogIn, LogOut: IconLogOut, UserPlus: IconUserPlus,
  
  // Controls & Lists
  Filter: IconFilter, Check: IconCheck, CheckSquare: IconCheckSquare, Link: IconLink,
  ChevronRight: IconChevronRight, ChevronLeft: IconChevronLeft,
  ChevronDown: IconChevronDown, ChevronUp: IconChevronUp,
  More: IconMoreHorizontal, MoreHorizontal: IconMoreHorizontal, MoreVertical: IconMoreHorizontal,
  ArrowRight: IconArrowRight, ArrowLeft: IconArrowLeft,
  Copy: IconCopy, Paperclip: IconPaperclip, Bot: IconBot,
  GripVertical: IconGripVertical, GripHorizontal: IconGripHorizontal, 
  List: IconList, Layout: IconLayout,
  PauseCircle: IconPauseCircle, PlayCircle: IconPlayCircle, StopCircle: IconStopCircle,
  Circle: IconCircle, AlertTriangle: IconAlertTriangle,
  File: IconFile, FileText: IconFileText, Folder: IconLayers, 
  Home: IconHome, Star: IconStar, Sun: IconSun,
  Pin: IconPin, Send: IconSend,

  // Editor (Novos)
  Bold: IconBold, Italic: IconItalic, Quote: IconQuote, Code: IconCode, Hash: IconHash,
  H1: IconH1, H2: IconH2, Lightbulb: IconLightbulb, Feather: IconFeather,
  Kanban: IconKanban, Map: IconMap, Cloud: IconCloud,
  
  // Aliases de segurança (Icon...)
  IconX: IconX, IconCheck: IconCheck, IconUser: IconSoul,
  IconLoader2: IconLoader2, IconTrash: IconVoid, IconEdit: IconCraft,
  IconSearch: IconSearch, IconMenu: IconMenu, IconBell: IconAlert,
  IconSave: IconSave, IconPlus: IconPlus, IconMinus: IconMinus,
  IconChevronRight: IconChevronRight, IconFile: IconFile, IconHome: IconHome,
  
  // Elements
  Lua: IconLua, Rio: IconRio, Fogo: IconFogo
};

// ==================================================================================
// 6.5 ALIASES HOLÍSTICOS (Contexto Energético)
// ==================================================================================

export const IconFlame = IconFogo;        // Energia (usando Fogo)
export const IconHeart = IconSoul;        // Mood (usando Soul/Coração)
export const IconTag = IconHash;          // Tags (usando Hash como etiqueta)

// ==================================================================================
// 7. CAMADA DE COMPATIBILIDADE LEGADA (Exports Nomeados)
// ==================================================================================

export const X = IconX; // Modificado para usar o componente real
export const Check = IconCheck;
export const ChevronRight = IconChevronRight;
export const ChevronLeft = IconChevronLeft;
export const ChevronDown = IconChevronDown;
export const ChevronUp = IconChevronUp;
export const User = IconSoul;
export const Bell = IconAlert;
export const Search = IconSearch;
export const Menu = IconMenu; // Modificado
export const Trash = IconVoid;
export const Trash2 = IconTrash2; // Modificado
export const Edit = IconCraft;
export const Edit2 = IconCraft;
export const Plus = IconPlus;
export const Minus = IconMinus;
export const Save = IconSave; // Modificado
export const Filter = IconFilter;
export const Link = IconLink;
export const MoreHorizontal = IconMoreHorizontal;
export const MoreVertical = IconMoreHorizontal;
export const ArrowRight = IconArrowRight;
export const ArrowLeft = IconArrowLeft;
export const Copy = IconCopy;
export const Paperclip = IconPaperclip;
export const Bot = IconBot;
export const CheckSquare = IconCheckSquare;
export const Loader = IconLoader2;
export const Loader2 = IconLoader2;
export const RefreshCcw = IconRefreshCcw; // Modificado
export const Mail = IconMail;
export const Lock = IconLock;
export const Eye = IconEye;
export const EyeOff = IconEyeOff;
export const LogIn = IconLogIn;
export const LogOut = IconLogOut;
export const UserPlus = IconUserPlus;
export const Calendar = IconCalendar; // Modificado
export const CalendarDays = IconCalendar;
export const Clock = IconCronos; 
export const Tag = IconFlux;
export const Flag = IconSankalpa; 
export const Hash = IconHash; 
export const GripHorizontal = IconGripHorizontal;
export const List = IconList;
export const Layout = IconLayout;
export const PauseCircle = IconPauseCircle;
export const PlayCircle = IconPlayCircle;
export const StopCircle = IconStopCircle;
export const Circle = IconCircle;
export const AlertTriangle = IconAlertTriangle;
export const AlertCircle = IconAlertCircle; // Modificado
export const HelpCircle = IconAlert; 
export const LayoutDashboard = IconDashboard; 
export const Folder = IconLayers;
export const FolderOpen = IconLayers;
export const Briefcase = IconBriefcase; // Modificado
export const Target = IconSankalpa;
export const Globe = IconCosmos;
export const Map = IconMap; // Atualizado para usar o novo ícone técnico
export const File = IconFile;
export const FileText = IconFileText;
export const Image = IconImage; // Modificado
export const Upload = IconUpload; // Modificado
export const Download = IconLink;
export const Zap = IconGrowth;
export const Battery = IconGrowth;
export const Activity = IconFlux;
export const Send = IconSend;
export const Pin = IconMapPin; // Modificado
export const Home = IconHome;
export const Star = IconStar;
export const Sun = IconSun;
export const Moon = IconLua;
export const XCircle = IconBlock;
export const CheckCircle = IconCheckCircle; // Modificado
export const CheckCircle2 = IconCheckCircle;
export const Info = IconAlert;
export const AlignLeft = IconList;
export const ListOrdered = IconList;
export const Bold = IconBold;
export const Italic = IconItalic;
export const Underline = IconCraft;
export const Layers = IconLayers;
export const Settings = IconSettings;
export const LayoutGrid = IconLayout;
export const Share2 = IconLink;
export const Network = IconNexus;
export const Lightbulb = IconLightbulb;
export const Feather = IconFeather;
export const Cloud = IconCloud;

// Misc small aliases
export const IconClose = IconBlock;
export const IconMountain = IconDiario;
export const IconRiver = IconRio;
export const IconLogoMark = IconVision;
export const IconWind = IconFlux;

export const ExternalLink = IconLink;
export const NotebookPen = IconPapyrus;
export const ShieldCheck = IconDone;

// [REMOVIDO DUPLICATAS DAQUI]
export const IconTrash = IconVoid;
export const IconUser = IconSoul;
export const IconBell = IconAlert;

export const IconTarget = IconSankalpa;
export const IconSparkles = IconVision;

export const Maximize2 = IconMaximize; // Modificado
export const Minimize2 = IconMinimize; // Modificado

export const Workflow = IconFlux;
export const IconWorkflow = Workflow;
export const IconKanbanSquare = IconLayers;
export const IconTableProperties = IconList;
export const IconNetwork = IconNexus;

// Aliases Seguros (Usados pelas Views)
export const IconFolder = IconLayers;
export const IconUsers = IconColetivo;
export const IconActivity = IconFlux;
export const IconMoreVertical = IconMoreHorizontal;
export const FolderPlus = IconFolderPlus;

// ==================================================================================
// 9. O ORÁCULO
// ==================================================================================

export const resolveIcon = (name) => {
  if (!name) return IconVoid;
  const key = Object.keys(PranaIcons).find(k => k.toLowerCase() === name.toLowerCase());
  return PranaIcons[key] || IconVoid; 
};

export const IconFolderOpen = (props) => (
  <IconBase viewBox="0 0 24 24" {...props}>
    <TechPath d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
  </IconBase>
);

export default PranaIcons;