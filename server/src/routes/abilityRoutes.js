const express = require('express');
const { createAbility, listAbilities, getAbilityById, updateAbility, deleteAbility } = require('../controllers/abilityController');

const router = express.Router();

router.post('/', createAbility);
router.get('/', listAbilities);
router.get('/:id', getAbilityById);
router.put('/:id', updateAbility);
router.delete('/:id', deleteAbility);

module.exports = router;

