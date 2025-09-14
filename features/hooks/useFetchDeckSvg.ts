import { useQuery } from "@tanstack/react-query";

const useFetchDeckSvg = (imageId: string | undefined) => {
  const sanitizeSvg = (raw: string): string => {
    if (!raw) return "";
    let text = raw
      // remove XML prolog and doctype
      .replace(/<\?xml[\s\S]*?\?>/gi, "")
      .replace(/<!doctype[\s\S]*?>/gi, "")
      // remove comments
      .replace(/<!--([\s\S]*?)-->/g, "");

    // keep only content from <svg ...> to </svg>
    const startIndex = text.toLowerCase().indexOf("<svg");
    const endIndex = text.toLowerCase().lastIndexOf("</svg>");
    if (startIndex === -1 || endIndex === -1) return "";
    text = text.slice(startIndex, endIndex + 6);

    // Protect <text>...</text> blocks to preserve their content
    const preservedTextBlocks: string[] = [];
    text = text.replace(/<text[\s\S]*?<\/text>/gi, (match) => {
      const placeholder = `__SVG_TEXT_BLOCK_${preservedTextBlocks.length}__`;
      preservedTextBlocks.push(match);
      return placeholder;
    });

    // Remove any raw text nodes between tags (which RN can't render under <G> etc.)
    text = text.replace(/>[^<]+</g, "><");

    // Restore preserved <text> blocks
    preservedTextBlocks.forEach((original, index) => {
      const placeholder = new RegExp(`__SVG_TEXT_BLOCK_${index}__`, "g");
      text = text.replace(placeholder, original);
    });

    // Collapse whitespace between tags
    text = text.replace(/>\s+</g, "><");

    return text.trim();
  };

  const fetchSvgData = async (): Promise<string> => {
    if (!imageId) {
      throw new Error("Image ID is not provided");
    }
    const response = await fetch(`https://chestno-game.online/honest-be/api/v1/vector-images/${imageId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch SVG data");
    }
    const rawText = await response.text();
    const svgText = sanitizeSvg(rawText);
    if (!svgText) {
      console.warn("Fetched vector is not valid SVG or empty for imageId:", imageId);
    } else {
      console.log("SVG data fetched for imageId:", imageId, "length:", svgText.length);
    }
    return svgText;
  };

  const {
    data: svgData = "",
    isLoading: isLoadingImage,
    error,
  } = useQuery({
    queryKey: ["fetchSvgData", imageId],
    queryFn: fetchSvgData,
    enabled: !!imageId, // Запуск запроса только при наличии imageId
    retry: false, // Отключение повторных попыток при ошибке (по желанию)
  });

  return { svgData, isLoadingImage, error };
};

export default useFetchDeckSvg;
