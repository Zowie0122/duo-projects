const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const config = require("config");
const User = require("../../models/User");
// @route  POST api/users
// @desc    Register user
// @access  public access

//######TEST
router.get("/", (req, res) => {
  res.send("User route");
});

// router.post("/", (req, res) => {
//   console.log(req.body);
//   res.send("Post");
// });

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters",
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ mgs: "User already exists" }] });
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "404",
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // res.send("User registered");

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
      process.exit(1);
    }
  },
);

module.exports = router;

// test messages

// {
//   "name":"Zowie",
//   "password": "sssssss",
//   "email": "minjiayi@gmail.com"
//   }



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWViNzUzMWI5MThlMzcwOWU2NjRjNGE3In0sImlhdCI6MTU4OTA3MjY2OCwiZXhwIjoxNTg5NDMyNjY4fQ.fRHrWaYfZRPJkOX16m9GAhLYmwuaPz1x2mxzk-VylZ4
// {
//   "name":"Hi",
//   "password": "sssssss",
//   "email": "hi@gmail.com"
//   }