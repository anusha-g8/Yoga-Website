export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const data = source === 'body' ? req.body : req.params;
    const validatedData = schema.parse(data);
    
    if (source === 'body') req.body = validatedData;
    else req.params = validatedData;
    
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    next(error);
  }
};
