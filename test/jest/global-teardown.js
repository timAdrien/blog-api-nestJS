'user strict';
const jestLeakFixer = require('jest-leak-fixer');

module.exports = () => {
    jestLeakFixer.restore();
};