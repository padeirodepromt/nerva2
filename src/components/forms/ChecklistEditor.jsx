import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "@/components/icons/PranaLandscapeIcons";
import { generateId } from "@/utils/id";

export default function ChecklistEditor({ items = [], onChange, placeholder = "Novo item..." }) {
  const [text, setText] = useState("");

  const addItem = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...(items || []), { id: generateId('chk'), text: t, done: false }]);
    setText("");
  };

  const toggle = (i) => {
    const next = (items || []).map((it, idx) => idx === i ? { ...it, done: !it.done } : it);
    onChange(next);
  };

  const remove = (i) => {
    const next = (items || []).filter((_, idx) => idx !== i);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())} />
        <Button type="button" onClick={addItem}><Plus className="w-4 h-4" /></Button>
      </div>
      <div className="space-y-2">
        {(items || []).map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox checked={!!it.done} onCheckedChange={() => toggle(i)} />
            <span className={`flex-1 ${it.done ? 'line-through opacity-60' : ''}`}>{it.text}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}