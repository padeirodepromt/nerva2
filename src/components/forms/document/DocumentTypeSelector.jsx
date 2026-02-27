/* src/components/forms/document/DocumentTypeSelector.jsx
   desc: Seletor de tipo de documento (Note, Diary, Agreement, etc)
         com suporte a 3 idiomas.
*/

import { useTranslations } from '@/components/LanguageProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DOCUMENT_TYPES = [
  { value: 'note', key: 'doc_type_note' },
  { value: 'diary', key: 'doc_type_diary' },
  { value: 'agreement', key: 'doc_type_agreement' },
  { value: 'manifest', key: 'doc_type_manifest' },
  { value: 'guide', key: 'doc_type_guide' },
  { value: 'other', key: 'doc_type_other' },
];

export const DocumentTypeSelector = ({ value, onChange }) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-purple-100">
        {t('doc_type_label')}
      </label>
      <Select value={value || 'note'} onValueChange={onChange}>
        <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-purple-950 border-purple-500/30">
          {DOCUMENT_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {t(type.key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
