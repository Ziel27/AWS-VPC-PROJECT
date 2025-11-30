const express = require('express');
const router = express.Router();
const VPC = require('../models/VPC');

// Get all VPCs
router.get('/vpcs', async (req, res) => {
  try {
    const vpcs = await VPC.find();
    res.json(vpcs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single VPC by ID
router.get('/vpcs/:id', async (req, res) => {
  try {
    const vpc = await VPC.findById(req.params.id);
    if (!vpc) {
      return res.status(404).json({ error: 'VPC not found' });
    }
    res.json(vpc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new VPC
router.post('/vpcs', async (req, res) => {
  try {
    const vpc = new VPC(req.body);
    const savedVpc = await vpc.save();
    res.status(201).json(savedVpc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update VPC
router.put('/vpcs/:id', async (req, res) => {
  try {
    const vpc = await VPC.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!vpc) {
      return res.status(404).json({ error: 'VPC not found' });
    }
    res.json(vpc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete VPC
router.delete('/vpcs/:id', async (req, res) => {
  try {
    const vpc = await VPC.findByIdAndDelete(req.params.id);
    if (!vpc) {
      return res.status(404).json({ error: 'VPC not found' });
    }
    res.json({ message: 'VPC deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

