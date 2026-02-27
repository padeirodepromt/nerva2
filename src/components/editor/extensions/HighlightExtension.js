/**
 * src/components/editor/extensions/HighlightExtension.js
 * Extensão TipTap para background highlights
 */

import { Mark } from '@tiptap/core';

export const HighlightExtension = Mark.create({
  name: 'highlight',
  addOptions() {
    return {
      multicolor: true,
    };
  },
  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (element) => {
          const colorClass = element.className.match(/highlight-(\w+)/)?.[1] || 'yellow';
          return { color: colorClass };
        },
        renderHTML: (attributes) => {
          return {
            class: `highlight-${attributes.color}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'mark',
        getAttrs: (element) => {
          const colorClass = element.className.match(/highlight-(\w+)/)?.[1] || 'yellow';
          return { color: colorClass };
        },
      },
    ];
  },
  renderHTML({ attributes }) {
    return ['mark', { class: `highlight-${attributes.color}` }, 0];
  },
  addCommands() {
    return {
      setHighlight:
        (color = 'yellow') =>
        ({ commands }) => {
          return commands.setMark(this.name, { color });
        },
      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.setHighlight(),
    };
  },
});

// Cores de highlight
export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: 'yellow', bg: '#fef08a', border: '#facc15' },
  { name: 'Pink', value: 'pink', bg: '#fecdd3', border: '#f43f5e' },
  { name: 'Green', value: 'green', bg: '#dcfce7', border: '#22c55e' },
  { name: 'Blue', value: 'blue', bg: '#dbeafe', border: '#3b82f6' },
  { name: 'Purple', value: 'purple', bg: '#f3e8ff', border: '#a855f7' },
];

export default HighlightExtension;
