import { query } from '../db/index.js';

/**
 * Logs a visit to the site
 */
export const logTraffic = async (trafficData) => {
  const { ip_address, user_agent, path, referrer } = trafficData;
  const result = await query(
    'INSERT INTO site_traffic (ip_address, user_agent, path, referrer) VALUES ($1, $2, $3, $4) RETURNING *',
    [ip_address, user_agent, path, referrer]
  );
  return result?.rows ? result.rows[0] : null;
};

/**
 * Logs a specific user activity
 */
export const logActivity = async (activityData) => {
  const { member_id, activity_type, description, metadata } = activityData;
  const result = await query(
    'INSERT INTO user_activities (member_id, activity_type, description, metadata) VALUES ($1, $2, $3, $4) RETURNING *',
    [member_id, activity_type, description, metadata ? JSON.stringify(metadata) : null]
  );
  return result?.rows ? result.rows[0] : null;
};

/**
 * Gets recent activities for the admin dashboard
 */
export const getRecentActivities = async (limit = 50) => {
  const result = await query(`
    SELECT ua.*, m.name as member_name, m.email as member_email 
    FROM user_activities ua
    LEFT JOIN members m ON ua.member_id = m.id
    ORDER BY ua.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

/**
 * Gets traffic statistics
 */
export const getTrafficStats = async () => {
  const totalVisits = await query('SELECT COUNT(*) FROM site_traffic');
  const topPages = await query(`
    SELECT path, COUNT(*) as visit_count 
    FROM site_traffic 
    GROUP BY path 
    ORDER BY visit_count DESC 
    LIMIT 10
  `);
  const recentVisits = await query('SELECT * FROM site_traffic ORDER BY visited_at DESC LIMIT 20');

  return {
    totalVisits: parseInt(totalVisits.rows[0].count),
    topPages: topPages.rows,
    recentVisits: recentVisits.rows
  };
};
