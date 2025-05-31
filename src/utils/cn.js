export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .flat()
    .map(input => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(' ');
}