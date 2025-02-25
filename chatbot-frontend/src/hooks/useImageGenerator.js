import { useState } from "react";

const useImageGenerator = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async (prompt) => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
      if (!response.ok) {
        throw new Error("Failed to generate image.");
      }

      setImage(response.url);
    } catch (error) {
      setError("❌ Failed to generate image. Please try again.");
      console.error("❌ Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return { image, loading, error, generateImage };
};

export default useImageGenerator;
