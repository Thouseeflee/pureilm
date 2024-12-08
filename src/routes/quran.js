const express = require('express');
const router = express.Router();
const axios = require('axios');

// Pagination defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

router.get('/list', async (req, res) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;

        // Make API call to GlobalQuran API
        const response = await axios.get('https://api.globalquran.com/quran', {
            params: {
                'API Key': process.env.GLOBAL_QURAN_API_KEY
            }
        });

        const quranList = response.data.quranList;
        const quranArray = Object.entries(quranList).map(([id, data]) => ({
            id,
            ...data
        }));

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = quranArray.length;

        // Prepare pagination result
        const result = {
            data: quranArray.slice(startIndex, endIndex),
            pagination: {
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit
            }
        };

        res.json(result);
    } catch (error) {
        console.error('Error fetching Quran list:', error);
        res.status(500).json({ error: 'Failed to fetch Quran list' });
    }
});

module.exports = router; 