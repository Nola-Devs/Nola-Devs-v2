import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize an HTML string of everything but `<p>` and `<a>`.
 * @param {string} dirty
 * @returns {string} An HTML string sanitized of all HTML tags other than `<p>` and `<a>`.
 * @see https://www.npmjs.com/package/sanitize-html for other options.
 */
export const Sanitizer = (dirty: string) => {
	const clean = sanitizeHtml(dirty, {
		allowedTags: ['a', 'p'],
		allowedAttributes: {
			a: ['href']
		}
	});
	return clean;
};
