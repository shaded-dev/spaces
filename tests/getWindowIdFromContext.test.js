/**
 * Unit tests for getWindowIdFromContext function in popup.js
 * Tests the window ID bug fix that ensures the correct window ID is selected
 * based on URL hash parameters (quick-switch mode) vs current window (extension icon).
 */

import { getWindowIdFromContext } from '../js/popup.js';

describe('getWindowIdFromContext', () => {
    describe('Window ID from URL hash (quick-switch mode)', () => {
        it('should use windowId from hash when present and valid', () => {
            const urlString = 'popup.html#windowId=456&action=switch';
            const currentWindowId = 100;

            const result = getWindowIdFromContext(urlString, currentWindowId);

            expect(result).toBe(456);
        });

        it('should handle parameters in different order', () => {
            const urlString = 'popup.html#action=switch&tabId=10&windowId=777&sessionName=test';
            const currentWindowId = 100;

            const result = getWindowIdFromContext(urlString, currentWindowId);

            expect(result).toBe(777);
        });
    });

    describe('Fallback to current window', () => {
        it('should use current window when windowId is not in hash', () => {
            const urlString = 'popup.html#action=switch';
            const currentWindowId = 100;

            const result = getWindowIdFromContext(urlString, currentWindowId);

            expect(result).toBe(100);
        });

        it('should use current window when windowId is "false"', () => {
            const urlString = 'popup.html#windowId=false';
            const currentWindowId = 100;

            const result = getWindowIdFromContext(urlString, currentWindowId);

            expect(result).toBe(100);
        });

        it('should use current window when no hash present', () => {
            const urlString = 'popup.html';
            const currentWindowId = 100;

            const result = getWindowIdFromContext(urlString, currentWindowId);

            expect(result).toBe(100);
        });
    });

    describe('Invalid window ID values', () => {
        it('should return false when windowId is NaN', () => {
            const urlString = 'popup.html#windowId=invalid';
            const currentWindowId = 100;

            const result = getWindowIdFromContext(urlString, currentWindowId);

            expect(result).toBe(false);
        });

        it('should return false when windowId is zero or negative', () => {
            expect(getWindowIdFromContext('popup.html#windowId=0', 100)).toBe(false);
            expect(getWindowIdFromContext('popup.html#windowId=-5', 100)).toBe(false);
        });

        it('should return false when current window ID is invalid', () => {
            expect(getWindowIdFromContext('popup.html', 0)).toBe(false);
            expect(getWindowIdFromContext('popup.html', -1)).toBe(false);
        });

        it('should return false when currentWindowId is null and no hash value', () => {
            const result = getWindowIdFromContext('popup.html', null);
            expect(result).toBe(false);
        });
    });

    describe('Bug fix verification', () => {
        it('BUG FIX: should prioritize hash windowId over currentWindowId in quick-switch mode', () => {
            // This is the core bug that was fixed
            // The popup window itself has ID 100, but we want to use the original window ID 456
            const urlString = 'popup.html#windowId=456&action=switch';
            const currentWindowId = 100; // This would be the popup window's ID

            const result = getWindowIdFromContext(urlString, currentWindowId);

            // MUST use 456 from hash, NOT 100 from currentWindowId
            expect(result).toBe(456);
        });

        it('should use currentWindowId when opened from extension icon (no hash)', () => {
            const result = getWindowIdFromContext('popup.html', 200);
            expect(result).toBe(200);
        });
    });
});
