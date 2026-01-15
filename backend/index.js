require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/AuthRoutes");
const CampaignRoutes = require("./routes/CampaignRoutes");
const DonationRoutes = require("./routes/DonationRoutes");
const userRoutes = require("./routes/UserRoutes");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",

    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/donations", DonationRoutes);
app.use("/campaigns", CampaignRoutes);
app.use("/me", userRoutes);

app.get("/", (req, res) => res.json({ status: "OK" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});


const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});