import express from 'express';
import cors from 'cors';
import Log from '../logging middleware/logger.js';

const app = express();
app.use(cors());
app.use(express.json());

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhazk0MzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDUzOCwiaWF0IjoxNzc3NzAzNjM4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODA5Yjk4NDEtMDQ0Yy00MTIyLWFkNzUtZGZhMDFiZDI2ZDMzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXl1c2gga2hhaXRhbiIsInN1YiI6IjE0ZGMxZWUzLTA5MzItNDdlMC1iMWVhLTM2NWQ1OTA3ZjM3NyJ9LCJlbWFpbCI6ImFrOTQzMEBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImF5dXNoIGtoYWl0YW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwMzAxNzYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIxNGRjMWVlMy0wOTMyLTQ3ZTAtYjFlYS0zNjVkNTkwN2YzNzciLCJjbGllbnRTZWNyZXQiOiJjUmZNTkt1Qnp0RlNzQmZQIn0.gUIuY54Zq__gh4Ik4MxNxx71O8Xtm58_e22cjaEm1BA";
const API_URL = "http://20.207.122.201/evaluation-service/notifications";

app.get('/api/notifications', async (req, res) => {
    try {
        await Log("backend", "info", "route", "Fetching all notifications");
        const { limit, page, notification_type } = req.query;
        let url = API_URL + "?";
        if (limit) url += `limit=${limit}&`;
        if (page) url += `page=${page}&`;
        if (notification_type) url += `notification_type=${notification_type}`;

        const response = await fetch(url, { headers: { "Authorization": `Bearer ${AUTH_TOKEN}` } });
        if (!response.ok) return res.status(response.status).json({ error: "External API error" });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        await Log("backend", "error", "handler", `Exception: ${error.message}`);
        res.status(500).json({ error: "Server Error" });
    }
});

app.get('/api/notifications/priority', async (req, res) => {
    try {
        await Log("backend", "info", "route", "Processing priority notifications");
        const { n = 10, notification_type } = req.query;

        let url = API_URL;
        if (notification_type) url += `?notification_type=${notification_type}`;

        const response = await fetch(url, { headers: { "Authorization": `Bearer ${AUTH_TOKEN}` } });
        if (!response.ok) return res.status(response.status).json({ error: "External API error" });

        const data = await response.json();
        let notifications = data.notifications || [];

        const getWeight = (t) => {
            if (t.toLowerCase() === 'placement') return 3;
            if (t.toLowerCase() === 'result') return 2;
            if (t.toLowerCase() === 'event') return 1;
            return 0;
        };

        notifications.sort((a, b) => {
            const weightDiff = getWeight(b.Type) - getWeight(a.Type);
            if (weightDiff !== 0) return weightDiff;
            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        const topN = notifications.slice(0, parseInt(n, 10));
        res.json({ notifications: topN });

    } catch (error) {
        await Log("backend", "error", "handler", `Exception: ${error.message}`);
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = 3001;
app.listen(PORT, async () => {
    await Log("backend", "info", "config", `Backend Server running on port ${PORT}`);
    console.log(`Backend Server running on port ${PORT}`);
});