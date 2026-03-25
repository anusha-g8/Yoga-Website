import * as MonitoringModel from '../models/monitoringModel.js';

/**
 * Endpoint for frontend to track custom activities (e.g. Page Views)
 */
export const track = async (req, res) => {
  try {
    const { activity_type, description, metadata, is_traffic } = req.body;
    
    if (is_traffic) {
      // Log as traffic
      const trafficData = {
        ip_address: req.ip || req.headers['x-forwarded-for'],
        user_agent: req.headers['user-agent'],
        path: metadata?.path || req.headers['referer'] || '/',
        referrer: req.headers['referer']
      };
      await MonitoringModel.logTraffic(trafficData);
    }

    const activityData = {
      member_id: req.memberId || null,
      activity_type: activity_type || 'PAGE_VIEW',
      description: description || `Visited ${metadata?.path || 'site'}`,
      metadata: {
        ...metadata,
        ip: req.ip || req.headers['x-forwarded-for'],
        userAgent: req.headers['user-agent']
      }
    };

    const saved = await MonitoringModel.logActivity(activityData);
    res.json({ success: true, activity: saved });
  } catch (error) {
    console.error('Tracking Error:', error);
    res.status(500).json({ message: 'Error recording activity', error: error.message });
  }
};

/**
 * Gets monitoring statistics for Admin
 */
export const getStats = async (req, res) => {
  try {
    const activities = await MonitoringModel.getRecentActivities(100);
    const traffic = await MonitoringModel.getTrafficStats();
    
    res.json({
      activities,
      traffic
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Error fetching monitoring stats', error: error.message });
  }
};
