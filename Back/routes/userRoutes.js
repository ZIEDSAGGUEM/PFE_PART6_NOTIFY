const router = require("express").Router();
const User = require("../models/User");

// signup

router.post("/signup", async (req, res) => {
  const { name, email, password, picture, phone, address } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      picture,
      phone,
      address,
    });
    res.json(user);
  } catch (e) {
    if (e.code === 11000) return res.status(400).send("Email déja existe");
    res.status(400).send(e.message);
  }
});


// login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    res.json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//update
router.post("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    // Find the user by id and update
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get users;

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).populate("orders");
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// get user orders

router.get("/:id/orders", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("orders");
    res.json(user.orders);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// update user notifcations
router.post("/:id/updateNotifications", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = "read";
    });
    user.markModified("notifications");
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
