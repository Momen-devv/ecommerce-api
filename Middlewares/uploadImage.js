const multer = require('multer');
const AppError = require('../utils/appError');

exports.uploadSingleImage = (fileName) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cd) => {
    if (file.mimetype.startsWith('image')) {
      cd(null, true);
    } else {
      cd(new AppError('Not an image! Plrase upload only images.', 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fileName);
};
