const bcrypt = require("bcrypt");
const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./db");
const { error } = require("console");

const crudUser = express.Router();
crudUser.use(cookieParser());

// Créer un utilisateur
crudUser.post("/register", async (req, res) => {
    const { name, email, password, status } = req.body;

    if (!name || !email || !password || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const validStatuses = ['student', 'supervisor', 'admin'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status. Choose from 'student', 'supervisor', or 'admin'." });
    }

    try {
        const existingUser = await pool.query(`SELECT * FROM "User" WHERE email = $1`, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `INSERT INTO "User" (name, email, password, status, hummer, call) VALUES ($1, $2, $3, $4, 100, false)`,
            [name, email, hashedPassword, status]
        );

        console.log(`User ${name} registered successfully.`);
        res.status(201).json({ message: `User ${name} registered successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register user." });
    }
});

// Consulter tous les  utilisateurs
crudUser.get("/users", async (req,res) => {
    try{
        const users = await pool.query(
            `SELECT * FROM "User" ORDER by name`
        );

        // si absence d'utilisateur
        if(users.rows.length=== 0){
            return res.status(404).json({message:"No users"});
        }
        // Affichage d'utilisateur
        console.log(users.rows);
        res.status(200).json(users.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read user"});
    }
});

// Obtenier le nombre total de l'utilisateur
crudUser.get("/nbUser", async(req,res) => {
    try{
        const nbUser = await pool.query(
            `SELECT count(*) FROM "User"`
        );
        // Si il n'y a pas d'utilisateur
        if(nbUser.rows.length === 0){
            return res.status(404).json("There aren't Users");
        }

        // Récupérer et convertir en nombre
        const countUser = parseInt(nbUser.rows[0].count, 10);

        // Afficher le nombre d'utilisateur
        console.log(countUser);
        res.status(200).json(countUser);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read nbUser"});
    }
});

// Consultation un Profil user
crudUser.get("/user/:id", async (req,res) => {
    const {id} = req.params;

    try{

        const user = await pool.query(
            `SELECT * FROM "User" WHERE id_user=$1 `,
            [id]
        );

        if(user.rows.length === 0){
            return res.status(404).json({error:`User ${id} doesn't exists`});
        }
        console.log(user.rows);
        res.status(200).json(user.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read user profile"});
    }
});

// Mise à jour du profil
crudUser.put("/profile/:id", async (req, res) => {
    const { name, email, password, status, oldPassword } = req.body; // oldPassword ajouté
    const { id } = req.params;
    console.log('Données reçues pour la mise à jour:', req.body);

    try {
        const userExist = await pool.query(`SELECT * FROM "User" WHERE id_user=$1`, [id]);

        if (userExist.rows.length === 0) {
            return res.status(404).json({ message: "User doesn't exist." });
        }

        // Vérifier l'ancien mot de passe si fourni
        if (oldPassword) {
            const match = await bcrypt.compare(oldPassword, userExist.rows[0].password);
            if (!match) {
                return res.status(400).json({ message: "Old password is incorrect." });
            }
        }

        // Vérifier si le nom ou l'email existent déjà pour un autre utilisateur
        if (name || email) {
            const checkDuplicate = await pool.query(
                `SELECT * FROM "User" WHERE (name = $1 OR email = $2) AND id_user <> $3`,
                [name || userExist.rows[0].name, email || userExist.rows[0].email, id]
            );

            if (checkDuplicate.rows.length > 0) {
                return res.status(409).json({ message: "Name or Email already taken by another user." });
            }
        }

        const updates = [];
        const values = [];
        let index = 1;

        if (name) {
            updates.push(`name = $${index++}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${index++}`);
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password = $${index++}`);
            values.push(hashedPassword);
        }
        if (status) {
            updates.push(`status = $${index++}`);
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No fields to update." });
        }

        values.push(id);
        const query = `UPDATE "User" SET ${updates.join(", ")} WHERE id_user = $${index} RETURNING *`;
        const result = await pool.query(query, values);

        console.log("Profile updated successfully.", result.rows[0]);
        res.status(200).json({ message: "Profile updated successfully.", user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Profile update failed." });
    }
});

// Consultation de l'hummeur de l'utilisateur
crudUser.get("/hummer/:id", async (req, res) => {
    const {id} = req.params;
    try{
        // Vérifier si l'utilisateur existe
        const getHummer = await pool.query(
            `SELECT "hummer" FROM "User" WHERE id_user=$1`,
            [id]
        );
        if(getHummer.rows.length === 0){
            return res.status(404).json({message:`User ${id} doesn't exist!`});
        }
        // afficher la valeur de l'hummeur
        console.log(getHummer.rows[0].hummer);
        res.json({ hummer: getHummer.rows[0].hummer });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read values of hummer"});
    }
});

// Mise à jour de l'humeur
crudUser.put("/hummer/:id", async (req, res) => {
    const { hummer } = req.body;
    const { id } = req.params;

    try {
        const userExist = await pool.query(`SELECT "hummer" FROM "User" WHERE id_user=$1`, [id]);

        if (userExist.rows.length === 0) {
            return res.status(404).json({ message: "User doesn't exist." });
        }

        if (hummer == null) {
            return res.status(400).json({ message: "Hummer value is required." });
        }

        const query = `UPDATE "User" SET hummer = $1 WHERE id_user = $2 RETURNING *`;
        const result = await pool.query(query, [hummer, id]);

        await pool.query(`INSERT INTO "Historique" (id_user, "Hummer", "Date_Hummer") VALUES ($1, $2, NOW())`, [id, hummer]);

        console.log("Hummer updated successfully.",result.rows[0]);
        res.status(200).json({ message: "Hummer updated successfully.", user: result.rows[0] });
    } catch (err) {
        console.error("Error updating hummer",err);
        res.status(500).json({ error: "Failed to update hummer." });
    }
});

// Mise à jour de l'état d'appel
crudUser.put("/call/:id", async (req, res) => {
    const { call } = req.body;
    const { id } = req.params;

    try {
        const userExist = await pool.query(
            `SELECT "call" FROM "User" WHERE id_user=$1`, 
            [id]
        );

        if (userExist.rows.length === 0) {
            return res.status(404).json({ message: "User doesn't exist." });
        }

        if (call == null) {
            return res.status(400).json({ message: "Call status is required." });
        }

        const query = `UPDATE "User" SET call = $1 WHERE id_user = $2 RETURNING *`;
        const result = await pool.query(query, [call, id]);

        await pool.query(`INSERT INTO "Alerte" (id_user, "Date_alerte") VALUES ($1, NOW())`, [id]);

        console.log("Call status updated successfully.",result.rows[0]);
        res.status(200).json({ message: "Call status updated successfully.", user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update call status." });
    }
});

// Obtenir l'état de l'appel de l'utilisateur
crudUser.get("/call/:id", async (req,res) => {
    const {id} = req.params;
    try{
        // Vérifier si l'utilisateur existe
        const getCall = await pool.query(
            'SELECT "call" FROM "User" WHERE id_user=$1',
            [id]
        );
        if(getCall.rows.length === 0) {
            return res.status(404).json({message:`User ${id} doesn't exist!`});
        }
        // Afficher l'état de call de l'utilisateur
        console.log(getCall.rows[0].call);
        res.status(200).json({ call: getCall.rows[0].call});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Can't read state of call!"});
    }
});

// Supprimer un utilisateur
crudUser.delete("/deleteUser/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const userExist = await pool.query(
            `SELECT * FROM "User" WHERE id_user=$1`,
            [id]
        );

        if (userExist.rows.length === 0) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Suppression des clé étrangère des autres tables si elle existe
        const userHistory = await pool.query(
            `SELECT * FROM "Historique" WHERE id_user=$1`,
            [id]
        );
        if(userHistory.rows.length > 0){
            await pool.query(`DELETE FROM "Historique" WHERE id_user=$1`,[id]);
        }
        const userAlerte = await pool.query(
            `SELECT * FROM "Alerte" WHERE id_user=$1`,
            [id]
        );
        if(userAlerte.rows.length > 0) {
            await pool.query(`DELETE FROM "Alerte" WHERE id_user=$1`,[id]);
        }
        const userFormations = await pool.query(
            `SELECT * FROM "Formations" WHERE id_user=$1`,
            [id]
        );
        if(userFormations.rows.length > 0) {
            await pool.query(`DELETE FROM "Formations" WHERE id_user=$1`,[id]);
        }
        
        // supperesion de l'utilisateur
        await pool.query(`DELETE FROM "User" WHERE id_user=$1`, [id]);

        console.log(`User ${id} deleted`);
        res.status(200).json({ message: `User ${id} deleted` });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Delete user failed" });
    }
});

module.exports = crudUser;
