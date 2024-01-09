import { connect } from "mongoose";
import { M as MONGO_URL, D as DB_NAME, G as GOOGLE_CLIENT_ID, b as GOOGLE_CLIENT_SECRET } from "./private.js";
import { D as DEV } from "./prod-ssr.js";
import { d as private_env, b as base } from "./internal.js";
import { Auth } from "@auth/core";
import Google from "@auth/core/providers/google";
const dev = DEV;
const start_db = async () => {
  return await connect(MONGO_URL + DB_NAME + DB_NAME).then(() => console.log("connected"));
};
async function getSession(req, config) {
  config.secret ??= private_env.AUTH_SECRET;
  config.trustHost ??= true;
  const prefix = config.prefix ?? `${base}/auth`;
  const url = new URL(prefix + "/session", req.url);
  const request = new Request(url, { headers: req.headers });
  const response = await Auth(request, config);
  const { status = 200 } = response;
  const data = await response.json();
  if (!data || !Object.keys(data).length)
    return null;
  if (status === 200)
    return data;
  throw new Error(data.message);
}
const actions = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error"
];
function AuthHandle(svelteKitAuthOptions) {
  return async function({ event, resolve }) {
    const authOptions = typeof svelteKitAuthOptions === "object" ? svelteKitAuthOptions : await svelteKitAuthOptions(event);
    const { prefix = `${base}/auth` } = authOptions;
    const { url, request } = event;
    event.locals.getSession ??= () => getSession(request, authOptions);
    const action = url.pathname.slice(prefix.length + 1).split("/")[0];
    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      return resolve(event);
    }
    return Auth(request, authOptions);
  };
}
function SvelteKitAuth(options) {
  if (typeof options === "object") {
    options.secret ??= private_env.AUTH_SECRET;
    options.trustHost ??= !!(private_env.AUTH_TRUST_HOST ?? private_env.VERCEL ?? dev);
    options.prefix ??= `${base}/auth`;
  }
  return AuthHandle(options);
}
start_db().then(() => console.log("DB Started")).catch((e) => console.log(e));
const handle = SvelteKitAuth({
  providers: [Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })]
});
export {
  handle
};
