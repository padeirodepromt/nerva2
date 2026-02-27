import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "@/components/icons/PranaLandscapeIcons";
import { cn } from "@/lib/utils";

export default function MultiSelectFilter({ options, selectedValues, onSelectionChange, placeholder, className }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelectedValues);
  };

  const getSelectedOptions = () => {
    return options.filter(option => selectedValues.includes(option.value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-auto justify-between glass-effect border-0 min-h-[36px] h-auto", className)}
        >
          <div className="flex gap-1 flex-wrap items-center">
            {getSelectedOptions().length > 0 ? (
                getSelectedOptions().map(option => (
                    <Badge
                        key={option.value}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal bg-white/10"
                        style={option.color ? { borderColor: option.color, color: 'rgb(var(--text-primary))' } : {}}
                    >
                        {option.color && <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: option.color }}></div>}
                        {option.label}
                    </Badge>
                ))
            ) : (
                <span className="text-sm opacity-70">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 glass-effect border-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    style={{ paddingLeft: `${1 + (option.depth || 0) * 1.5}rem` }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.color && <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: option.color }}></div>}
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}