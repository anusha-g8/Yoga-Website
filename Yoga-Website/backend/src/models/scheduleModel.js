import { query } from '../db/index.js';

export const getAllSchedule = async () => {
  const result = await query(`
    SELECT * FROM schedule 
    ORDER BY CASE 
      WHEN day = 'Monday' THEN 1
      WHEN day = 'Tuesday' THEN 2
      WHEN day = 'Wednesday' THEN 3
      WHEN day = 'Thursday' THEN 4
      WHEN day = 'Friday' THEN 5
      WHEN day = 'Saturday' THEN 6
      WHEN day = 'Sunday' THEN 7
    END
  `);
  return result.rows;
};

export const createSchedule = async (data) => {
  const { day, time, class_name, level } = data;
  const result = await query(
    'INSERT INTO schedule (day, time, class_name, level) VALUES ($1, $2, $3, $4) RETURNING *',
    [day, time, class_name, level]
  );
  return result.rows[0];
};

export const updateSchedule = async (id, data) => {
  const { day, time, class_name, level } = data;
  const result = await query(
    'UPDATE schedule SET day = $1, time = $2, class_name = $3, level = $4 WHERE id = $5 RETURNING *',
    [day, time, class_name, level, id]
  );
  return result.rows[0];
};

export const deleteSchedule = async (id) => {
  const result = await query('DELETE FROM schedule WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
