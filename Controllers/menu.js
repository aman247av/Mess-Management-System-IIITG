const express = require('express');
const MessMenu = require('../Models/menuModel');

exports.createMenu = async (req, res) => {
    
    try {
        await MessMenu.deleteMany();
        const newMenu = await MessMenu.create(req.body);
        res.status(201).json({ message: "Menu Updated Successfully!", data: newMenu });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong while updating Menu.", error: error.message });
    }
};



exports.showMenu = async (req, res) => {
    try {
        const menu = await MessMenu.find();
        res.status(200).json({ success: true, data: menu });
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateMenuByDay = async (req, res) => {
    try {
        console.log(req.params.day);
        const updatedMenu = await MessMenu.findOneAndUpdate({ day: req.params.day }, req.body, { new: true });
        if (!updatedMenu) {
            return res.status(404).json({ success: false, message: 'Menu not found' });
        }
        res.status(200).json({ success: true, data: updatedMenu });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}   

exports.findMenuByDay = async (req, res) => {
    try {
        const menu = await MessMenu.findOne({ day: req.params.day });

        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu not found' });
        }

        res.status(200).json({ success: true, data: menu });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

