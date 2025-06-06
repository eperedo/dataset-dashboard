import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";
import { format, subDays, subMonths, subYears } from "date-fns";

type PeriodTypeAttrs = {
    id: string;
    code: string;
};

export class PeriodType extends Struct<PeriodTypeAttrs>() {
    static getLatest(code: string): Maybe<string> {
        const periods = this.buildPeriods(code);
        return periods[0];
    }

    static buildPeriods(code: string): string[] {
        const now = new Date();

        switch (code) {
            case "Yearly":
                return Array.from({ length: 10 }, (_, i) => format(subYears(now, i), "yyyy"));

            case "Monthly":
                return Array.from({ length: 24 }, (_, i) => format(subMonths(now, i), "yyyyMM"));

            case "BiMonthly":
                return Array.from(
                    { length: 12 },
                    (_, i) => `${format(subMonths(now, i * 2), "yyyyMM")}B`
                );

            case "Quarterly":
                return Array.from({ length: 8 }, (_, i) =>
                    this.formatQuarter(subMonths(now, i * 3))
                );

            case "Weekly":
                return Array.from({ length: 26 }, (_, i) => this.formatWeekly(subDays(now, i * 7)));

            case "Daily":
                return Array.from({ length: 30 }, (_, i) => format(subDays(now, i), "yyyyMMdd"));

            case "BiWeekly":
                return Array.from({ length: 12 }, (_, i) => {
                    const start = subDays(now, i * 14);
                    const biWeek = Math.ceil(start.getDate() / 14);
                    return `${format(start, "yyyy")}BiW${biWeek}`;
                });

            case "SixMonthly":
                return Array.from({ length: 6 }, (_, i) => {
                    const date = subMonths(now, i * 6);
                    const half = date.getMonth() < 6 ? "1" : "2";
                    return `${date.getFullYear()}S${half}`;
                });

            case "FinancialApril":
                return Array.from(
                    { length: 10 },
                    (_, i) => `${format(subYears(now, i), "yyyy")}April`
                );

            case "FinancialJuly":
                return Array.from(
                    { length: 10 },
                    (_, i) => `${format(subYears(now, i), "yyyy")}July`
                );

            case "FinancialOct":
                return Array.from(
                    { length: 10 },
                    (_, i) => `${format(subYears(now, i), "yyyy")}Oct`
                );

            case "FinancialNov":
                return Array.from(
                    { length: 10 },
                    (_, i) => `${format(subYears(now, i), "yyyy")}Nov`
                );

            default:
                return [];
        }
    }

    private static formatQuarter(date: Date): string {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `${date.getFullYear()}Q${quarter}`;
    }

    private static formatWeekly(date: Date): string {
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + oneJan.getDay() + 1) / 7);
        return `${date.getFullYear()}W${week}`;
    }
}
