import Colors from '@/constants/Colors'

export interface IQuestonLevelAndColor {
	levelTitle: string
	levelBgColor: string
}

export const getLevelColor = (level?: string | undefined) => {
  if (typeof level !== 'string') {
    // Обрабатываем случай, когда level не определен или не является строкой
    console.error('Invalid input for getLevelColor:', level);
    return 'rgb(0, 0, 0)'; // Возвращаем какое-то дефолтное значение, например черный цвет
  }

  const newString: string[] = level.split(',');
  const [r, g, b] = newString;

  const color = `rgb(${r}, ${g}, ${b})`;
  return color;
}


