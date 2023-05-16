const Bank = require("../models/Bank");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addBank: async (req, res) => {
    // console.log(req.body);
    const { bankName, accountHolder, accountNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image Not Found" });
    }
    const bank = new Bank({
      bankName,
      accountHolder,
      accountNumber,
      imageUrl: `images/${req.file.filename}`,
    });

    try {
      await bank.save();
      res.status(201).json(bank);
    } catch (err) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(500).json({ message: err.message });
    }
  },

  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();

      bank.length === 0
        ? res.status(404).send({ message: "Tidak Ada Data Bank" })
        : res.status(200).json(bank);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateBank: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["bankName", "accountHolder", "accountNumber"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: "Invalid Key Parameter" });
    }

    try {
      const bank = await Bank.findById(req.params.id);
      if (req.file == undefined) {
        updates.forEach((update) => {
          bank[update] = req.body[update];
        });
        await bank.save();
        res.status(200).json(bank);
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        updates.forEach((update) => {
          Bank[update] = req.body[update];
        });
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        res.status(200).json(bank);
      }
    } catch (err) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      res.status(500).json({ message: err.message });
    }
  },

  deleteBank: async (req, res) => {
    try {
      const bank = await Bank.findByIdAndDelete(req.params.id);
      if (!bank) {
        return res.status(404).send({ message: "Bank Not Found" });
      } else {
        await bank
          .remove()
          .then(() => fs.unlink(path.join(`public/${bank.imageUrl}`)));
        res.status(200).json({ message: "Bank Deleted" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
