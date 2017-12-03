var Network = require("./network");
var Snowflake = require("./snowflake");

window.network = new Network();
window.snowflake = new Snowflake({ x: 100, y: 100 }, 50, 2);
