import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ENERGY_TAGS } from '@/utils/energy';

export default function EnergyTagSelector({ selectedTags = [], onChange }) {
  const handleAddTag = (tagId) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const getTagInfo = (tagId) => ENERGY_TAGS.find(tag => tag.id === tagId);

  const availableTags = ENERGY_TAGS.filter(tag => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium opacity-80">Energia da Tarefa</label>
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tagId => {
          const tagInfo = getTagInfo(tagId);
          if (!tagInfo) return null;
          
          return (
            <Badge 
              key={tagId}
              className="flex items-center gap-1 px-2 py-1"
              style={{ 
                backgroundColor: `${tagInfo.color}20`, 
                borderColor: tagInfo.color,
                color: tagInfo.color
              }}
            >
              {tagInfo.label}
              <button
                onClick={() => handleRemoveTag(tagId)}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
        
        {availableTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                <Plus className="w-3 h-3 mr-1" />
                Energia
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 glass-effect p-3">
              <div className="grid grid-cols-2 gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag.id)}
                    className="p-2 rounded text-xs text-left hover:bg-white/5 transition-colors"
                    style={{ borderLeft: `3px solid ${tag.color}` }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <p className="text-xs opacity-60">
        Tags de energia ajudam a IA a sugerir tarefas alinhadas com seu estado atual.
      </p>
    </div>
  );
}