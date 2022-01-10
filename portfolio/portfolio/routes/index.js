var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("template", {
      locals: {
          title: "Blacknall Portfolio"
      },
      partials: {
          partial: "partial-index"
      }
  });
});
module.exports = router;
