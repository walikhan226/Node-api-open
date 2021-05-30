const object = require("joi/lib/types/object");
const router = express.Router();
const { Posts, validate } = require("../models/posts");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.status(200).send("Working");
});
module.exports = router;
