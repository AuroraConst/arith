/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import type { Module } from '../language/generated/ast.js';
import { NodeFileSystem } from 'langium/node';
import { createArithServices } from '../language/arith-module.js';
// import { ArithLanguageMetaData } from '../language/generated/module.js';
import { extractDocument } from './cli-util.js';
import chalk from 'chalk';
import { interpretEvaluations } from '../language/arith-evaluator.js';

export const evalAction = async (fileName: string): Promise<void> => {
    const services = createArithServices(NodeFileSystem).Arith
    const document = await extractDocument(fileName,  services);
    const module = document.parseResult.value;
    for (const [evaluation, value] of interpretEvaluations(module as Module)) {
        const cstNode = evaluation.expression.$cstNode;
        if (cstNode) {
            const line = cstNode.range.start.line + 1;
            console.log(`line ${line}:`, chalk.green(cstNode.text), '===>', value);
        }
    }
};


// export const evalSjs = async (fileName: string): Promise<string> => {
//     const services = createArithServices(NodeFileSystem).Arith
//     const document = await extractDocument(fileName,  services);
//     const module = document.parseResult.value;
//     for (const [evaluation, value] of interpretEvaluations(module as Module)) {
//         const cstNode = evaluation.expression.$cstNode;
//         if (cstNode) {
            // const line = cstNode.range.start.line + 1;
            // console.log(`line ${line}:`, chalk.green(cstNode.text), '===>', value);
//         }
//     }
// };
