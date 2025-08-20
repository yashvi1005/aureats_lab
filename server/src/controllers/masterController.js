const Master = require('../models/Master');
const Ability = require('../models/Ability');
const Counter = require('../models/Counter');

async function createMaster(req, res, next) {
  try {
    const { id, name, status } = req.body;
    const existingByName = await Master.findOne({ name }).collation({ locale: 'en', strength: 2 });
    if (existingByName) {
      return res.status(409).json({ message: `Pokemon with name "${name}" already exists` });
    }
    let numericId = id;
    if (numericId === undefined || numericId === null) {
      numericId = await Counter.getNextSequence('master');
    }
    let imageData = null;
    let imageType = null;
    if (req.file) {
      imageData = req.file.buffer;
      imageType = req.file.mimetype;
    }
    const created = await Master.create({ 
      id: numericId, 
      name, 
      image: imageData,
      imageType,
      status 
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function listMasters(req, res, next) {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    const [items, total] = await Promise.all([
      Master.find(filter).sort({ id: 1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Master.countDocuments(filter)
    ]);
    res.json({ items, total, page: pageNum, limit: limitNum });
  } catch (err) {
    next(err);
  }
}

async function getMasterById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const master = await Master.findOne({ id });
    if (!master) return res.status(404).json({ message: 'Master not found' });
    res.json(master);
  } catch (err) {
    next(err);
  }
}

async function updateMaster(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, status } = req.body;
    const updates = { name, status };
    if (name) {
      const conflict = await Master.findOne({ name, id: { $ne: id } }).collation({ locale: 'en', strength: 2 });
      if (conflict) {
        return res.status(409).json({ message: `Pokemon with name "${name}" already exists` });
      }
    }
    if (req.file) {
      updates.image = req.file.buffer;
      updates.imageType = req.file.mimetype;
    }
    const updated = await Master.findOneAndUpdate({ id }, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Master not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteMaster(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await Master.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: 'Master not found' });
    await Ability.deleteMany({ masterId: id });
    res.json({ message: 'Master deleted' });
  } catch (err) {
    next(err);
  }
}

async function getMasterImage(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const master = await Master.findOne({ id });
    if (!master) return res.status(404).json({ message: 'Master not found' });
    if (!master.image || !master.imageType) return res.status(404).json({ message: 'Image not found' });
    res.set('Content-Type', master.imageType);
    res.send(master.image);
  } catch (err) {
    next(err);
  }
}

module.exports = { createMaster, listMasters, getMasterById, updateMaster, deleteMaster, getMasterImage };

