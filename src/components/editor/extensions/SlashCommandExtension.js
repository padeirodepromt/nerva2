/**
 * src/components/editor/extensions/SlashCommandExtension.js
 * Extensão TipTap para / commands
 * Menu fuzzy-searchable para inserir elementos
 */

import { Extension } from '@tiptap/core';

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',
  addOptions() {
    return {
      suggestion: {
        items: ({ query }) => [
          {
            title: 'Heading 1',
            description: 'Grande título',
            searchTerms: ['heading', 'h1', 'title'],
            icon: 'H1',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 1 })
                .run();
            },
          },
          {
            title: 'Heading 2',
            description: 'Subtítulo',
            searchTerms: ['heading', 'h2', 'subtitle'],
            icon: 'H2',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 2 })
                .run();
            },
          },
          {
            title: 'Heading 3',
            description: 'Pequeno título',
            searchTerms: ['heading', 'h3'],
            icon: 'H3',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 3 })
                .run();
            },
          },
          {
            title: 'Code Block',
            description: 'Bloco de código com syntax',
            searchTerms: ['code', 'block', 'script'],
            icon: '{}',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleCodeBlock()
                .run();
            },
          },
          {
            title: 'Quote',
            description: 'Citação ou pensamento',
            searchTerms: ['quote', 'blockquote', 'cite'],
            icon: '"',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBlockquote()
                .run();
            },
          },
          {
            title: 'Bullet List',
            description: 'Lista com bullets',
            searchTerms: ['list', 'bullet', 'item'],
            icon: '•',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
            },
          },
          {
            title: 'Numbered List',
            description: 'Lista numerada',
            searchTerms: ['list', 'numbered', 'ordered', 'item'],
            icon: '1.',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
            },
          },
          {
            title: 'Horizontal Line',
            description: 'Separador',
            searchTerms: ['line', 'break', 'separator', 'divider'],
            icon: '—',
            command: ({ editor, range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHorizontalRule()
                .run();
            },
          },
        ]
          .filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.searchTerms.some((term) =>
              term.includes(query.toLowerCase())
            )
          )
          .slice(0, 10),
      },
    };
  },

  addProseMirrorPlugins() {
    const { suggestion } = this.options;

    return [
      // Aqui entraria plugin de sugestão real (tipando-tippy)
      // Por enquanto, configuração básica
    ];
  },
});

export default SlashCommandExtension;
