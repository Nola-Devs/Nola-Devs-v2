import type { PageServerLoad } from "./$types";
import {
	PUBLIC_DINGDONG_ENDPOINT,
	PUBLIC_DINGDONG_SECRET,
} from "$env/static/public";

export const load: PageServerLoad = async () => {
	return {
		DINGDONG_ENDPOINT: PUBLIC_DINGDONG_ENDPOINT,
		DINGDONG_SECRET: PUBLIC_DINGDONG_SECRET,
	};
};
