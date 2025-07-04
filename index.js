require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/task");

const app = express();


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
console.log("✅ MONGO_URI from .env:", process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
    insertSampleTask(); // <- Call it here
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
  });

// 
async function insertSampleTask() {
  const count = await Task.countDocuments();
  if (count === 0) {
    await Task.create({ name: "MERN Stack" });
    console.log("📥 Inserted sample task.");
  }
}


app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("index", { tasks, error: null });
  } catch (error) {
    console.error("❌ Error loading tasks:", error.message);
    res.status(500).send("Error loading tasks.");
  }
});


app.post("/add", async (req, res) => {
  const taskName = req.body.task;
  if (!taskName.trim()) {
    const tasks = await Task.find();
    return res.render("index", { tasks, error: "empty" });
  }
   await Task.create({ name: taskName.trim() });
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.taskId;
  await Task.findByIdAndDelete(id);
  res.redirect("/");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
