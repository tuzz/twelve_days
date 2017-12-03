(function () {
  var Network = require("./network");
  var Snowflake = require("./snowflake");
  var View = require("./view");

  var network = new Network();
  var snowflake = new Snowflake({ x: 300, y: 400 }, 500, 2);
  var view = new View(network, snowflake);

  view.render();
})();
