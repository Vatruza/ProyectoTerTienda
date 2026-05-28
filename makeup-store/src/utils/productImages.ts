const imageByProductName: Record<string, string> = {
  'Ruby Woo Lipstick': '/images/products/lipstick.svg',
  'Naked Palette': '/images/products/palette.svg',
  'Flawless Filter': '/images/products/foundation.svg',
  'Orgasm Blush': '/images/products/blush.svg',
  'Better Than Sex': '/images/products/mascara.svg',
  'Gloss Bomb': '/images/products/gloss.svg',
  'Fit Me Powder': '/images/products/bronzer.svg',
  'True Match Foundation': '/images/products/foundation.svg',
  'Butter Gloss': '/images/products/gloss.svg',
  'Hoola Bronzer': '/images/products/bronzer.svg',
  'Velvet Teddy': '/images/products/lipstick.svg',
  'Born This Way': '/images/products/foundation.svg',
  'Base Studio': '/images/products/foundation.svg',
  'Lip Tint': '/images/products/gloss.svg',
};

function isImageUrl(value?: string) {
  if (!value) return false;
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
}

export function getProductImageSrc(name: string, image?: string) {
  if (isImageUrl(image)) {
    return image as string;
  }

  if (imageByProductName[name]) {
    return imageByProductName[name];
  }

  return '/images/products/gloss.svg';
}

export function hasImageUrl(image?: string) {
  return isImageUrl(image);
}