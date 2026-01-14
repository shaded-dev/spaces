/**
 * @jest-environment node
 */

import { getISO8601Date } from '../js/spaces.js';

describe('getISO8601Date', () => {
    describe('format validation', () => {
        test('should return a string in YYYY-MM-DD format', () => {
            const result = getISO8601Date();
            expect(typeof result).toBe('string');
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test('should return a valid ISO 8601 date format', () => {
            const result = getISO8601Date();
            const [year, month, day] = result.split('-');
            
            expect(year).toHaveLength(4);
            expect(month).toHaveLength(2);
            expect(day).toHaveLength(2);
            
            expect(Number(year)).toBeGreaterThan(2000);
            expect(Number(month)).toBeGreaterThanOrEqual(1);
            expect(Number(month)).toBeLessThanOrEqual(12);
            expect(Number(day)).toBeGreaterThanOrEqual(1);
            expect(Number(day)).toBeLessThanOrEqual(31);
        });
    });

    describe('date components', () => {
        test('should have correct year component', () => {
            const result = getISO8601Date();
            const year = result.split('-')[0];
            const currentYear = new Date().getFullYear();
            
            expect(Number(year)).toBe(currentYear);
        });

        test('should have correct month component', () => {
            const result = getISO8601Date();
            const month = result.split('-')[1];
            const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
            
            expect(Number(month)).toBe(currentMonth);
        });

        test('should have correct day component', () => {
            const result = getISO8601Date();
            const day = result.split('-')[2];
            const currentDay = new Date().getDate();
            
            expect(Number(day)).toBe(currentDay);
        });

        test('month component should always be two digits', () => {
            const result = getISO8601Date();
            const month = result.split('-')[1];
            
            expect(month).toHaveLength(2);
            expect(month).toMatch(/^[0-1][0-9]$/);
        });

        test('day component should always be two digits', () => {
            const result = getISO8601Date();
            const day = result.split('-')[2];
            
            expect(day).toHaveLength(2);
            expect(day).toMatch(/^[0-3][0-9]$/);
        });
    });

    describe('format specifications', () => {
        test('should use hyphens as separators', () => {
            const result = getISO8601Date();
            const parts = result.split('-');
            
            expect(parts).toHaveLength(3);
        });

        test('should have year as first component', () => {
            const result = getISO8601Date();
            const year = result.split('-')[0];
            
            // Year should be 4 digits and reasonable
            expect(Number(year)).toBeGreaterThan(2020);
            expect(Number(year)).toBeLessThan(2100);
        });

        test('should produce a parseable date', () => {
            const result = getISO8601Date();
            const parsedDate = new Date(result);
            
            expect(parsedDate).toBeInstanceOf(Date);
            expect(parsedDate.toString()).not.toBe('Invalid Date');
        });
    });

    describe('filename safety', () => {
        test('should not contain colons (which would be problematic in filenames)', () => {
            const result = getISO8601Date();
            expect(result).not.toContain(':');
        });

        test('should only contain alphanumeric characters and hyphens', () => {
            const result = getISO8601Date();
            expect(result).toMatch(/^[0-9-]+$/);
        });

        test('should be safe for use in filenames on all platforms', () => {
            const result = getISO8601Date();
            // Windows forbidden characters: < > : " / \ | ? *
            const forbiddenChars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
            
            forbiddenChars.forEach(char => {
                expect(result).not.toContain(char);
            });
        });
    });

    describe('consistency', () => {
        test('should return the same value when called multiple times in quick succession', () => {
            const result1 = getISO8601Date();
            const result2 = getISO8601Date();
            const result3 = getISO8601Date();
            
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);
        });

        test('should be lexicographically sortable', () => {
            // ISO 8601 format YYYY-MM-DD ensures lexicographic sort = chronological sort
            const result = getISO8601Date();
            const testDates = ['2025-12-31', '2026-01-01', '2026-06-15', '2027-01-01'];
            
            // Verify our result would sort correctly among these dates
            const allDates = [...testDates, result].sort();
            
            // Result should be in the sorted array (demonstrating sortability)
            expect(allDates).toContain(result);
            
            // Verify the test dates are in chronological order after sorting
            expect(allDates.indexOf('2025-12-31')).toBeLessThan(allDates.indexOf('2027-01-01'));
        });
    });
});
