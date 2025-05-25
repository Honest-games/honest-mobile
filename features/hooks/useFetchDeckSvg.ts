import { useQuery } from '@tanstack/react-query';

const useFetchDeckSvg = (imageId: string | undefined) => {
  const fetchSvgData = async (): Promise<string> => {
    if (!imageId) {
      console.warn('Image ID is not provided');
      return '';
    }
    
    try {
    const response = await fetch(`https://logotipiwe.ru/haur/api/v1/get-vector-image/${imageId}`);
      
    if (!response.ok) {
        console.warn(`Failed to fetch SVG data: ${response.status}`);
        return '';
      }
      
      const text = await response.text();
      
      // Проверка что ответ содержит SVG
      if (!text || !text.trim() || (!text.includes('<svg') && !text.includes('<?xml'))) {
        console.warn(`Invalid SVG received for imageId: ${imageId}`);
        return '';
      }
      
      return text;
    } catch (error) {
      console.error(`Error fetching SVG for ${imageId}:`, error);
      return '';
    }
  };

  const { data: svgData = '', isLoading: isLoadingImage, error } = useQuery({
    queryKey: ['fetchSvgData', imageId],
    queryFn: fetchSvgData,
    enabled: !!imageId, // Запуск запроса только при наличии imageId
    retry: false,       // Отключение повторных попыток при ошибке
    staleTime: 1000 * 60 * 5, // Кеширование на 5 минут
  });

  return { svgData, isLoadingImage, error };
};

export default useFetchDeckSvg;
