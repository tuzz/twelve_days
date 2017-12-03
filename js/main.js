(function () {
  var Network = require("./network");
  var View = require("./view");

  var network = new Network();
  var view = new View(network);

  view.render();
})();
