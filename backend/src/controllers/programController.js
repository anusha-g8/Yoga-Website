import * as ProgramModel from '../models/programModel.js';

export const getPrograms = async (req, res) => {
  try {
    const programs = await ProgramModel.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching programs', error: error.message });
  }
};

export const getProgram = async (req, res) => {
  try {
    const program = await ProgramModel.getProgramById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching program', error: error.message });
  }
};
