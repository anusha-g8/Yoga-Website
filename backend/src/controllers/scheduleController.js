import * as ScheduleModel from '../models/scheduleModel.js';

export const getSchedule = async (req, res) => {
  try {
    const schedule = await ScheduleModel.getAllSchedule();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const newSchedule = await ScheduleModel.createSchedule(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updated = await ScheduleModel.updateSchedule(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Schedule item not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const deleted = await ScheduleModel.deleteSchedule(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Schedule item not found' });
    res.json({ message: 'Schedule item deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule', error: error.message });
  }
};
