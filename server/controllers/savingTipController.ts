import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { SavingTip } from '../models/SavingTip.js';
import { Bookmark } from '../models/Bookmark.js';
import { getPersonalizedTips } from '../services/savingTipService.js';

// @desc    Get saving tips for student
// @route   GET /api/saving-tips
export const getSavingTips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const tips = await getPersonalizedTips(userId);

    // Also get user's existing bookmarks so frontend knows which are bookmarked
    const bookmarks = await Bookmark.find({ userId, itemType: 'tip' });
    const bookmarkedIds = new Set(bookmarks.map((b) => b.itemId.toString()));

    const tipsWithBookmarkStatus = tips.map((t: any) => ({
      ...((t.toObject && t.toObject()) || t),
      isBookmarked: bookmarkedIds.has(t._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      data: tipsWithBookmarkStatus,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bookmark an item (tip, insight, report)
// @route   POST /api/saving-tips/:id/bookmark or POST /api/bookmarks
export const bookmarkItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { itemType = 'tip', title, summary, metadata } = req.body;

    const itemId = id || req.body.itemId;
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }

    const existing = await Bookmark.findOne({ userId, itemType, itemId });
    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.status(200).json({
        success: true,
        message: 'Bookmark removed',
        data: { bookmarked: false },
      });
    }

    const bookmark = await Bookmark.create({
      userId,
      itemType,
      itemId,
      title: title || 'Saved Item',
      summary: summary || '',
      metadata: metadata || {},
    });

    return res.status(201).json({
      success: true,
      message: 'Item bookmarked successfully',
      data: { bookmarked: true, bookmark },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookmarks for user
// @route   GET /api/bookmarks
export const getBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { type } = req.query;

    const query: any = { userId };
    if (type && ['tip', 'insight', 'report'].includes(type as string)) {
      query.itemType = type;
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookmarks,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
export const deleteBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    await Bookmark.findOneAndDelete({ _id: id, userId });

    return res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dismiss a saving tip
// @route   POST /api/saving-tips/:id/dismiss
export const dismissTip = async (req: AuthRequest, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Tip dismissed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
