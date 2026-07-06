const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/db");
const tasksRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Ошибка подключения к PostgreSQL:", err.message);
    } else {
        console.log("PostgreSQL подключен");
        console.log(result.rows[0]);
    }
});
app.use("/tasks", tasksRoutes);

app.get("/", (req, res) => {
    res.send("AI Task Manager API работает!");
});

app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});