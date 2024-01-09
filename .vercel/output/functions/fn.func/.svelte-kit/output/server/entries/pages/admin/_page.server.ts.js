const load = async (event) => {
  return {
    session: await event.locals.getSession()
  };
};
export {
  load
};
