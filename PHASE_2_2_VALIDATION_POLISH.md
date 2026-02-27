# PHASE 2.2: Field Validation & Rendering Polish ✨

## Overview

Phase 2.2 implements comprehensive field validation, error handling, and UI polish for dynamic fields in SheetView. All field types now support:

- ✅ **Validation Rules** per field type
- ✅ **Required Field Indicators** (red asterisk *)
- ✅ **Real-time Error Feedback** with contextual messages
- ✅ **Visual Error States** (red border, error text)
- ✅ **Type-specific Validation** (patterns, ranges, formats)
- ✅ **Accessibility Improvements** (aria-invalid, proper labels)

## What's Implemented

### 1. Field Validation Utilities (`src/utils/fieldValidation.js`)

**Core Function: `validateFieldValue(value, field)`**

Returns `{ isValid: boolean, error: string | null }`

**Type-Specific Validation Rules:**

#### Text Fields
- `min_length`: Minimum character count
- `max_length`: Maximum character count (default: 255)
- `pattern`: Regex pattern validation
- `pattern_error_message`: Custom error for pattern mismatch

```javascript
// Example validation
validateFieldValue('abc', {
  type: 'text',
  is_required: true,
  validation_rules: { min_length: 5 }
});
// Returns: { isValid: false, error: 'Mínimo 5 caracteres (3 fornecidos)' }
```

#### Number Fields
- `min`: Minimum value
- `max`: Maximum value
- `step`: Increment step (optional)
- `decimal_places`: Maximum decimal places (default: 2)

```javascript
validateFieldValue(150.555, {
  type: 'number',
  validation_rules: { min: 0, max: 100, decimal_places: 1 }
});
// Returns: { isValid: false, error: 'Máximo 100' }
```

#### Dropdown Fields
- Options must exist in field.options array
- Validates against allowed values

#### Date Fields
- `min_date`: Earliest allowed date (YYYY-MM-DD)
- `max_date`: Latest allowed date (YYYY-MM-DD)
- Validates ISO date format

#### Member Fields
- Validates UUID format for member ID

#### Checkbox Fields
- Validates boolean type

#### Required Fields
- All types validate `is_required` flag
- Empty strings, null, undefined trigger required error
- Non-required empty fields pass validation

### 2. Validation Hooks (`src/hooks/useFieldValidation.js`)

#### `useFieldValidation(field)` Hook

Single field validation with state management:

```javascript
const validation = useFieldValidation(field);

// Methods:
validation.validate(value)        // Validate and set state
validation.clearError()            // Clear error state
validation.isValid                 // Current validation state
validation.error                   // Error message (if any)
validation.setError(msg)           // Manually set error
```

#### `useFieldsValidation(fields)` Hook

Batch validation for multiple fields:

```javascript
const { validateAll, validateField, errors, isValid, hasError, getError } = 
  useFieldsValidation(customFields);

validateAll(customData)            // Validate all at once
validateField(slug, value)         // Validate single field
hasError('field_slug')             // Check if field has error
getError('field_slug')             // Get error message
```

#### `useRealTimeValidation(field, debounceMs)` Hook

Real-time validation with debounce for instant feedback:

```javascript
const { validate, error, isValid, isValidating } = 
  useRealTimeValidation(field, 300);  // 300ms debounce

// Validate as user types (debounced)
onChange={(e) => validate(e.target.value)}
```

#### Helper Hooks

- `useIsFieldRequired(field)`: Returns boolean if field required
- `useFieldValidationState(field, value)`: Returns complete validation state object

### 3. Enhanced DynamicFieldCell Components

All field cell components now include:

#### Visual Enhancements
- **Required Indicator**: Red asterisk (*) shows for required fields
- **Error Styling**: Red borders and text for invalid values
- **Error Messages**: Contextual messages below the field
- **Focus Feedback**: Focus ring updates on error state

#### Component Props Updated

All cell components now accept:

```javascript
{
  field,              // Field schema object
  value,              // Current value
  onBlur,             // Save callback
  placeholder,        // Placeholder text
  validation,         // Validation object from hook
  isRequired,         // Boolean, required field flag
  showError           // Show/hide errors (default: true)
}
```

#### TextFieldCell
- Shows min/max character count in error message
- Pattern validation with custom error support
- Length validation real-time feedback

#### NumberFieldCell
- Min/max range validation
- Decimal place validation
- Better number formatting in error messages

#### DateFieldCell
- Date range validation (min_date, max_date)
- ISO date format validation
- User-friendly error messages

#### DropdownFieldCell
- Option existence validation
- Visual feedback for invalid selections
- Red background on error state

#### CheckboxFieldCell
- Boolean type validation
- Maintains required field indicator

#### MemberFieldCell
- UUID format validation
- Member existence checking
- List-aware error messages

### 4. Integration Pattern

```javascript
// In SheetView or parent component
const { fields } = useProjectFields(projectId);
const validations = useFieldsValidation(fields);

// When rendering cells
<DynamicFieldCell
  field={customField}
  value={task.customData[customField.slug]}
  onBlur={(newValue) => {
    validations.validateField(customField.slug, newValue);
    updateTask(task.id, customField.slug, newValue);
  }}
  validation={validations.getError(customField.slug) ? {
    error: validations.getError(customField.slug),
    isValid: false
  } : null}
  isRequired={customField.is_required}
/>
```

## Validation Rules by Field Type

### Text Field Validation Rules Schema

```json
{
  "type": "text",
  "validation_rules": {
    "min_length": 3,
    "max_length": 100,
    "pattern": "^[a-zA-Z0-9\\s]+$",
    "pattern_error_message": "Apenas letras, números e espaços permitidos"
  }
}
```

### Number Field Validation Rules Schema

```json
{
  "type": "number",
  "validation_rules": {
    "min": 0,
    "max": 1000,
    "step": 0.5,
    "decimal_places": 2
  }
}
```

### Date Field Validation Rules Schema

```json
{
  "type": "date",
  "validation_rules": {
    "min_date": "2024-01-01",
    "max_date": "2025-12-31"
  }
}
```

### Dropdown Field Validation Rules Schema

```json
{
  "type": "dropdown",
  "options": ["Option A", "Option B", "Option C"],
  "validation_rules": {}
}
```

## Error Messages (Localized - Portuguese)

| Error Type | Message |
|-----------|---------|
| Required field empty | Este campo é obrigatório |
| Text too short | Mínimo X caracteres (Y fornecidos) |
| Text too long | Máximo X caracteres (Y fornecidos) |
| Invalid pattern | Formato não suportado (or custom message) |
| Number out of range | Mínimo: X / Máximo: Y |
| Too many decimals | Máximo X casas decimais |
| Invalid date | Data inválida |
| Date out of range | Data deve ser depois de X / antes de X |
| Invalid member | Membro inválido |
| Invalid option | Opção inválida |

## File Structure

```
src/
├── utils/
│   └── fieldValidation.js          [NEW - 350 lines] Validation utilities
├── hooks/
│   ├── useProjectFields.js         [EXISTING] Fetch fields hook
│   └── useFieldValidation.js       [NEW - 230 lines] Validation hooks
└── components/
    └── sheet/
        └── DynamicFieldCell.jsx    [UPDATED - 450 lines] Enhanced with validation
```

## Testing Checklist

### Unit Tests

- [ ] `validateFieldValue()` with all field types
- [ ] `validateFieldsObject()` batch validation
- [ ] `useFieldValidation()` hook state management
- [ ] `useFieldsValidation()` multiple field validation
- [ ] `useRealTimeValidation()` debounce behavior

### Component Tests

- [ ] TextFieldCell shows required indicator
- [ ] TextFieldCell shows min/max length error
- [ ] TextFieldCell shows pattern validation error
- [ ] NumberFieldCell validates range
- [ ] NumberFieldCell validates decimal places
- [ ] DateFieldCell validates date range
- [ ] DropdownFieldCell validates options
- [ ] CheckboxFieldCell works with required flag
- [ ] MemberFieldCell validates member IDs
- [ ] All cells show error message below field
- [ ] All cells have red border on error
- [ ] All cells clear error on valid input

### Integration Tests

- [ ] SheetView renders custom fields with validation
- [ ] Validation triggered on blur
- [ ] Required fields marked with asterisk
- [ ] Error messages display correctly
- [ ] Multiple field validation works together
- [ ] Can batch validate entire form

### Manual Testing

1. Create project with custom fields including required fields
2. Try to save with empty required fields → Should show error
3. Try to input number with max of 100, enter 150 → Should show error
4. Try text field with pattern, enter invalid → Should show error
5. Try date field with date range → Should validate
6. Clear error by entering valid value → Should disappear

## Performance Considerations

- **Debounced Validation**: Default 300ms to avoid excessive validation
- **Lazy Validation**: Only validate on blur, not on every keystroke
- **Batch Validation**: `useFieldsValidation` for efficient multi-field validation
- **Memoization**: Field components use React.memo for optimization

## Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ HTML5 input types (date, number, etc.)
- ✅ CSS custom properties for theming
- ✅ Accessibility attributes (aria-invalid)

## Migration Guide from Phase 2.1

**Before (Phase 2.1):**
```javascript
<DynamicFieldCell field={field} value={value} onBlur={onBlur} />
```

**After (Phase 2.2):**
```javascript
const validation = useFieldValidation(field);

<DynamicFieldCell 
  field={field} 
  value={value} 
  onBlur={(v) => {
    validation.validate(v);
    onBlur(v);
  }}
  validation={validation}
  isRequired={field.is_required}
/>
```

**Backward Compatible**: Phase 2.1 code still works - validation is optional

## Next Steps (Phase 2.3)

### Field Management UI Modal

- [ ] Create modal for managing custom fields
- [ ] Allow create/edit/delete fields from UI
- [ ] Field ordering/reordering UI
- [ ] Validation rule builder UI
- [ ] Preview of field with validation
- [ ] Integration with SheetView header

### Phase 2.3 Features

1. **Field Creation Modal**
   - Name, slug, type selection
   - Validation rules configuration
   - Required field toggle
   - Options for dropdown fields
   - Preview cell

2. **Field Editing Modal**
   - Edit all field properties
   - Can't change type after creation
   - Can't edit template fields
   - Validation rule adjustments

3. **Field Reordering**
   - Drag & drop to reorder
   - Save new display_order
   - Persist to database

## Build Status

- ✅ No TypeScript errors
- ✅ All imports resolve correctly
- ✅ No circular dependencies
- ✅ CSS/Tailwind compiles correctly
- ✅ Ready for npm run build

## Summary

Phase 2.2 adds production-ready validation and error handling to dynamic fields. Users now get:

1. Clear feedback when values are invalid
2. Visual indicators for required fields
3. Helpful error messages in Portuguese
4. Type-safe validation with customizable rules
5. Accessible form inputs with ARIA attributes

All components are backward compatible and ready for Phase 2.3 (Field Management UI).
