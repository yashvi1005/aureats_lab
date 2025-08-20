const Ability = require('../models/Ability');
const Master = require('../models/Master');
const Counter = require('../models/Counter');

async function createAbility(req, res, next) {
  try {
    const { id, masterId, ability, type, damage, status } = req.body;
    const masterNumericId = parseInt(masterId, 10);
    if (!Number.isInteger(masterNumericId)) {
      return res.status(400).json({ message: 'masterId must be an integer' });
    }
    const master = await Master.findOne({ id: masterNumericId });
    if (!master) return res.status(400).json({ message: 'Invalid masterId' });
    let numericId = id;
    if (numericId === undefined || numericId === null) {
      numericId = await Counter.getNextSequence('ability');
    }
    const created = await Ability.create({ id: numericId, masterId: masterNumericId, ability, type, damage, status });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function listAbilities(req, res, next) {
  try {
    const { page = 1, limit = 20, masterId } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const filter = {};
    if (masterId !== undefined) {
      const mid = parseInt(masterId, 10);
      if (!Number.isInteger(mid)) {
        return res.status(400).json({ message: 'masterId must be an integer' });
      }
      filter.masterId = mid;
    }
    const [items, total] = await Promise.all([
      Ability.find(filter).sort({ id: 1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Ability.countDocuments(filter)
    ]);
    res.json({ items, total, page: pageNum, limit: limitNum });
  } catch (err) {
    next(err);
  }
}

async function getAbilityById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const ability = await Ability.findOne({ id });
    if (!ability) return res.status(404).json({ message: 'Ability not found' });
    res.json(ability);
  } catch (err) {
    next(err);
  }
}

async function updateAbility(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;
    if (updates.masterId !== undefined) {
      const mid = parseInt(updates.masterId, 10);
      if (!Number.isInteger(mid)) {
        return res.status(400).json({ message: 'masterId must be an integer' });
      }
      const master = await Master.findOne({ id: mid });
      if (!master) return res.status(400).json({ message: 'Invalid masterId' });
      updates.masterId = mid;
    }
    const updated = await Ability.findOneAndUpdate({ id }, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Ability not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteAbility(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await Ability.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: 'Ability not found' });
    res.json({ message: 'Ability deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAbility, listAbilities, getAbilityById, updateAbility, deleteAbility };

