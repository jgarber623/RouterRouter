import RouterRouter from "../src/routerrouter.js";

new RouterRouter({
  routes: {
    "/example/": () => console.log("Hello, home page."),

    "/example/:name.html": "pageOneAction",
  },

  pageOneAction: (name) => {
    console.log(`RouterRouter captured a named parameter value: ${name}`);
  }
});
