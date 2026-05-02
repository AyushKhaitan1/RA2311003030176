const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhazk0MzBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDUzOCwiaWF0IjoxNzc3NzAzNjM4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODA5Yjk4NDEtMDQ0Yy00MTIyLWFkNzUtZGZhMDFiZDI2ZDMzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXl1c2gga2hhaXRhbiIsInN1YiI6IjE0ZGMxZWUzLTA5MzItNDdlMC1iMWVhLTM2NWQ1OTA3ZjM3NyJ9LCJlbWFpbCI6ImFrOTQzMEBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImF5dXNoIGtoYWl0YW4iLCJyb2xsTm8iOiJyYTIzMTEwMDMwMzAxNzYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIxNGRjMWVlMy0wOTMyLTQ3ZTAtYjFlYS0zNjVkNTkwN2YzNzciLCJjbGllbnRTZWNyZXQiOiJjUmZNTkt1Qnp0RlNzQmZQIn0.gUIuY54Zq__gh4Ik4MxNxx71O8Xtm58_e22cjaEm1BA";

async function Log(stack, level, pkg, message) {
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify({
                stack: stack,       
                level: level,       
                package: pkg,       
                message: message
            })
        });

        if (!response.ok) {
            console.error("Logger Failed:", await response.text());
        } else {
            console.log(`[Logged] ${stack} -> ${pkg}: ${message}`);
        }
    } catch (error) {
        console.error("Error connecting to logger:", error.message);
    }
}

export default Log;