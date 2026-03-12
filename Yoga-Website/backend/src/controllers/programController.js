import * as ProgramModel from '../models/programModel.js';

export const getPrograms = async (req, res) => {
  try {
    const programs = await ProgramModel.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching programs', error: error.message });
  }
};

export const createProgram = async (req, res) => {
  try {
    const newProgram = await ProgramModel.createProgram(req.body);
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(500).json({ message: 'Error creating program', error: error.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const updated = await ProgramModel.updateProgram(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Program not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating program', error: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const deleted = await ProgramModel.deleteProgram(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting program', error: error.message });
  }
};
