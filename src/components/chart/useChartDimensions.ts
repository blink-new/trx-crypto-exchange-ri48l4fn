import { useMemo } from 'react';

export const useChartDimensions = (
  width: number,
  height: number,
  showVolume: boolean
) => {
  return useMemo(() => {
    // Делаем объемы частью основного графика
    const volumeHeight = showVolume ? height * 0.2 : 0;
    const chartHeight = height; // Используем полную высоту контейнера

    return {
      volumeHeight,
      chartHeight
    };
  }, [width, height, showVolume]);
};