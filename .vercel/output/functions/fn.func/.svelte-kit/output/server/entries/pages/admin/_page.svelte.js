import { c as create_ssr_component, a as subscribe, e as escape, d as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
const login_svelte_svelte_type_style_lang = "";
const css = {
  code: ".signInBox.svelte-qn7icq.svelte-qn7icq{display:flex;position:fixed;flex-direction:column;top:0;right:20px}.signInBox.svelte-qn7icq small.svelte-qn7icq{position:absolute}.signInBox__tag.svelte-qn7icq.svelte-qn7icq{display:flex;align-items:center;gap:10px}.signInBox__tag.svelte-qn7icq img.svelte-qn7icq{width:65px;height:65px;border-radius:50%;border:3px solid black}",
  map: null
};
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  $$unsubscribe_page();
  return `<p>${$page.data.session ? `${$page.data.session.user?.image ? `<span style="${"background-image: url('" + escape($page.data.session.user.image, true) + "')"}" class="avatar"></span>` : ``} <span class="signInBox svelte-qn7icq"><small class="svelte-qn7icq" data-svelte-h="svelte-qavuiv">Signed in as</small><br> <span class="signInBox__tag svelte-qn7icq"><button class="button" data-svelte-h="svelte-1ewrtmg">Sign out</button> <strong class="signInBox__name">${escape($page.data.session.user?.name ?? "User")}</strong> <img${add_attribute("src", $page.data.session.user?.image, 0)} alt="user" class="svelte-qn7icq"></span></span>` : `<span class="signInBox svelte-qn7icq"><span data-svelte-h="svelte-eby23n">You are not signed in</span> <button data-svelte-h="svelte-gcayt3">Sign In with Google</button></span>`} </p>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-1d5mfrr">Admin</h1> <form action="?/login" method="post"><label for="email" data-svelte-h="svelte-1flf0h4">Email:</label> <input type="email" name="email"> <label for="password" data-svelte-h="svelte-bhu94">Password:</label> <input type="password" name="password"> <select name="permissions"><option value="organizer" data-svelte-h="svelte-vru1uk">Organizer</option><option value="dev" data-svelte-h="svelte-p3nuyf">Dev Team</option><option value="admin" data-svelte-h="svelte-17op260">Admin</option></select> <button type="submit" data-svelte-h="svelte-1yamoz0">Login</button></form> ${validate_component(Login, "Login").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
