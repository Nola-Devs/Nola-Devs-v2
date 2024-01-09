import { c as create_ssr_component, b as each, e as escape } from "../../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<nav><a href="/admin" data-svelte-h="svelte-81edur">admin</a> ${each(data.groups, (group) => {
    return `<a href="${"/admin/" + escape(group?.replace(/ /g, "-"), true)}"><p>${escape(group)}</p> </a>`;
  })} <a href="/admin/page-admin" data-svelte-h="svelte-42qqnm"><p>Site Admin</p></a></nav> ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
