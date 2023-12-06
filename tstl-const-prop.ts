import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';

// Find every instance of creating a local with an ALL_CAPS label
const pattern = /local\s([A-Z_0-9]+)\s=\s(.+)/g;
// Variable to capture matches
let match: RegExpExecArray | null;
// Running only once doesn't find all values, so we re-run the function this many times
const maxLoop = 200;

function constProp(file: tstl.EmitFile) {
	while ((match = pattern.exec(file.code)) !== null) {
		const statement = match[0];
		const label = match[1];
		const value = match[2].trim();
		// Find only values that are simple literals (numbers and strings)
		if (
			(value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
			!isNaN(value as unknown as number)
		) {
			// Replace local declaration with an empty line
			file.code = file.code.replace(statement, '');
			// Replace label with value
			const findLabel = new RegExp(`(${label})`, 'g');
			file.code = file.code.replace(findLabel, value);
		}
	}
}

const plugin: tstl.Plugin = {
	afterEmit: (
		_program: ts.Program,
		_options: tstl.CompilerOptions,
		emitHost: tstl.EmitHost,
		result: tstl.EmitFile[],
	) => {
		for (const file of result) {
			for (let index = 0; index < maxLoop; index++) {
				constProp(file);
			}
			// Write the changed code
			emitHost.writeFile(file.outputPath, file.code, false);
		}
	},
};

export default plugin;
