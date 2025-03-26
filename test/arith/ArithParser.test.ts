import { expect, test } from 'vitest';
import { URI } from 'vscode-uri';
import { createArithServices } from '../../src/language/arith-module.js';
import { interpretEvaluations } from '../../src/language/arith-evaluator.js';
import { isBinaryExpression, BinaryExpression, NumberLiteral, Module, Evaluation } from '../../src/language/generated/ast.js';
import fs from 'fs';
import path from 'path';
import { parse } from '../../out/cli/cli-util.js';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestBinaryExpression {
    isBinary: boolean;
    left: number;
    right: number;
    operator: string;
    value: number;
}

test('ArithParserTest: binaryexpressions file works', async () => {
    try {
        const filePath = path.resolve(__dirname, 'resources', 'math1.arith');
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse the AST
        const module = await parse(filePath) as Module;

        // Interpret evaluations
        const results = interpretEvaluations(module);

        // Process results
        const testCases: TestBinaryExpression[] = [];

        results.forEach((value, key: Evaluation) => {
            const expr = key.expression;
            if (isBinaryExpression(expr)) {
                const left = (expr.left as NumberLiteral).value;
                const right = (expr.right as NumberLiteral).value;
                testCases.push({
                    isBinary: true,
                    left: Number(left),
                    right: Number(right),
                    operator: expr.operator,
                    value: Number(value)
                });
            }
        });

        // Log results for verification
        console.log('Test cases:');
        testCases.forEach(tc => {
            console.log(`${tc.left} ${tc.operator} ${tc.right} = ${tc.value}`);
        });

        // Assertions
        expect(module.name).toBe('binaryexpressions');
        expect(testCases.length).toBe(6);

        // Verify specific operations if needed
        expect(testCases).toEqual(expect.arrayContaining([
            expect.objectContaining({ operator: '*', left: 3, right: 6, value: 18 }),
            expect.objectContaining({ operator: '+', left: 5, right: 2, value: 7 }),
            expect.objectContaining({ operator: '/', left: 6, right: 4, value: 1.5 }),
            expect.objectContaining({ operator: '-', left: 1, right: 5, value: -4 }),
            expect.objectContaining({ operator: '^', left: 5, right: 2, value: 25 }),
            expect.objectContaining({ operator: '%', left: 5, right: 2, value: 1 })
        ]));

    } catch (e) {
        console.error('Test failed:', e);
        throw e;
    }
});