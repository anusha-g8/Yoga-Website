import * as VideoModel from '../models/videoModel.js';

export const getVideos = async (req, res) => {
  try {
    const videos = await VideoModel.getAllVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    const newVideo = await VideoModel.createVideo(req.body);
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating video', error: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const updated = await VideoModel.updateVideo(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Video not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating video', error: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const deleted = await VideoModel.deleteVideo(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error: error.message });
  }
};
