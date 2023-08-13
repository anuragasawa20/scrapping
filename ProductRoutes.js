const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const authMiddleware = require('./middleware/authMiddleware');
const Product = require('./productModel');

router.post('/scrape', authMiddleware, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required.' });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const title = $('title').text();
        const price = parseFloat($('.product-price').text().replace('$', ''));
        const product = new Product({
            user: req.user._id,
            title,
            price,
        });

        await product.save();

        return res.status(201).json({ message: 'Data scraped and saved successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error scraping data.' });
    }
});



router.get('/check', authMiddleware, async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL parameter is required.' });
    }

    // Check if the URL exists in the database and belongs to the logged-in user
    try {
        const product = await Product.findOne({ user: req.user._id, url });

        if (!product) {
            return res.status(404).json({ message: 'URL not found or does not belong to the logged-in user.' });
        }

        // Return scraped data
        const data = {
            title: product.title,
            price: product.price,
            // Set other fields
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: 'Error checking URL.' });
    }
});



module.exports = router;
