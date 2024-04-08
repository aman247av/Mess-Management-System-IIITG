const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Special'],
        required: [true, 'Please specify the day of the menu.'],
        unique: true
    },
    breakfast: {
        time: String,
        hotBeverage: String,
        main: String,
        addons: String
    },
    lunch: {
        time: String,
        roti: String,
        rice: String,
        dal: String,
        veg1: String,
        veg2: String,
        addons: String,
        more: String
    },
    dinner: {
        time: String,
        roti: String,
        rice: String,
        dal: String,
        nonVegOrVeg: String,
        veg: String,
        addons: String
    },
    special: {
        time: String,
        main: String,
        occassion: String
    }
});

const MessMenu = mongoose.model('Menu', menuSchema);

module.exports = MessMenu;
