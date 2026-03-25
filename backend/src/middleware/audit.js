import * as MonitoringModel from '../models/monitoringModel.js';

/**
 * Middleware to audit API requests
 */
export const auditMiddleware = async (req, res, next) => {
  // Skip auditing for monitoring routes themselves to avoid loops
  if (req.path.startsWith('/api/monitoring')) {
    return next();
  }

  // Capture the original end function to log after the request is finished
  const oldEnd = res.end;
  
  res.end = function(chunk, encoding) {
    res.end = oldEnd;
    const result = res.end(chunk, encoding);
    
    // Perform logging asynchronously after response is sent
    const activityData = {
      member_id: req.memberId || null, // req.memberId is set by auth middleware
      activity_type: 'API_REQUEST',
      description: `${req.method} ${req.originalUrl}`,
      metadata: {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ip: req.ip || req.headers['x-forwarded-for']
      }
    };

    // Log to DB but don't wait for it to avoid slowing down the response
    MonitoringModel.logActivity(activityData).catch(err => {
      console.error('Audit Logging Error:', err);
    });

    return result;
  };

  next();
};
