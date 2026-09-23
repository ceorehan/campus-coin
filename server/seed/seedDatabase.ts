import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';
import { SavingTip } from '../models/SavingTip.js';
import { Announcement } from '../models/Announcement.js';
import { Insight } from '../models/Insight.js';
import { Notification } from '../models/Notification.js';
import { hashPassword } from '../utils/password.js';

export const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('⚡ Database already seeded. Skipping initial seed.');
      return;
    }

    console.log('🌱 Seeding Campus Coin Database with demo data...');

    // 1. Create Admin User
    const adminHashedPassword = await hashPassword('Admin@12345');
    const admin = await User.create({
      name: 'Campus Coin Admin',
      email: 'admin@campuscoin.local',
      password: adminHashedPassword,
      role: 'admin',
      academicYear: 'Faculty Admin',
      monthlyAllowanceBaseline: 100000,
      savingsGoal: 30000,
      isActive: true,
      currency: 'USD',
    });

    // 2. Create Demo Student User
    const studentHashedPassword = await hashPassword('Student@12345');
    const student = await User.create({
      name: 'Muhammad',
      email: 'student@campuscoin.local',
      password: studentHashedPassword,
      role: 'student',
      academicYear: 'Junior',
      monthlyAllowanceBaseline: 50000,
      savingsGoal: 15000,
      isActive: true,
      currency: 'USD',
    });

    // Also a second student for multi-user verification
    const student2HashedPassword = await hashPassword('Student@12345');
    await User.create({
      name: 'Sophia Patel',
      email: 'sophia@campuscoin.local',
      password: student2HashedPassword,
      role: 'student',
      academicYear: 'Freshman',
      monthlyAllowanceBaseline: 45000,
      savingsGoal: 12000,
      isActive: true,
      currency: 'USD',
    });

    // 3. Create Default Categories
    const defaultCategories = [
      // Income
      { name: 'Allowance', type: 'income', isDefault: true, color: '#10b981', icon: 'wallet' },
      { name: 'Part-time Job', type: 'income', isDefault: true, color: '#06b6d4', icon: 'briefcase' },
      { name: 'Scholarship', type: 'income', isDefault: true, color: '#8b5cf6', icon: 'award' },
      { name: 'Gift', type: 'income', isDefault: true, color: '#ec4899', icon: 'gift' },
      { name: 'Other Income', type: 'income', isDefault: true, color: '#64748b', icon: 'plus-circle' },
      // Expense
      { name: 'Food', type: 'expense', isDefault: true, color: '#f97316', icon: 'utensils' },
      { name: 'Transport', type: 'expense', isDefault: true, color: '#3b82f6', icon: 'bus' },
      { name: 'Hostel/Rent', type: 'expense', isDefault: true, color: '#6366f1', icon: 'home' },
      { name: 'Academics', type: 'expense', isDefault: true, color: '#8b5cf6', icon: 'book-open' },
      { name: 'Subscriptions', type: 'expense', isDefault: true, color: '#a855f7', icon: 'tv' },
      { name: 'Entertainment', type: 'expense', isDefault: true, color: '#ec4899', icon: 'film' },
      { name: 'Miscellaneous', type: 'expense', isDefault: true, color: '#64748b', icon: 'tag' },
    ];

    const createdCategories = await Category.insertMany(defaultCategories);
    const catMap: Record<string, any> = {};
    for (const c of createdCategories) {
      catMap[c.name] = c._id;
    }

    // 4. Generate Historical Transactions across 6 months for student
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonthNum = now.getUTCMonth(); // 0-indexed

    const transactionsToInsert = [];

    // Past 5 months + current month (total 6 months)
    for (let offset = 5; offset >= 0; offset--) {
      const txDateMonth = new Date(Date.UTC(currentYear, currentMonthNum - offset, 1));
      const y = txDateMonth.getUTCFullYear();
      const m = txDateMonth.getUTCMonth();

      // Income 1: Monthly allowance
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Allowance'],
        amount: 50000,
        type: 'income',
        description: 'Monthly Family Allowance',
        date: new Date(Date.UTC(y, m, 1, 9, 0)),
        isRecurring: true,
        recurringFrequency: 'monthly',
      });

      // Income 2: Part-time tutoring
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Part-time Job'],
        amount: 12000,
        type: 'income',
        description: 'Peer Math Tutoring Center',
        date: new Date(Date.UTC(y, m, 15, 14, 0)),
        isRecurring: false,
      });

      // Occasional scholarship
      if (offset === 4 || offset === 1) {
        transactionsToInsert.push({
          userId: student._id,
          categoryId: catMap['Scholarship'],
          amount: 25000,
          type: 'income',
          description: 'Dean Honor Roll Stipend',
          date: new Date(Date.UTC(y, m, 20, 10, 0)),
          isRecurring: false,
        });
      }

      // Expense 1: Hostel/Rent
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Hostel/Rent'],
        amount: 15000,
        type: 'expense',
        description: 'Campus Dormitory Room & Utility Rent',
        date: new Date(Date.UTC(y, m, 3, 11, 0)),
        isRecurring: true,
        recurringFrequency: 'monthly',
      });

      // Expense 2: Subscriptions
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Subscriptions'],
        amount: 1499,
        type: 'expense',
        description: 'Spotify Student + Netflix Premium',
        date: new Date(Date.UTC(y, m, 5, 8, 0)),
        isRecurring: true,
        recurringFrequency: 'monthly',
      });

      // Expense 3: Transport
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Transport'],
        amount: 2800 + Math.floor(Math.random() * 800),
        type: 'expense',
        description: 'Monthly Student Subway & Bus Transit Pass',
        date: new Date(Date.UTC(y, m, 6, 12, 0)),
        isRecurring: false,
      });

      // Expense 4: Academics (Books / Supplies)
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Academics'],
        amount: 3500 + Math.floor(Math.random() * 2000),
        type: 'expense',
        description: 'Course Textbooks, Lab Notebook & Stationery',
        date: new Date(Date.UTC(y, m, 10, 15, 30)),
        isRecurring: false,
      });

      // Expense 5: Food (Multiple transactions)
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Food'],
        amount: 12500 + Math.floor(Math.random() * 3000),
        type: 'expense',
        description: 'Campus Dining Hall Meal Plan Reload',
        date: new Date(Date.UTC(y, m, 8, 13, 0)),
        isRecurring: false,
      });

      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Food'],
        amount: 4200 + Math.floor(Math.random() * 1500),
        type: 'expense',
        description: 'Campus Cafe & Coffee Station',
        date: new Date(Date.UTC(y, m, 18, 16, 20)),
        isRecurring: false,
      });

      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Food'],
        amount: 5800 + Math.floor(Math.random() * 1200),
        type: 'expense',
        description: 'Weekend Groceries at Local Student Market',
        date: new Date(Date.UTC(y, m, 24, 18, 0)),
        isRecurring: false,
      });

      // Expense 6: Entertainment
      transactionsToInsert.push({
        userId: student._id,
        categoryId: catMap['Entertainment'],
        amount: 2200 + Math.floor(Math.random() * 1800),
        type: 'expense',
        description: 'Weekend Cinema & Gaming with Roommates',
        date: new Date(Date.UTC(y, m, 22, 20, 0)),
        isRecurring: false,
      });
    }

    await Transaction.insertMany(transactionsToInsert);

    // 5. Create Monthly Budgets for Student (Current Month)
    const currentMonthString = `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}`;
    await Budget.insertMany([
      {
        userId: student._id,
        categoryId: catMap['Food'],
        month: currentMonthString,
        limitAmount: 30000,
      },
      {
        userId: student._id,
        categoryId: catMap['Hostel/Rent'],
        month: currentMonthString,
        limitAmount: 18000,
      },
      {
        userId: student._id,
        categoryId: catMap['Transport'],
        month: currentMonthString,
        limitAmount: 5000,
      },
      {
        userId: student._id,
        categoryId: catMap['Subscriptions'],
        month: currentMonthString,
        limitAmount: 2000,
      },
      {
        userId: student._id,
        categoryId: catMap['Entertainment'],
        month: currentMonthString,
        limitAmount: 4000,
      },
      {
        userId: student._id,
        categoryId: catMap['Academics'],
        month: currentMonthString,
        limitAmount: 8000,
      },
    ]);

    // 6. Create System Saving Tips
    await SavingTip.insertMany([
      {
        title: 'Use Campus Library Course Reserves',
        description: 'Borrow required textbooks from the library 2-hour reserve shelf or scan required chapters instead of purchasing brand new editions.',
        category: 'Academics',
        potentialSavingImpact: 4500,
        priority: 1,
        isSystemTip: true,
        isActive: true,
      },
      {
        title: 'Combine Streaming Services into Family Plans',
        description: 'Team up with your roommates or classmates to split Spotify or Netflix family tiers and save more than 50% each month.',
        category: 'Subscriptions',
        potentialSavingImpact: 1200,
        priority: 2,
        isSystemTip: true,
        isActive: true,
      },
      {
        title: 'Pre-load Campus Transit Smart Cards',
        description: 'Many universities offer semester-subsidized bus and rail cards at the student union with a 40% discount over single ride fares.',
        category: 'Transport',
        potentialSavingImpact: 2000,
        priority: 2,
        isSystemTip: true,
        isActive: true,
      },
      {
        title: 'Cook in Bulk on Sundays (Batch Cooking)',
        description: 'Meal prepping 4 dinners on Sunday reduces weeknight takeaway cravings and can keep your Food spending safely under budget.',
        category: 'Food',
        potentialSavingImpact: 6000,
        priority: 1,
        isSystemTip: true,
        isActive: true,
      },
      {
        title: 'Leverage Student ID Discounts Everywhere',
        description: 'Always ask if stores, museums, tech vendors, and apparel retailers offer an active student discount before paying.',
        category: 'Miscellaneous',
        potentialSavingImpact: 2500,
        priority: 3,
        isSystemTip: true,
        isActive: true,
      },
    ]);

    // 7. Create Announcements
    await Announcement.insertMany([
      {
        title: '🎓 Welcome to Campus Coin Fall Semester!',
        message: 'Take control of your student budget, set category limits, and track your allowance easily with automated tips and insights.',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: admin._id,
      },
      {
        title: '💡 Tip of the Week: CSV Import is Live',
        message: 'Export your monthly bank or mobile wallet statement as CSV and import it in one click under Transactions > Import CSV.',
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: admin._id,
      },
    ]);

    // 8. Create Initial Monthly Insight for Student
    await Insight.create({
      userId: student._id,
      month: currentMonthString,
      summaryText: `Your spending in ${currentMonthString} is well-balanced across food and academic supplies. Total expenses are currently tracking safely within your monthly allowance baseline.`,
      tipText: 'Your food spending is approaching 75% of your allocated budget. Consider preparing meals in your hostel kitchen this coming weekend to maintain healthy savings.',
      topCategory: 'Food',
      spendingChangePct: 4,
      totalSpent: 26500,
      generatedAt: new Date(),
    });

    // 9. Create Sample Notifications
    await Notification.insertMany([
      {
        userId: student._id,
        title: '✨ Welcome to Campus Coin!',
        message: 'Your student account is active. Explore your dashboard to view your real-time balance and budgets.',
        type: 'system',
        link: '/dashboard',
        isRead: false,
      },
      {
        userId: student._id,
        title: '⚠️ Budget Alert: Food',
        message: `You have used 75% of your $30,000 Food budget for ${currentMonthString}.`,
        type: 'budget_warning',
        link: '/budgets',
        isRead: false,
      },
      {
        userId: student._id,
        title: '💡 New Personalized Saving Tip',
        message: 'Campus Coin noticed your food spending increased slightly. Check out new batch-cooking tips!',
        type: 'saving_tip',
        link: '/saving-tips',
        isRead: true,
      },
    ]);

    console.log('✅ Demo data seeded successfully:');
    console.log('   Admin:   admin@campuscoin.local / Admin@12345');
    console.log('   Student: student@campuscoin.local / Student@12345');
  } catch (err: any) {
    console.error('❌ Error during seeding:', err.message);
  }
};
