import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  }

  // Send error response
  if (req.accepts('html')) {
    res.status(statusCode).render('pages/500', {
      title: 'Server Error',
      error: process.env['NODE_ENV'] === 'development' ? err : {},
      message,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
      },
    });
  }
};
