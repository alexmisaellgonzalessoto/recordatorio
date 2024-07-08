const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
    documentNumber: { type: String, required: true },
    company: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false }
});

const Debt = mongoose.model('Debt', DebtSchema);
module.exports = Debt;
