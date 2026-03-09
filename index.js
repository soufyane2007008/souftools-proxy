// كود تحديث index.js لاختيار مفتاح عشوائي
app.post('/proxy', async (req, res) => {
    try {
        // 1. سحب مفاتيح الـ API من Firestore
        const keysSnapshot = await db.collection('api_keys').where('status', '==', 'active').get();
        const keys = keysSnapshot.docs.map(doc => doc.data().key);
        
        // 2. اختيار مفتاح عشوائي من آلاف المفاتيح
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        
        // 3. إرسال الطلب بهوية متخفية
        const userAgent = new UserAgent();
        const { apiUrl, method, data } = req.body;

        const response = await axios({
            url: apiUrl,
            method: method,
            data: data,
            headers: {
                'Authorization': `Bearer ${randomKey}`,
                'User-Agent': userAgent.toString(),
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send("خطأ في معالجة الطلب أو المفاتيح");
    }
});
