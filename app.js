const express = require("express");
const { pool, connectDB } = require("./db/connect");

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

  const mentorRoutes = require("./routers/mentorRoutes");
  const menteeRoutes = require("./routers/menteeRoutes");
  const meetingRoutes = require("./routers/meetingRoutes");
  const adminRoutes = require("./routers/adminRoutes");


// test-GET route
app.get('/', (req, res) => {
  res.send("Haps Aviation Node.js Server is Running!");
});

// Routes
app.use("/api/v1/mentor", mentorRoutes);
app.use("/api/v1/mentee", menteeRoutes);
app.use("/api/v1/meeting", meetingRoutes);
app.use("/api/v1/admin", adminRoutes);



// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
