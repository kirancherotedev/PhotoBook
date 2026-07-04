export const PRODUCT_IMAGES = [
<<<<<<< Updated upstream
  "10Story of Us.png",
  "11Best Moments.png",
  "11Dear Moments.png",
  "12Celebrations.png",
  "13Memories.png",
  "14Days Like These.png",
  "15Little Joys.png",
  "16Valentine's Day  Little Joys.png",
  "17the Sparks.png",
  "18Picture Postcards.png",
  "19Retro Roll.png",
  "1Mini PhotoBook.png",
  "20Best Days.png",
  "21Chapters.png",
  "22Framed.png",
  "23Polaroids.png",
  "24Picture Perfect.png",
  "25Now & always.png",
  "26Magic.png",
  "2Medium Photobook.png",
  "3Large Photobook.png",
  "4You & Me  Timeless.png",
  "5Best Mom  Timeless.png",
  "6Best Sister  Timeless.png",
  "7Relationship & Family.png",
  "8You & Me.png",
  "9Our Story.png"
=======
  "Best Moments.png",
  "Little Joys.png",
  "Mini PhotoBook.png",
  "Our Story.png",
  "Picture Perfect.png",
  "You & Me  Timeless.png"
>>>>>>> Stashed changes
].map(f => `/products/${f}`);

export const formatProductName = (filepath: string) => {
  const filename = filepath.split('/').pop() || '';
  return filename
    .replace(/^\d+/, '') // remove leading numbers
    .replace('.png', '') // remove extension
    .trim();
};
