const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔐 Code d'accès
const ACCESS_CODE = "simple225";

// API gratuite football-data
const API_KEY = "TA_CLE_API_ICI"; // Remplace par ta clé
const BASE_URL = "https://api.football-data.org/v4";

// Vérification code
app.post("/login", (req, res) => {
  const { code } = req.body;
  if (code === ACCESS_CODE) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// 📅 Matchs du jour
app.get("/matches/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.get(
      `${BASE_URL}/matches?dateFrom=${today}&dateTo=${today}`,
      { headers: { "X-Auth-Token": API_KEY } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération matchs" });
  }
});

// 📊 Analyse corners simple
app.post("/analyze", (req, res) => {
  const { homeCorners, awayCorners } = req.body;

  const avg = (homeCorners + awayCorners) / 2;
  const over95 = avg > 9.5 ? "OVER 9.5 probable" : "UNDER 9.5 probable";

  const stability = avg > 8 ? "Stable" : "Instable";

  res.json({
    prediction: over95,
    average: avg,
    stability: stability
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
