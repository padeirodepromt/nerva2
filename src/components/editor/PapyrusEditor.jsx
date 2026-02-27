/* src/components/forms/templates/PapyrusEditor.jsx
   desc: O Motor de Escrita V1.1 (Fix: Extensions).
   fix: Adição das extensões lógicas de Bubble e Floating Menu.
*/
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { FloatingMenu } from '@tiptap/extension-floating-menu';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';

// NEW: Extensões melhoradas do editor
import CodeBlockExtension from './extensions/CodeBlockExtension';
import ColorExtension from './extensions/ColorExtension';
import HighlightExtension from './extensions/HighlightExtension';
import SlashCommandExtension from './extensions/SlashCommandExtension';

import { 
    IconBold, IconItalic, IconH1, IconH2, IconList, IconQuote, IconCode 
} from '@/components/icons/PranaLandscapeIcons';

export default function PapyrusEditor({ initialContent, onUpdate, isReadOnly = false }) {
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Desabilitar o padrão para usar nosso customizado
            }),
            Typography,
            Placeholder.configure({
                placeholder: 'Comece a escrever seu legado... (Digite / para comandos)',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground/30 before:float-left before:pointer-events-none',
            }),
            // NEW: Extensões melhoradas
            CodeBlockExtension,     // Syntax highlighting + line numbers
            ColorExtension,         // Text color support
            HighlightExtension,     // Background highlight
            SlashCommandExtension,  // Slash commands menu
        ],
        content: initialContent || '',
        editable: !isReadOnly,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdate(html); // Propaga a mudança para o pai (autosave)
        },
        editorProps: {
            attributes: {
                // AQUI MORA A MÁGICA WABI-SABI (Tipografia Editorial)
                class: 'prose prose-lg prose-invert max-w-none focus:outline-none font-serif leading-relaxed text-foreground/90 prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-2xl prose-blockquote:border-l-[rgb(var(--accent-rgb))] prose-blockquote:text-muted-foreground prose-blockquote:italic',
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="relative w-full min-h-[500px]">
            
            {/* 1. BUBBLE MENU (Aparece ao selecionar texto) */}
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 p-1 rounded-lg bg-card border border-white/10 shadow-xl backdrop-blur-md overflow-x-auto max-w-[90vw]">
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleBold().run()} 
                        isActive={editor.isActive('bold')} 
                        icon={<IconBold className="w-4 h-4"/>} 
                        title="Bold"
                    />
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleItalic().run()} 
                        isActive={editor.isActive('italic')} 
                        icon={<IconItalic className="w-4 h-4"/>} 
                        title="Italic"
                    />
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                        isActive={editor.isActive('heading', { level: 1 })} 
                        icon={<IconH1 className="w-4 h-4"/>} 
                        title="Heading 1"
                    />
                      <MenuButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                        isActive={editor.isActive('heading', { level: 2 })} 
                        icon={<IconH2 className="w-4 h-4"/>} 
                        title="Heading 2"
                    />
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                        isActive={editor.isActive('codeBlock')} 
                        icon={<IconCode className="w-4 h-4"/>} 
                        title="Code Block"
                    />
                    
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    
                    {/* NEW: Color Picker */}
                    <ColorPickerMenu editor={editor} />
                    
                    {/* NEW: Highlight Picker */}
                    <HighlightPickerMenu editor={editor} />
                </BubbleMenu>
            )}

            {/* 2. FLOATING MENU (Aparece em linhas vazias) */}
            {editor && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 -ml-6">
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-[#1c1917]/80 border border-white/5 backdrop-blur-sm opacity-50 hover:opacity-100 transition-opacity">
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                            isActive={editor.isActive('heading', { level: 1 })} 
                            icon={<IconH1 className="w-3 h-3"/>} 
                        />
                         <MenuButton 
                            onClick={() => editor.chain().focus().toggleBulletList().run()} 
                            isActive={editor.isActive('bulletList')} 
                            icon={<IconList className="w-3 h-3"/>} 
                        />
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                            isActive={editor.isActive('blockquote')} 
                            icon={<IconQuote className="w-3 h-3"/>} 
                        />
                    </div>
                </FloatingMenu>
            )}

            {/* 3. A ÁREA DE ESCRITA */}
            <EditorContent editor={editor} className="min-h-[60vh]" />
            
        </div>
    );
}

// Subcomponente de Botão para limpar o código principal
const MenuButton = ({ onClick, isActive, icon, title }) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-1.5 rounded-md transition-all ${
            isActive 
            ? 'bg-[rgb(var(--accent-rgb))] text-white shadow-[0_0_10px_rgba(var(--accent-rgb),0.4)]' 
            : 'text-muted-foreground hover:text-white hover:bg-white/10'
        }`}
    >
        {icon}
    </button>
);

// NEW: Color Picker Menu
const ColorPickerMenu = ({ editor }) => {
    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Reset', value: null },
    ];

    return (
        <div className="flex items-center gap-0.5 px-1">
            {colors.map((color) => (
                <button
                    key={color.name}
                    onClick={() => {
                        if (color.value === null) {
                            editor.chain().focus().unsetColor().run();
                        } else {
                            editor.chain().focus().setColor(color.value).run();
                        }
                    }}
                    title={`Color: ${color.name}`}
                    className={`w-5 h-5 rounded-md border transition-all ${
                        color.value === null 
                            ? 'bg-white/10 border-white/20 hover:border-white/40'
                            : 'border-white/20 hover:border-white/40'
                    }`}
                    style={color.value ? { backgroundColor: color.value } : {}}
                />
            ))}
        </div>
    );
};

// NEW: Highlight Picker Menu
const HighlightPickerMenu = ({ editor }) => {
    const highlights = [
        { name: 'Yellow', value: '#fef08a' },
        { name: 'Pink', value: '#fecdd3' },
        { name: 'Green', value: '#dcfce7' },
        { name: 'Blue', value: '#dbeafe' },
        { name: 'Purple', value: '#f3e8ff' },
        { name: 'Reset', value: null },
    ];

    return (
        <div className="flex items-center gap-0.5 px-1">
            <span className="text-xs text-white/40 mr-1">✏️</span>
            {highlights.map((hl) => (
                <button
                    key={hl.name}
                    onClick={() => {
                        if (hl.value === null) {
                            editor.chain().focus().unsetHighlight().run();
                        } else {
                            editor.chain().focus().setHighlight({ color: hl.value }).run();
                        }
                    }}
                    title={`Highlight: ${hl.name}`}
                    className={`w-5 h-5 rounded-md border transition-all ${
                        hl.value === null 
                            ? 'bg-white/10 border-white/20 hover:border-white/40'
                            : 'border-white/20 hover:border-white/40'
                    }`}
                    style={hl.value ? { backgroundColor: hl.value } : {}}
                />
            ))}
        </div>
    );
};