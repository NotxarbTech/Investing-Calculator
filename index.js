const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    const {initial, years, apy, additional} = req.body;
    let data = [];
    for (let current_year = 1; current_year <= years; current_year++) {
        let amount = initial * Math.pow(1 + (apy / 100), current_year) + (additional * current_year);
        data.push({current_year, amount: amount.toFixed(2)});
    }
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});