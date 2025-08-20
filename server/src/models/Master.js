const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    image: { type: Buffer, default: null },
    imageType: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);
masterSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
masterSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.image;
  obj.hasImage = this.image && this.image.length > 0;
  return obj;
};
masterSchema.virtual('hasImage').get(function() {
  return this.image && this.image.length > 0;
});

const Master = mongoose.model('Master', masterSchema);
module.exports = Master;
