const Item = require("../models/Item");
const Booking = require("../models/Booking");

module.exports = {
  viewDashboard: async (req, res) => {
    try {
      let sumBooked, sumProcess, sumReject, sumAccept, sumItem;
      const totalBooked = await Booking.find();
      const process = await Booking.find({ "payments.status": "Process" });
      const reject = await Booking.find({ "payments.status": "Reject" });
      const accept = await Booking.find({ "payments.status": "Accept" });
      const item = await Item.find();

      totalBooked.lenght != 0
      ? (sumBooked = totalBooked.lenght)
      : (sumBooked = 0);
      process.lenght !=0 ? (sumProcess = process.lenght) : (sumProcess = 0);
      reject.lenght != 0 ? (sumReject = reject.lenght) : (sumReject = 0);
      accept.lenght != 0 ? (sumAccept = accept.lenght) : (sumAccept = 0);
      item.lenght != 0 ? (sumItem = item.lenght) : (sumItem = 0);

      res.status(200).json({
        booked: String(sumBooked),
        process: String(sumProcess),
        reject: String(sumReject),
        accept: String(sumAccept),
        item: String(sumItem),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
