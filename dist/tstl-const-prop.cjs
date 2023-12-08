'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// Find every instance of creating a local with an ALL_CAPS label
const pattern = /local\s([A-Z_0-9]+)\s=\s(.+)/g;
// Variable to capture matches
let match;
// Running only once doesn't find all values, so we re-run the function this many times
const maxLoop = 100;
function constProp(file) {
	while ((match = pattern.exec(file.code)) !== null) {
		const statement = match[0];
		const label = match[1];
		const value = match[2].trim();
		// Find only values that are simple literals (numbers and strings)
		if (
			(value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
			!isNaN(value)
		) {
			// Replace local declaration with an empty line
			file.code = file.code.replace(statement, '');
			// Replace label with value
			const findLabel = new RegExp(`(${label})(?!\\w)`, 'g');
			file.code = file.code.replace(findLabel, value);
		}
	}
}
function evaluateExpression(expression) {
	const operators = /[+\-*/%^]/;
	const parts = expression.split(operators);
	// Check if both sides are valid numbers
	const bothSidesAreNumbers = parts.every((part) => !isNaN(part));
	if (!bothSidesAreNumbers) {
		return null;
	}
	const numbers = expression.split(/([+\-*/%^])/).map((part) => {
		return operators.test(part) ? part : Number(part);
	});
	let result = numbers[0];
	if (typeof result !== 'number' || isNaN(result)) {
		return null; // Return null if the operand is not a valid number
	}
	for (let i = 1; i < numbers.length; i += 2) {
		const operator = numbers[i];
		const operand = numbers[i + 1];
		if (typeof operand !== 'number' || isNaN(operand)) {
			return null; // Return null if the operand is not a valid number
		}
		switch (operator) {
			case '+':
				result += operand;
				break;
			case '-':
				result -= operand;
				break;
			case '*':
				result *= operand;
				break;
			case '/':
				result /= operand;
				break;
			case '%':
				result %= operand;
				break;
			case '^':
				result **= operand;
				break;
			default:
				break;
		}
	}
	if (isNaN(result)) {
		return null;
	}
	return result;
}
function constUnroll(file) {
	// Define a regular expression to match lines with assignments
	const assignmentRegex = /\s*=\s*([^\n]+)\s*/g;
	// Iterate through matches in the code
	let match;
	while ((match = assignmentRegex.exec(file.code)) !== null) {
		const originalLine = match[0];
		const equation = match[1].trim();
		// Replace expressions within parentheses first
		const regex = /\(([^()]+)\)/g;
		let updatedEquation = equation;
		let subMatch;
		while ((subMatch = regex.exec(equation)) !== null) {
			const subExpression = subMatch[1];
			const subExpressionResult = evaluateExpression(subExpression);
			if (subExpressionResult !== null) {
				updatedEquation = updatedEquation.replace(
					`(${subExpression})`,
					subExpressionResult.toString(),
				);
			}
		}
		// Evaluate the updated equation in order of BEDMAS/BODMAS without using eval
		const result = evaluateExpression(updatedEquation);
		if (result !== null) {
			// Replace the original equation with the result
			const replacement = originalLine.replace(/\s*=\s*[^\n]+/, ` = ${result}`);
			file.code = file.code.replace(originalLine, replacement);
		} else {
			// Silently skip the case where the equation couldn't be evaluated
		}
	}
}
const plugin = {
	afterEmit: (_program, _options, emitHost, result) => {
		for (const file of result) {
			// Alternate between propagation and unrolling
			for (let index = 0; index < maxLoop; index++) {
				constProp(file);
				constUnroll(file);
			}
			// Write the changed code
			emitHost.writeFile(file.outputPath, file.code, false);
		}
	},
};
exports.default = plugin;
