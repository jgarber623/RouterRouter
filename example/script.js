import RouterRouter from "../src/routerrouter.js";

new RouterRouter({
  routes: {
    "(/:prefix)/example(/)": () => console.log("Hello, home page."),

    "(/:prefix)/example/:name.html": "pageOneAction",
  },

  pageOneAction: (prefix, name) => {
    console.log(`RouterRouter captured a named parameter value: ${name}`);
  }
});
