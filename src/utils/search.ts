export function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // удаление
        matrix[j - 1][i] + 1, // вставка
        matrix[j - 1][i - 1] + substitutionCost // замена
      );
    }
  }

  return matrix[b.length][a.length];
}

export function fuzzySearch<T>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[],
  threshold = 2
): T[] {
  if (!searchTerm) return [];
  
  const normalizedSearch = searchTerm.toLowerCase();
  
  return items
    .map(item => {
      const distances = keys.map(key => {
        const value = String(item[key]).toLowerCase();
        return levenshteinDistance(value, normalizedSearch);
      });
      
      return {
        item,
        distance: Math.min(...distances)
      };
    })
    .filter(({ distance }) => distance <= threshold)
    .sort((a, b) => a.distance - b.distance)
    .map(({ item }) => item);
}