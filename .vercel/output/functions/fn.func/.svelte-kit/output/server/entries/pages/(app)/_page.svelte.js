import { c as create_ssr_component, v as validate_component, b as each } from "../../../chunks/ssr.js";
import { C as Carousel, E as Event_card, T as Toaster } from "../../../chunks/Toaster.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".groupCard.svelte-q9087c.svelte-q9087c{position:absolute;height:100%;width:50%;padding:5px;text-align:center;background-color:rgba(240, 248, 255, 0.487);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}.groupCard.svelte-q9087c p.svelte-q9087c{margin:auto}.card.svelte-q9087c.svelte-q9087c{position:relative;overflow:auto;scroll-snap-type:y mandatory;display:grid;clip-path:fill-box;border-radius:10px}.noladevs.svelte-q9087c.svelte-q9087c{height:100vh;padding:5px;display:grid;grid-template-rows:[first] 40% [line2] auto;gap:3px}.event-list.svelte-q9087c.svelte-q9087c{scroll-behavior:smooth;overflow-y:auto;border-radius:10px;clip-path:fill-box;display:flex;flex-direction:column;height:100%;gap:3px;scroll-snap-type:y mandatory}.carousel.svelte-q9087c.svelte-q9087c{overflow:hidden}@media only screen and (max-width: 800px){.event-list.svelte-q9087c.svelte-q9087c{height:fit-content}.groupCard.svelte-q9087c.svelte-q9087c{width:100%}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let events = data.events;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="noladevs svelte-q9087c"><div class="card svelte-q9087c"><div class="groupCard svelte-q9087c" data-svelte-h="svelte-hthskt"><p class="svelte-q9087c">Welcome to Nola Devs, a thriving and welcoming software developers group in the heart of New
				Orleans! Join our community of passionate developers united by values of collaboration,
				learning, and growth. Whether you&#39;re a seasoned pro or a coding beginner, find like-minded
				individuals to connect with. Explore opportunities to enhance your skills, build valuable
				connections, and make an impact in the dynamic world of software development. Come discover
				the buzz in our growing tech ecosystem!</p></div> <div class="carousel svelte-q9087c">${validate_component(Carousel, "Carousel").$$render($$result, {}, {}, {})}</div></div> <div class="event-list svelte-q9087c">${!data ? ` <h1 data-svelte-h="svelte-jbcdxy">Loading</h1>` : ` ${each(events, (e) => {
    return `${validate_component(Event_card, "EventCard").$$render($$result, { event: e }, {}, {})}`;
  })}`}</div></div> ${validate_component(Toaster, "Toaster").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
