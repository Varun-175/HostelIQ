import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsService.getAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
