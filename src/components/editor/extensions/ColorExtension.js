/**
 * src/components/editor/extensions/ColorExtension.js
 * Extensão TipTap para cores de texto
 */

import { Mark } from '@tiptap/core';

export const ColorExtension = Mark.create({
  name: 'textColor',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => {
          return {
            color: element.style.color.replace(/['"]+/g, ''),
          };
        },
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }
          return {
            style: `color: ${attributes.color}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[style*="color"]',
      },
    ];
  },
  renderHTML({ attributes }) {
    return ['span', { style: `color: ${attributes.color}` }, 0];
  },
  addCommands() {
    return {
      setColor:
        (color) =>
        ({ commands }) => {
          return commands.setMark(this.name, { color });
        },
      unsetColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

// Paleta de cores padrão
export const COLOR_PALETTE = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

export default ColorExtension;
