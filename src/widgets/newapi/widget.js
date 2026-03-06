import newapiProxyHandler from "./proxy";

const widget = {
  proxyHandler: newapiProxyHandler,

  mappings: {
    stat: {
      endpoint: "stat",
    },
  },
};

export default widget;
