import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Category } from '../models/Category.js';
import { Transaction } from '../models/Transaction.js';
import { parseCSVBuffer } from '../utils/csvParser.js';
import { suggestCategory } from '../services/aiService.js';
import { checkBudgetThresholds } from '../services/notificationService.js';

// @desc    Upload CSV file and get preview with validation and AI suggestions
// @route   POST /api/import/csv
export const uploadAndPreviewCSV = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid CSV file',
      });
    }

    const parsedRows = await parseCSVBuffer(req.file.buffer);

    if (parsedRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded CSV file is empty or formatted incorrectly',
      });
    }

    // Get all user categories
    const categories = await Category.find({
      $or: [{ isDefault: true }, { userId }],
    });

    const categoryNames = categories.map((c) => c.name);

    // Enhance rows with category match and AI suggestion
    const previewRows = [];

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      let matchedCategory = categories.find(
        (c) => c.name.toLowerCase() === row.category.toLowerCase() && c.type === row.type
      );

      let aiSuggested = null;

      if (!matchedCategory) {
        // Run AI / heuristic category suggestion
        const suggestion = await suggestCategory(
          row.description || row.category,
          categoryNames,
          row.type
        );
        matchedCategory = categories.find((c) => c.name.toLowerCase() === suggestion.category.toLowerCase());
        aiSuggested = suggestion.category;
      }

      previewRows.push({
        rowIndex: i + 1,
        date: row.date,
        type: row.type,
        originalCategory: row.category,
        matchedCategoryId: matchedCategory ? matchedCategory._id : categories[0]._id,
        matchedCategoryName: matchedCategory ? matchedCategory.name : categories[0].name,
        aiSuggested,
        amount: row.amount,
        description: row.description,
        isValid: row.isValid,
        error: row.error,
      });
    }

    const validCount = previewRows.filter((r) => r.isValid).length;
    const invalidCount = previewRows.length - validCount;

    return res.status(200).json({
      success: true,
      message: 'CSV parsed and validated successfully',
      data: {
        totalRows: previewRows.length,
        validCount,
        invalidCount,
        rows: previewRows,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Confirm and commit imported CSV rows to database
// @route   POST /api/import/confirm
export const confirmCSVImport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No transactions provided to import',
      });
    }

    const transactionsToInsert = [];
    const validCategoryIds = new Set(
      (await Category.find({ $or: [{ isDefault: true }, { userId }] })).map((c) => c._id.toString())
    );

    for (const r of rows) {
      if (!r.isValid) continue;

      const categoryId = validCategoryIds.has(r.matchedCategoryId)
        ? r.matchedCategoryId
        : Array.from(validCategoryIds)[0];

      transactionsToInsert.push({
        userId,
        categoryId,
        amount: Math.abs(Number(r.amount)),
        type: r.type === 'income' ? 'income' : 'expense',
        description: r.description || 'Imported Transaction',
        date: new Date(r.date),
        isRecurring: false,
      });
    }

    if (transactionsToInsert.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid rows found to import',
      });
    }

    const inserted = await Transaction.insertMany(transactionsToInsert);

    // Check thresholds for newly added expenses
    const recentExpense = transactionsToInsert.find((t) => t.type === 'expense');
    if (recentExpense) {
      await checkBudgetThresholds(userId, recentExpense.categoryId, recentExpense.date);
    }

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} transactions.`,
      data: {
        importedCount: inserted.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
