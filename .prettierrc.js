/**
 * @description Config codingStyle
 * This file is a simple example of prettier config
 * Every prettier rules can be find on this page below
 * https://prettier.io/docs/en/options.html
 */

module.exports = {
	semi: false,          /* Enable semi columns to end line */
	trailingComma: "all", /* Enable trailing comma on json   */
	singleQuote: false,   /* Set 'single' quote on string    */
	printWidth: 120,      /* Set max line width              */
	useTabs: false,       /* Use tab instead of space        */
	tabWidth: 2,          /* Set tab width                   */
	bracketSpacing: true, /* Add space between bracket       */
	parser: "typescript", /* Use typescript parser           */
};
