export const convertStringToArray = (
  value: string,
  type: 'string' | 'string_json' = 'string'
) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof type === 'string') {
    return value.split(',');
  }
  return JSON.parse(value);
};
