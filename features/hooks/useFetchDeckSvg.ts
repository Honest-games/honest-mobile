import { useQuery } from '@tanstack/react-query';

const useFetchDeckSvg = (imageId: string | undefined) => {
  const fetchSvgData = async (): Promise<string> => {
    if (!imageId) {
      throw new Error('Image ID is not provided');
    }
    const response = await fetch(`https://logotipiwe.ru/haur/api/v1/get-vector-image/${imageId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch SVG data');
    }
    return response.text();
  };

  const { data: svgData = '', isLoading: isLoadingImage, error } = useQuery({
    queryKey: ['fetchSvgData', imageId],
    queryFn: fetchSvgData,
    enabled: !!imageId, // Запуск запроса только при наличии imageId
    retry: false,       // Отключение повторных попыток при ошибке (по желанию)
  });

  return { svgData, isLoadingImage, error };
};

export default useFetchDeckSvg;
