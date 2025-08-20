const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    masterId: { type: Number, required: true, index: true },
    ability: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    damage: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

const Ability = mongoose.model('Ability', abilitySchema);
module.exports = Ability;

