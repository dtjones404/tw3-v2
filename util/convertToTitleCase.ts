export function convertToTitleCase(s: string) {
  const spaced = s.replace(/([A-Z])/g, ' $1');
  const res = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  return res;
}
