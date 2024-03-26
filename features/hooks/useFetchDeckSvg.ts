import { useState, useEffect } from 'react';

const useFetchDeckSvg = (imageId: string | undefined) => {
  const [svgData, setSvgData] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageId) {
      return;
    }

    const imageUrl = `http://logotipiwe.ru/haur/api/v1/get-vector-image/${imageId}`;
    setIsLoadingImage(true);

    fetch(imageUrl)
      .then(response => response.text())
      .then(svg => {
        setSvgData(svg);
        setIsLoadingImage(false);
      })
      .catch(err => {
        setError(err);
        console.error('Error fetching SVG:', err);
        setIsLoadingImage(false);
      });
  }, [imageId]);

  return { svgData, isLoadingImage, error };
};

export default useFetchDeckSvg;
