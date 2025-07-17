import type { PageServerLoad } from "./$types";
import {
	PUBLIC_DINGDONG_HOST,
	PUBLIC_DINGDONG_PHRASE,
} from "$env/static/public";

export const load: PageServerLoad = async () => {
	return {
		DINGDONG_HOST: PUBLIC_DINGDONG_HOST,
		DINGDONG_PHRASE: PUBLIC_DINGDONG_PHRASE,
	};
};
