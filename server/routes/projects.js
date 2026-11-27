const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).populate('client').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new project
router.post('/', auth, async (req, res) => {
  const project = new Project({
    ...req.body,
    user: req.user.id
  });
  try {
    const newProject = await project.save();
    // Populate client before returning
    await newProject.populate('client');
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a project
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('client');
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a time log to a project
router.post('/:id/time', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    project.timeLogs.push(req.body);
    await project.save();
    await project.populate('client');
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a time log from a project
router.delete('/:id/time/:logId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    project.timeLogs = project.timeLogs.filter(log => log._id.toString() !== req.params.logId);
    await project.save();
    await project.populate('client');
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
