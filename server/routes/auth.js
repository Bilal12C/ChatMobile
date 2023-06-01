const {
  login,
  register,
  getAllUsers,
  logOut,
} = require("../controllers/userController");

const multer = require('multer')

const upload = multer({dest:'public/uploads/'})
const router = require("express").Router();

router.post("/login", login);
router.post("/register",  upload.single('image'), register);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);

module.exports = router;
