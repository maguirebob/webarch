import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  if (req.accepts('html')) {
    res.status(404).render('pages/404', {
      title: 'Page Not Found',
      url: req.url,
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        message: 'Not Found',
        url: req.url,
      },
    });
  }
};
