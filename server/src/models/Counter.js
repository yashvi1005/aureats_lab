const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String },
    seq: { type: Number, default: 0 }
  },
  { versionKey: false }
);

counterSchema.statics.getNextSequence = async function (name) {
  const updated = await this.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return updated.seq;
};

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;

