/**
 * src/components/editor/extensions/CodeBlockExtension.js
 * Extensão TipTap para Code Blocks com syntax highlighting
 */

import { Node } from '@tiptap/core';

export const CodeBlockExtension = Node.create({
  name: 'codeBlock',
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      language: {
        default: 'javascript',
        parseHTML: (element) => {
          const lang = element.querySelector('code')?.className.match(/language-(\w+)/)?.[1];
          return lang || 'javascript';
        },
        renderHTML: (attrs) => ({
          'data-language': attrs.language,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || 'javascript';
    
    return [
      'pre',
      {
        ...HTMLAttributes,
        class: `hljs language-${language} bg-gray-950 rounded-lg p-4 overflow-x-auto`,
        'data-language': language,
      },
      ['code', { class: `language-${language}` }, 0],
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
      Tab: () => this.editor.commands.insertContent('\t'),
    };
  },

  addCommands() {
    return {
      setCodeBlock: (attrs) => ({ commands }) =>
        commands.setNode(this.name, attrs),
      toggleCodeBlock: (attrs) => ({ commands }) =>
        commands.toggleNode(this.name, 'paragraph', attrs),
      setCodeBlockLanguage: (language) => ({ commands }) =>
        commands.updateAttributes(this.name, { language }),
    };
  },

  addInputRules() {
    return [];
  },
});

export default CodeBlockExtension;
