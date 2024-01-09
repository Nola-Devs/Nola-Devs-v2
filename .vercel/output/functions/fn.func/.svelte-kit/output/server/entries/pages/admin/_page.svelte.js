import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-1d5mfrr">Admin</h1> <form action="?/login" method="post"><label for="email" data-svelte-h="svelte-1flf0h4">Email:</label> <input type="email" name="email"> <label for="password" data-svelte-h="svelte-bhu94">Password:</label> <input type="password" name="password"> <select name="permissions"><option value="organizer" data-svelte-h="svelte-vru1uk">Organizer</option><option value="dev" data-svelte-h="svelte-p3nuyf">Dev Team</option><option value="admin" data-svelte-h="svelte-17op260">Admin</option></select> <button type="submit" data-svelte-h="svelte-1yamoz0">Login</button></form>`;
});
export {
  Page as default
};
