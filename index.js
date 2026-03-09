const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const cors = require('cors');
const UserAgent = require('user-agents');

const app = express();
app.use(cors());
app.use(express.json());

// سيتم وضع إعدادات Firebase هنا لاحقاً
// admin.initializeApp({...});

app.post('/proxy', async (req, res) => {
    const userAgent = new UserAgent();
    const { apiUrl, method, data, apiKey } = req.body;

    try {
        const response = await axios({
            url: apiUrl,
            method: method,
            data: data,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': userAgent.toString(), // تغيير الهوية تلقائياً
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        // إذا حدث حظر (429)، سنقوم بتحديث حالة المفتاح في Firebase هنا
        res.status(error.response?.status || 500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
