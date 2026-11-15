// Calendar days in the visitor's own time zone, as "YYYY-MM-DD" strings.
// Streaks and review schedules count days, and a day should end at the
// visitor's midnight, not UTC's.

export const localDay = (date: Date = new Date()): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** The day `days` after `day` ("2026-11-15", 3 -> "2026-11-18") */
export const addDays = (day: string, days: number): string => {
    const [y, m, d] = day.split('-').map(Number);
    return localDay(new Date(y, m - 1, d + days));
};

/** Whole days from `from` to `to` (negative when `to` is earlier) */
export const daysBetween = (from: string, to: string): number => {
    const toDate = (day: string) => {
        const [y, m, d] = day.split('-').map(Number);
        return Date.UTC(y, m - 1, d);
    };
    return Math.round((toDate(to) - toDate(from)) / 86_400_000);
};
