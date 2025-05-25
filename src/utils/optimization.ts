export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function calculateMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toFixed(2);
  }
  if (price >= 1) {
    return price.toFixed(4);
  }
  return price.toFixed(8);
}

export function filterOrderBookUpdates(
  oldLevel: [string, string],
  newLevel: [string, string],
  threshold = 0.0005
): boolean {
  const [oldPrice, oldAmount] = oldLevel.map(Number);
  const [newPrice, newAmount] = newLevel.map(Number);
  
  const priceChange = Math.abs(oldPrice - newPrice) / oldPrice;
  const amountChange = Math.abs(oldAmount - newAmount) / oldAmount;
  
  return priceChange >= threshold || amountChange >= threshold;
}