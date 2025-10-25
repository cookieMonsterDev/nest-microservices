export function html<T extends Record<string, any>>(strings: TemplateStringsArray, ...values) {
  const rawHTML = String.raw({ raw: strings }, ...values);
  return (params: T) =>
    rawHTML
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || `{{${key}}}`);
}

export function createSlug(title: string): string {
  return title
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

export function createRandomCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const characterslength = characters.length;

  if (length < 1) return characters.at(Math.floor(Math.random() * characterslength))!;

  return Array.from({ length }, () => characters.at(Math.floor(Math.random() * characterslength))).join('');
}

export function createSortQuery(sortBy?: string, sortOrder?: string) {
  if (!sortBy || !sortOrder) return {};

  return { [sortBy]: sortOrder };
}

export function createSearchQuery(search?: string, searchFields?: string[]) {
  if (!search || search.length < 3) return {};

  if (!searchFields || !searchFields.length) return {};

  const sanitizedSearch = search?.trim().replace(/\s+/g, ' ').replace(/\s/g, ' & ');

  return { OR: searchFields.map((item) => ({ [item]: { search: sanitizedSearch } })) };
}

export function createFilterQuery(field?: string, values?: string[]) {
  if (!field || !values || values.length === 0) return {};

  return { OR: values.map((value) => ({ [field]: { equals: value } })) };
}

export function createJoinQuery(fields?: string[]) {
  if (!fields || fields.length < 1) return {};

  return fields.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {});
}
