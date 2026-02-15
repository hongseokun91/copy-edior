
import { describe, it, expect } from 'vitest';
import { checkCompliance } from './compliance';

describe('Compliance Engine', () => {
    it('blocks absolute medical claims', async () => {
        const text = 'This pill will provide a permanent fix for your pain.';
        const result = await checkCompliance(text);

        expect(result.status).toBe('fail');
        expect(result.violations[0].ruleName).toBe('No Absolute Medical Claims');
    });

    it('warns on financial promises', async () => {
        const text = 'Learn how to generate passive income easily.';
        const result = await checkCompliance(text);

        expect(result.status).toBe('warn');
        expect(result.violations[0].ruleName).toBe('Financial Promise Constraint');
    });

    it('passes safe content', async () => {
        const text = 'Check out our new summer collection!';
        const result = await checkCompliance(text);

        expect(result.status).toBe('pass');
        expect(result.violations).toHaveLength(0);
    });
});
