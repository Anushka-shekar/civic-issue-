require("dotenv").config();
const generateDescription = require("./utils/ai");

(async () => {
  const res = await generateDescription("big pothole filled with water on road");
  console.log("AI OUTPUT:", res);
})();