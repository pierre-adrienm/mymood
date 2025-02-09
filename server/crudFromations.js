const bcrypt = require("bcrypt");
const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./db");
const { error } = require("console");

const crudFormation = express.Router();

// Inserer un utilisateur dans le groupe
crudFormation.post("/group/:id_group/registerFormation", async (req, res) =>{
    const {name} = req.body;
    const {id_group} = req.params;
    
    try{
        // Si l'utilisateur existe
        const userResult = await pool.query(
            `SELECT id_user FROM "User" WHERE name=$1`,
            [name]
        );
        if(userResult.rows.length === 0){
            return res.status(404).json({message:`User ${name} doesn't exist`});
        }

        const id_user = userResult.rows[0].id_user;

        // Vérifier si l'utilisateur est déjà inscrit dans le groupe
        const existingFormation = await pool.query(
            `SELECT * FROM "Formations" WHERE id_user = $1 AND id_group = $2`,
            [id_user, id_group]
        );

        if (existingFormation.rows.length > 0) {
            return res.status(400).json({ message: `User ${name} is already in group ${id_group}` });
        }

        // Insérer dans la table Formations
        const formationResult = await pool.query(
            'INSERT INTO "Formations" (id_user, id_group) VALUES ($1, $2)',
            [id_user, id_group]
        );
        console.log(formationResult.rows[0]);
        res.status(201).json({ message: "User added to formation", formation: formationResult.rows[0] });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Add user formation failed"});
    }
});

// Consultation liste des utilisateur dans une formation
crudFormation.get('/group/:id_group/users',async (req,res) =>{
    const {id_group} = req.params;

    try{
        // Vérifie si le groupe existe
        const groupCheck = await pool.query(
            `SELECT * FROM "Group" WHERE id_group = $1`,
            [id_group]
        );
        if(groupCheck.rows.length === 0){
            return res.status(404).json({message:"This group doesn't exists."});
        }

        // Récupérer les utilisateurs du groupe
        const usersResult = await pool.query(
            `SELECT u.id_user, u.name, u.email, u.status, u.hummer, u.call
             FROM "User" u
             JOIN "Formations" f ON u.id_user = f.id_user
             WHERE f.id_group = $1 ORDER BY u.name`,
            [id_group]
        );

        // Affiche la liste
        console.log(id_group,usersResult.rows);
        res.status(200).json({ group: id_group, users: usersResult.rows });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read user list in the group"});
    }
});

// Consulter le nombre d'utilisateur dans un group
crudFormation.get(`/group/:id_group/nbUser`, async (req, res) => {
    const {id_group} = req.params;

    try{
        const nbUserGroup = await pool.query(
            `SELECT count(*) FROM "Formations" WHERE id_group=$1`,
            [id_group]
        );
        // Vérifier si le group existe
        if(nbUserGroup.rows.length === 0){
            return res.status(404).json({message:`The group ${id_group} doesn't exists`});
        }

        // Récupérer et couvertir le nombre d'utilisateur dans un groupe
        const countNbUserGroup = parseInt(nbUserGroup.rows[0].count, 10);

        // Afficher le nombre d'utilisateur dans un group
        console.log(countNbUserGroup);
        res.status(200).json(countNbUserGroup);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read nombre user in group"});
    }
});

// Récupérer la liste des formations d'un utilisateur avec le nom du groupe
crudFormation.get('/user/:id_user/formations', async (req,res) => {
    const {id_user} = req.params;

    try{
        // Vérification si l'utilisateur existe
        const userCheck = await pool.query(
            `SELECT * FROM "User" WHERE id_user=$1`,
            [id_user]
        );
        if(userCheck.rows.length === 0){
            return res.status(404).json({message:`User ${id_user} doesn't exist`});
        }

        // Récupérer les formations de l'utilisateur avec le nom du groupe
        const formationsResult = await pool.query(
            `SELECT f.id_formation, g.id_group, g.name AS group_name
                FROM "Formations" f
                JOIN "Group" g ON f.id_group = g.id_group
                WHERE f.id_user = $1 ORDER BY g.name`,
            [id_user]
        );

        // Afficher la liste des formations
        console.log(id_user,formationsResult.rows);
        res.status(200).json({ user: id_user, formations: formationsResult.rows });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read list formations"});
    }
});

// Récuperér le nombre de formation qu'a un utilisateur
crudFormation.get('/user/:id_user/nbFormations', async (req,res) => {
    const {id_user} = req.params;

    try{
        const nbFormationsUser = await pool.query(
            `SELECT count(*) FROM "Formations" WHERE id_user=$1`,
            [id_user]
        );

        // Vérifier si l'utilisateur existe
        if(nbFormationsUser.rows.length === 0){
            return res.status(404).json({message:`User ${id_user} doesn't exists`});
        }

        // Récupérer et couvertir le nombre de formation
        const countNbFormationsUser = parseInt(nbFormationsUser.rows[0].count,10);

        // Afficher le nombre de formation pour un utilisateur
        console.log(countNbFormationsUser);
        res.status(200).json(countNbFormationsUser);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read nomber of formation in the user"});
    }
});

// Récuperer la moyenne des hummeur d'un group
crudFormation.get(`/group/:id_group/avg_hummer`, async (req,res) => {
    const {id_group} = req.params;
    try{
        // Vérifier si le groupe existe
        const groupCheck = await pool.query(
            `SELECT * FROM "Group" WHERE id_group=$1`,
            [id_group]
        );
        if(groupCheck.rows.length === 0){
            return res.status(404).json({message:`Group ${id_group} doesn't exists`});
        }

        // Calculer la moyenne des humeurs des utilisateurs du group
        const averageResult = await pool.query(
            `SELECT AVG(u.hummer) AS average_hummer
             FROM "User" u
             JOIN "Formations" f ON u.id_user = f.id_user
             WHERE f.id_group = $1`,
            [id_group]
        );

        const averageHummer = averageResult.rows[0].average_hummer;

        // Affichage du resultat
        console.log(averageHummer);
        res.status(200).json({ id_group, average_hummer: averageHummer || 0 });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failled to calculate the avrage"});
    }
});

// Supprimer un utilisateur d'un group
crudFormation.delete(`/group/:id_group/user/:id_user`, async (req,res) => {
    const {id_group,id_user} = req.params;
    try{
        // Vérifier si l'utilisateur est bien dans le groupe
        const checkMembership = await pool.query(
            `SELECT * FROM "Formations" WHERE id_user = $1 AND id_group = $2`,
            [id_user,id_group]
        );

        if(checkMembership.rows.length === 0){
            return res.status(404).json({ message: `User ${id_user} is not in group ${id_group}`});
        }

        // Suppresion d'un utilisateur du group
        await pool.query(
            `DELETE FROM "Formations" WHERE id_user=$1 AND id_group=$2`,
            [id_user,id_group]
        );

        console.log(`User ${id_user} removed from ${id_group}`);
        res.status(200).json({message:`User ${id_user} removed from ${id_group}`});
    }
    catch (err){
        console.log(err);
        res.status(500).json({erro:"Failed to remove user from group"});
    }
});

module.exports = crudFormation;
