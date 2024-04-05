const mongoose = require("mongoose");
const Subscriber = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
    }
});



module.exports = mongoose.models.Subscriber || mongoose.model("Subscriber", Subscriber);
