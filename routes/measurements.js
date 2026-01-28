const express = require("express");
const router = express.Router();
const Measurement = require("../models/Measurement");

const allowedFields = ["field1", "field2", "field3"];

router.get("/", async (req, res) => {
  try {
    const { field, start_date, end_date } = req.query;

    if (!allowedFields.includes(field))
      return res.status(400).json({ error: "Invalid field" });

    const query = {};
    if (start_date && end_date) {
      query.timestamp = {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      };
    }

    const data = await Measurement.find(query).sort({ timestamp: 1 });

    res.json(
      data.map(d => ({
        timestamp: d.timestamp,
        value: d[field]
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/metrics", async (req, res) => {
  try {
    const { field } = req.query;
    if (!allowedFields.includes(field))
      return res.status(400).json({ error: "Invalid field" });

    const data = await Measurement.find();
    const values = data.map(d => d[field]).filter(v => v !== undefined);

    const avg = values.reduce((a,b)=>a+b,0)/values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const std = Math.sqrt(
      values.reduce((a,b)=>a+(b-avg)**2,0)/values.length
    );

    res.json({ avg, min, max, std });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;