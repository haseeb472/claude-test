// Shape, colour and type shared by every input, select and textarea. Padding is
// left to each control. The border turns red when the field has an error; the
// focus ring is drawn inside the border so nothing is clipped or shifted.
export function fieldClasses(hasError: boolean) {
  return [
    'block w-full rounded-lg border bg-surface text-field-sm text-ink transition duration-200 placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-inset md:bg-white md:text-field',
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-line focus:border-brand-blue focus:ring-brand-blue',
  ].join(' ')
}
