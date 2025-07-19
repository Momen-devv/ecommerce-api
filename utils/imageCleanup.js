const cloudinary = require('./cloudinary');

// حذف صورة واحدة
const deleteImage = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

// حذف مصفوفة صور
const deleteImages = async (images) => {
  if (!Array.isArray(images)) return;
  const deletePromises = images
    .filter((img) => img?.public_id)
    .map((img) => cloudinary.uploader.destroy(img.public_id));
  await Promise.all(deletePromises);
};

module.exports = {
  deleteImage,
  deleteImages
};
