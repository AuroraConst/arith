import { expect, test } from 'vitest';
import { URI } from 'vscode-uri';
import { createArithServices } from '../../src/language/arith-module.js';
import { interpretEvaluations } from '../../src/language/arith-evaluator.js';
import { isBinaryExpression, BinaryExpression, NumberLiteral } from '../../src/language/generated/ast.js';

import fs from 'fs';
import path from 'path';

test('ArithParserTest: binaryexpressions file works', async () => {
    
    const services = createArithServices().Arith;

    const platform = process.platform;
    console.log(`Platform: ${platform}`)

    const filePath = path.resolve(__dirname,'resources', 'math1.arith');  
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const document = services.shared.workspace.LangiumDocumentFactory.fromString(fileContent, URI.file(filePath));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    const module = document.parseResult.value;

    const result = interpretEvaluations(module);
    
    const output = Object.entries(result).map(([key, value]) => {
        const evaluation = key as any;
        const expr = evaluation.expression;

        if (!isBinaryExpression(expr)) throw new Error("Expected a binary expression");

        const binary = expr as BinaryExpression;
        const left = (binary.left as NumberLiteral).value;
        const right = (binary.right as NumberLiteral).value;
        const operator = binary.operator;

        const line = `${left} ${operator} ${right} = ${value}`;
        console.log(line);

        return line;
    });

    expect(output.length).toBe(6);
});
