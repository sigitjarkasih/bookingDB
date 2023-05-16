const User = require("../models/User");

module.exports = {
  addUser: async (req, res) => {
    try {
      const { userName, email, role, password, passwordComfirm } = req.body;

      if (password !== passwordComfirm) {
        throw Error(
          "Kata Sandi Anda Tidak Sama Dengan Konfirmasi Kata Sandi!!"
        );
      }

      const cekUserName = await User.find({
        userName: userName,
      }).count();

      const cekEmail = await User.find({
        email: email,
      }).count();

      if (cekUserName + cekEmail > 0) {
        throw Error("Email / Nama Pengguna Sudah Terdaftar!!!");
      }

      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "Berhasil Daftar, Silahkan Login" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  viewUser: async (req, res) => {
    try {
      const user = await User.find();

      user.length === 0
        ? res.status(404).send({ message: "Tidak Ada Data User" })
        : res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "userName",
      "email",
      "role",
      "password",
      "passwordComfirm",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: "Invalid Key Parameter" });
    }

    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      user
        ? res.status(200).json({ message: "User Deleted" })
        : res.status(404).send({ message: "User Not Found" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    //console.log(req.body);
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );

      const token = await user.generateAuthToken();
      const username = user.userName;

      res.status(200).json({ username, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  logOut: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.user.token
      );

      await req.user.save();
      res.status(200).json({ message: "Berhasil Logout" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  logOutAll: async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).json({ message: "Berhasil Logout " });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  viewMe: async (req, res) => {
    res.send(req.user);
  },
};
