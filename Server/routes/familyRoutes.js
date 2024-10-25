// routes/familyRoutes.js
const express = require('express');
const router = express.Router();
const {
  createFamilyMember,
  addFamilyMember,
  updateFamilyMember,
  registerDeath,
  searchFamilyMembers,
  getFamilyTree,
  getSiblings,
  registerMarriage,
  registerDivorce,
  addChild,
  deleteFamilyMember
} = require('../controllers/familyController');

// الحصول على جميع أفراد العائلة مع إمكانية البحث
router.get('/', async (req, res) => {
  try {
    const members = await searchFamilyMembers(req.query);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة فرد جديد
router.post('/', async (req, res) => {
  try {
    const member = await createFamilyMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// إضافة عائلة كاملة
router.post('/addfamily', async (req, res) => {
  try {
    const result = await addFamilyMember(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تحديث معلومات فرد
router.put('/:id', async (req, res) => {
  try {
    const member = await updateFamilyMember(req.params.id, req.body);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// الحصول على شجرة العائلة لفرد معين
router.get('/:id/tree', async (req, res) => {
  try {
    const tree = await getFamilyTree(req.params.id);
    res.json(tree);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// الحصول على الأخوة والأخوات
router.get('/:id/siblings', async (req, res) => {
  try {
    const siblings = await getSiblings(req.params.id);
    res.json(siblings);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// تسجيل زواج
router.post('/:id/marriage', async (req, res) => {
  try {
    const result = await registerMarriage(req.params.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تسجيل طلاق
router.post('/:id/divorce', async (req, res) => {
  try {
    const result = await registerDivorce(req.params.id, req.body.spouseId, req.body.divorceDate);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// إضافة طفل
router.post('/child', async (req, res) => {
  try {
    const child = await addChild(req.body.parentIds, req.body.childData);
    res.status(201).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تسجيل وفاة
router.post('/:id/death', async (req, res) => {
  try {
    const member = await registerDeath(req.params.id, req.body.deathDate);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// حذف فرد
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteFamilyMember(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;