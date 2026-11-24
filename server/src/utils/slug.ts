/** Turns a title into a web-address-friendly text: "Royal Wedding!" becomes "royal-wedding". */
export function slugify(text: string): string {
  const slug = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '');
  return slug || 'event'; // e.g. a title with no Latin letters
}