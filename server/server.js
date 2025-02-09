const express = require("express");
const routes = require("./router");
const curdUser = require("./crudUser");
const crudGroup = require("./crudGroup");
const crudFormation = require("./crudFromations");
const alert = require("./alert");
const historyHummer = require("./historyHummer");
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use( 
    cors({
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

// Gestion routes
app.use("/", routes);

// Gestion utilisateur
app.use("/", curdUser);

// Gestion group
app.use("/", crudGroup);

// Gestion Formation
app.use("/", crudFormation)

// Gestion alert
app.use("/", alert);

// Gestion historique hummer
app.use("/", historyHummer);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
