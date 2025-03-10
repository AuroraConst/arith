import type { ValidationChecks } from 'langium';
import type { ArithAstType } from './generated/ast.js';
import type { ArithServices } from './arith-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ArithServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ArithValidator;
    const checks: ValidationChecks<ArithAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ArithValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

}
