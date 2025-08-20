const express = require('express');
const upload = require('../middleware/upload');
const { createMaster, listMasters, getMasterById, updateMaster, deleteMaster, getMasterImage } = require('../controllers/masterController');

const router = express.Router();

router.post('/', upload.single('image'), createMaster);
router.get('/', listMasters);
router.get('/:id', getMasterById);
router.get('/:id/image', getMasterImage);
router.put('/:id', upload.single('image'), updateMaster);
router.delete('/:id', deleteMaster);

module.exports = router;

