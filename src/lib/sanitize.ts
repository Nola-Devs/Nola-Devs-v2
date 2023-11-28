import sanitizeHtml from 'sanitize-html';

export const Sanitizer = (dirty: string) => {
	const clean = sanitizeHtml(dirty, {
		allowedTags: ['a', 'p'],
		allowedAttributes: {
			a: ['href']
		}
	});
	return clean;
};
