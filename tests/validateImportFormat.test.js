/**
 * @jest-environment node
 */

import { validateImportFormat } from '../js/spaces.js';

describe('validateImportFormat', () => {
    describe('empty input', () => {
        test('should reject empty string', () => {
            const result = validateImportFormat('');
            expect(result.valid).toBe(false);
            expect(result.type).toBe('empty');
            expect(result.error).toContain('No content');
        });

        test('should reject whitespace-only string', () => {
            const result = validateImportFormat('   \n  \t  ');
            expect(result.valid).toBe(false);
            expect(result.type).toBe('empty');
        });

        test('should reject null', () => {
            const result = validateImportFormat(null);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('empty');
        });

        test('should reject undefined', () => {
            const result = validateImportFormat(undefined);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('empty');
        });
    });

    describe('valid JSON backup format', () => {
        test('should accept valid backup with single space', () => {
            const backup = JSON.stringify([
                {
                    name: 'Test Space',
                    tabs: [
                        { title: 'Tab 1', url: 'https://example.com' }
                    ]
                }
            ]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('json');
            expect(result.data).toHaveLength(1);
            expect(result.data[0].name).toBe('Test Space');
        });

        test('should accept valid backup with multiple spaces', () => {
            const backup = JSON.stringify([
                {
                    name: 'Space 1',
                    tabs: [{ title: 'Tab 1', url: 'https://example.com' }]
                },
                {
                    name: 'Space 2',
                    tabs: [{ title: 'Tab 2', url: 'https://test.com' }]
                }
            ]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('json');
            expect(result.data).toHaveLength(2);
        });

        test('should accept backup with empty tabs array', () => {
            const backup = JSON.stringify([
                { name: 'Empty Space', tabs: [] }
            ]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('json');
        });

        test('should accept backup with additional properties', () => {
            const backup = JSON.stringify([
                {
                    name: 'Space',
                    tabs: [{ title: 'Tab', url: 'https://example.com' }],
                    history: [],
                    created: '2026-01-14'
                }
            ]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(true);
        });
    });

    describe('invalid JSON backup format', () => {
        test('should reject JSON object (not array)', () => {
            const backup = JSON.stringify({
                name: 'Space',
                tabs: [{ url: 'https://example.com' }]
            });
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('json');
            expect(result.error).toContain('array');
        });

        test('should reject empty array', () => {
            const backup = JSON.stringify([]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('json');
            expect(result.error).toContain('no spaces');
        });

        test('should reject space without name', () => {
            const backup = JSON.stringify([
                { tabs: [{ url: 'https://example.com' }] }
            ]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('json');
            expect(result.error).toContain('name and tabs');
        });

        test('should reject space without tabs', () => {
            const backup = JSON.stringify([
                { name: 'Space' }
            ]);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('json');
            expect(result.error).toContain('name and tabs');
        });

        test('should reject malformed JSON', () => {
            const result = validateImportFormat('{ invalid json }');
            expect(result.valid).toBe(false);
            expect(result.type).toBe('unknown');
        });
    });

    describe('valid URL list format', () => {
        test('should accept single URL', () => {
            const result = validateImportFormat('https://example.com');
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(1);
            expect(result.data[0]).toBe('https://example.com');
        });

        test('should accept multiple URLs', () => {
            const urls = 'https://example.com\nhttps://test.com\nhttps://github.com';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(3);
        });

        test('should accept URLs with different protocols', () => {
            const urls = 'https://example.com\nhttp://test.com\nftp://files.com';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(3);
        });

        test('should filter out empty lines', () => {
            const urls = 'https://example.com\n\n\nhttps://test.com\n';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(2);
        });

        test('should filter out lines without protocol', () => {
            const urls = 'https://example.com\ntest.com\nhttps://github.com';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(2);
            expect(result.data).not.toContain('test.com');
        });

        test('should handle URLs with whitespace', () => {
            const urls = '  https://example.com  \n  https://test.com  ';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(2);
        });
    });

    describe('invalid formats', () => {
        test('should reject plain text without URLs', () => {
            const result = validateImportFormat('Just some random text');
            expect(result.valid).toBe(false);
            expect(result.type).toBe('unknown');
            expect(result.error).toContain('No valid URLs or JSON');
        });

        test('should reject numbers', () => {
            const result = validateImportFormat('12345');
            expect(result.valid).toBe(false);
        });

        test('should reject partial URLs without protocol', () => {
            const urls = 'example.com\ntest.com\ngithub.com';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(false);
            expect(result.type).toBe('unknown');
        });
    });

    describe('edge cases', () => {
        test('should handle very long URL list', () => {
            const urls = Array(100).fill('https://example.com').join('\n');
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
            expect(result.data).toHaveLength(100);
        });

        test('should handle very long backup', () => {
            const spaces = Array(50).fill(null).map((_, i) => ({
                name: `Space ${i}`,
                tabs: [{ url: 'https://example.com' }]
            }));
            const backup = JSON.stringify(spaces);
            
            const result = validateImportFormat(backup);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('json');
            expect(result.data).toHaveLength(50);
        });

        test('should handle mixed line endings', () => {
            const urls = 'https://example.com\rhttps://test.com\r\nhttps://github.com\n';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
        });

        test('should handle URLs with special characters', () => {
            const urls = 'https://example.com/path?query=value&other=test#anchor';
            const result = validateImportFormat(urls);
            expect(result.valid).toBe(true);
            expect(result.type).toBe('txt');
        });
    });

    describe('return value structure', () => {
        test('valid result should have type, valid, and data', () => {
            const result = validateImportFormat('https://example.com');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('data');
            expect(result).not.toHaveProperty('error');
        });

        test('invalid result should have type, valid, and error', () => {
            const result = validateImportFormat('invalid');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('error');
            expect(result).not.toHaveProperty('data');
        });
    });
});
