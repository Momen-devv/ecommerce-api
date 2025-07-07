const multer = require('multer');
const AppError = require('../utils/appError');

const multerOptions = function () {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cd) => {
    if (file.mimetype.startsWith('image')) {
      cd(null, true);
    } else {
      cd(new AppError('Not an image! Plrase upload only images.', 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fileName) => multerOptions().single(fileName);

exports.uploadMixOfImages = (fields) => multerOptions().fields(fields);
