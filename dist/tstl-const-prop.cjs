"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Find every instance of creating a local with an ALL_CAPS label
const pattern = /local\s([A-Z_0-9]+)\s=\s(.+)/g;
// Variable to capture matches
let match;
// Running only once doesn't find all values, so we re-run the function this many times
const maxLoop = 200;
function constProp(file) {
    while ((match = pattern.exec(file.code)) !== null) {
        const statement = match[0];
        const label = match[1];
        const value = match[2].trim();
        // Find only values that are simple literals (numbers and strings)
        if ((value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
            !isNaN(value)) {
            // Replace local declaration with an empty line
            file.code = file.code.replace(statement, '');
            // Replace label with value
            const findLabel = new RegExp(`(${label})`, 'g');
            file.code = file.code.replace(findLabel, value);
        }
    }
}
const plugin = {
    afterEmit: (_program, _options, emitHost, result) => {
        for (const file of result) {
            for (let index = 0; index < maxLoop; index++) {
                constProp(file);
            }
            // Write the changed code
            emitHost.writeFile(file.outputPath, file.code, false);
        }
    },
};
exports.default = plugin;
