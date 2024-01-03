export const load = ({ cookies }) => {
	const ses = cookies.get('session')
	console.log('cookies', ses);
};
