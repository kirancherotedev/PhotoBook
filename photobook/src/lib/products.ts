export const PRODUCT_IMAGES = [
  "Best Moments.png",
  "Little Joys.png",
  "Mini PhotoBook.png",
  "Our Story.png",
  "Picture Perfect.png",
  "You & Me  Timeless.png"
].map(f => `/products/${f}`);

export const formatProductName = (filepath: string) => {
  const filename = filepath.split('/').pop() || '';
  return filename
    .replace(/^\d+/, '') // remove leading numbers
    .replace('.png', '') // remove extension
    .trim();
};
