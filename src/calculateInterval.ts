const ONE_DAY = 24 * 60 * 60 * 1000;

function calculateFactor(oldFactor: number, quality: number):number {
  const newFactor = oldFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newFactor < 1.3 ) return 1.3;
  return Math.round(newFactor * 100) / 100;
}

export function calculateInterval(repetition: number, lastInterval: number, oldFactor: number, quality: number) {
  if(quality < 3) {
    return {
      interval: 60*1000,
      factor: oldFactor,
      repetition: 1,
    }
  }
  const factor = calculateFactor(oldFactor, quality);
  if(repetition <= 1) return {
    interval: ONE_DAY,
    factor,
    repetition: ++repetition,
  };
  if(repetition === 2) return {
    interval: ONE_DAY * 2,
    factor,
    repetition: ++repetition,
  };
  const newInterval = lastInterval * factor;
  return {
    interval: Math.round(newInterval),
    factor,
    repetition: ++repetition,
  };
}