const slugify = require('slugify');

exports.setSlugOnSave = (field) => {
  return function (next) {
    if (this.isModified(field)) {
      this.slug = slugify(this[field], { lower: true });
    }
    next();
  };
};

exports.setSlugOnUpdate = (field) => {
  return function (next) {
    const update = this.getUpdate();
    if (update[field]) {
      update.slug = slugify(update[field], { lower: true });
      this.setUpdate(update);
    }
    next();
  };
};
