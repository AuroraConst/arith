import { expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Module, Evaluation } from '../../src/language/generated/ast.js';
import { interpretEvaluations } from '../../src/language/arith-evaluator.js';
import { parse } from '../../out/cli/cli-util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestCase {
    expression: string;
    computed: number;
    expected: number;
}

test('ArithParserTest: binaryexpressions file works', async () => {
    try {
        const filePath = path.resolve(__dirname, 'resources', 'math2.arith');
        const fileContent = fs.readFileSync(filePath, 'utf-8');


        const module = await parse(filePath) as Module;
        expect(module.name).toBe('binaryexpressions');


        const results = interpretEvaluations(module);

        const lines = fileContent.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('module'));


        expect(results.size).toBe(lines.length);


        const testCases: TestCase[] = [];
        let index = 0;

        results.forEach((computedValue, evaluation) => {
            const originalExpression = lines[index].replace(';', '');
            const computed = Number(computedValue);
            const expected = safeEvaluate(originalExpression);

            testCases.push({
                expression: originalExpression,
                computed,
                expected
            });

            index++;
        });


        testCases.forEach(({ expression, computed, expected }) => {
            console.log(`Testing: ${expression} → Computed: ${computed}, Expected: ${expected}`);
            expect(computed, `Mismatch in expression: ${expression}`).toBe(expected);
        });

    } catch (e) {
        console.error('Test failed:', e);
        throw e;
    }
});

function safeEvaluate(expression: string): number {

    const jsExpression = expression
        .replace(/\^/g, '**')
        .replace(/%/g, '%')
        .replace(/\//g, '/')
        .replace(/\*/g, '*');

    try {

        return Function(`"use strict"; return (${jsExpression})`)();
    } catch (error) {
        throw new Error(`Failed to evaluate expression: ${expression} - ${error}`);
    }
}