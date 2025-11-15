export const buildBase64ImageUrl = (image?: string, mimeType = 'image/png') => {
  if (!image) {
    return '';
  }

  const trimmed = image.trim();

  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  return `data:${mimeType};base64,${trimmed}`;
};

