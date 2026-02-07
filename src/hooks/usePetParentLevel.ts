import { useMemo } from 'react';
import { usePets, useExpenses, useBudgets } from './usePetData';
import { startOfMonth, endOfMonth, isWithinInterval, differenceInDays, parseISO } from 'date-fns';

// Level configuration
export const LEVEL_CONFIG = [
    { level: 1, title: 'Newcomer', minXP: 0 },
    { level: 2, title: 'Beginner', minXP: 100 },
    { level: 3, title: 'Rookie', minXP: 250 },
    { level: 4, title: 'Learner', minXP: 500 },
    { level: 5, title: 'Explorer', minXP: 850 },
    { level: 6, title: 'Caretaker', minXP: 1300 },
    { level: 7, title: 'Companion', minXP: 1850 },
    { level: 8, title: 'Guardian', minXP: 2500 },
    { level: 9, title: 'Protector', minXP: 3300 },
    { level: 10, title: 'Devoted', minXP: 4200 },
    { level: 11, title: 'Expert', minXP: 5300 },
    { level: 12, title: 'Master', minXP: 6500 },
    { level: 13, title: 'Champion', minXP: 8000 },
    { level: 14, title: 'Legend', minXP: 10000 },
    { level: 15, title: 'Ultimate', minXP: 12500 },
];

// XP rewards for different actions
const XP_REWARDS = {
    PER_EXPENSE: 10,           // XP per expense logged
    PER_PET: 50,               // XP per pet added
    PER_BUDGET_SET: 25,        // XP per budget category configured
    UNIQUE_EXPENSE_DAY: 15,    // XP for each unique day with an expense
    UNDER_BUDGET_BONUS: 100,   // Bonus XP for staying under budget for all categories
    STREAK_MULTIPLIER: 5,      // XP per day of streak
};

export interface LevelInfo {
    level: number;
    title: string;
    currentXP: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpProgress: number;        // XP earned within current level
    xpNeeded: number;          // XP needed for next level
    progressPercentage: number;
    isMaxLevel: boolean;
}

export interface StreakInfo {
    currentStreak: number;
    lastActivityDate: string | null;
}

export function usePetParentLevel() {
    const { pets } = usePets();
    const { expenses } = useExpenses();
    const { budgets } = useBudgets();

    // Calculate streak based on consecutive days with expenses
    const streakInfo = useMemo((): StreakInfo => {
        if (expenses.length === 0) {
            return { currentStreak: 0, lastActivityDate: null };
        }

        // Get unique dates with expenses, sorted descending
        const expenseDates = [...new Set(
            expenses.map(e => new Date(e.date).toISOString().split('T')[0])
        )].sort((a, b) => b.localeCompare(a));

        if (expenseDates.length === 0) {
            return { currentStreak: 0, lastActivityDate: null };
        }

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Check if the most recent expense is today or yesterday (streak still active)
        const lastActivityDate = expenseDates[0];
        if (lastActivityDate !== today && lastActivityDate !== yesterday) {
            return { currentStreak: 0, lastActivityDate };
        }

        // Count consecutive days
        let streak = 1;
        for (let i = 0; i < expenseDates.length - 1; i++) {
            const currentDate = new Date(expenseDates[i]);
            const prevDate = new Date(expenseDates[i + 1]);
            const diffDays = differenceInDays(currentDate, prevDate);

            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }

        return { currentStreak: streak, lastActivityDate };
    }, [expenses]);

    // Calculate total XP from all activities
    const totalXP = useMemo(() => {
        let xp = 0;

        // XP from expenses logged
        xp += expenses.length * XP_REWARDS.PER_EXPENSE;

        // XP from pets added
        xp += pets.length * XP_REWARDS.PER_PET;

        // XP from budgets configured
        xp += budgets.length * XP_REWARDS.PER_BUDGET_SET;

        // XP from unique expense days (consistency bonus)
        const uniqueDays = new Set(
            expenses.map(e => new Date(e.date).toISOString().split('T')[0])
        );
        xp += uniqueDays.size * XP_REWARDS.UNIQUE_EXPENSE_DAY;

        // XP from current streak
        xp += streakInfo.currentStreak * XP_REWARDS.STREAK_MULTIPLIER;

        // Check if under budget for all categories this month
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        const thisMonthExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
        });

        // Group expenses by category
        const spendingByCategory: Record<string, number> = {};
        thisMonthExpenses.forEach(e => {
            spendingByCategory[e.category] = (spendingByCategory[e.category] || 0) + e.amount;
        });

        // Check if all budget categories are under limit
        let allUnderBudget = true;
        budgets.forEach(budget => {
            const spent = spendingByCategory[budget.category] || 0;
            if (spent > budget.monthlyLimit) {
                allUnderBudget = false;
            }
        });

        if (budgets.length > 0 && allUnderBudget) {
            xp += XP_REWARDS.UNDER_BUDGET_BONUS;
        }

        return xp;
    }, [pets, expenses, budgets, streakInfo]);

    // Calculate level info from total XP
    const levelInfo = useMemo((): LevelInfo => {
        // Find current level based on XP
        let currentLevelConfig = LEVEL_CONFIG[0];
        let nextLevelConfig = LEVEL_CONFIG[1];

        for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
            if (totalXP >= LEVEL_CONFIG[i].minXP) {
                currentLevelConfig = LEVEL_CONFIG[i];
                nextLevelConfig = LEVEL_CONFIG[i + 1] || null;
                break;
            }
        }

        const isMaxLevel = !nextLevelConfig;
        const xpForCurrentLevel = currentLevelConfig.minXP;
        const xpForNextLevel = nextLevelConfig?.minXP || currentLevelConfig.minXP;

        const xpProgress = totalXP - xpForCurrentLevel;
        const xpNeeded = isMaxLevel ? 0 : xpForNextLevel - totalXP;
        const levelRange = xpForNextLevel - xpForCurrentLevel;
        const progressPercentage = isMaxLevel ? 100 : Math.min(100, (xpProgress / levelRange) * 100);

        return {
            level: currentLevelConfig.level,
            title: currentLevelConfig.title,
            currentXP: totalXP,
            xpForCurrentLevel,
            xpForNextLevel,
            xpProgress,
            xpNeeded,
            progressPercentage,
            isMaxLevel,
        };
    }, [totalXP]);

    return {
        levelInfo,
        streakInfo,
        totalXP,
        xpRewards: XP_REWARDS,
        levelConfig: LEVEL_CONFIG,
    };
}
