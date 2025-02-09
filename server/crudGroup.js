const bcrypt = require("bcrypt");
const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./db");
const { error } = require("console");

const crudGroup = express.Router();
crudGroup.use(cookieParser());

// Créer un group
crudGroup.post("/createGroup", async (req,res) =>{
    const {name} = req.body;

    if(!name){
        return res.status(400).json({message:"Name is required"});
    }

    try{
        const group = await pool.query(
            `SELECT * FROM "Group" WHERE name=$1`,
            [name]
        );

        if(group.rows.length > 0){
            return res.status(409).json({message: `Group ${name} already exists`});
        }

        await pool.query(
            `INSERT INTO "Group" (name) VALUES ($1)`,
            [name]
        );

        console.log(`Group ${name} create`);
        res.status(201).json({message: `Group ${name} registered successfully.`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to register group"});
    }
});

// Consulter tous les groups
crudGroup.get("/groups", async (req,res) =>{
    try{
        const groups = await pool.query(
            `SELECT * FROM "Group" ORDER BY name`
        );

        // Si absance de group
        if(groups.rows.length ===0){
            return res.status(404).json({message:"No group"});
        }
        // affichage liste
        console.log(groups.rows);
        res.status(200).json(groups.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read group"});
    }
});

// Afficher le nombre de group
crudGroup.get("/nbGroup", async (req,res) => {
    try{
        const nbGroup = await pool.query(
            `SELECT count(*) FROM "Group"`
        );

        // Si il n'y a pas de groupe
        if(nbGroup.rows.length === 0){
            return res.status(404).json({message:"There aren't group."});
        }

        // Récupérer et couvertir le nombre de group
        const countGroup = parseInt(nbGroup.rows[0].count, 10);

        // Afficher le nombre de groupe
        console.log(countGroup);
        res.status(200).json(countGroup);
    }
    catch(err){
        console.log(err);
        res.status.json({error:"Can't read nomber group."});
    }
});

// Consulter le groupe
crudGroup.get("/group/:id",async( req, res) => {
    const {id} = req.params;

    try{
        const group = await pool.query(
            'SELECT name FROM "Group" WHERE id_group=$1 ORDER BY name',
            [id]
        );

        if(group.rows.length === 0){
            return res.status(404).json({message:`Group ${id} doesn't exists`})
        }
        console.log(group.rows)
        res.status(200).json(group.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read group"});
    }
});

// Modifier le nom du groupe
crudGroup.put("/updateGroup/:id", async (req,res) => {
    const {name} = req.body;
    const {id} = req.params;

    try{
        const groupExist = await pool.query(
            `SELECT * FROM "Group" WHERE id_group=$1`,
            [id]
        );

        if(groupExist.rows.length === 0){
            return res.status(404).json({message:`Group ${name} doesn't exist.`});
        }

        if(!name){
            return res.status(400).json({message:"Name value is required"});
        }

        // Vérifier si un autre groupe a déjà ce nom
        const checkDuplicate = await pool.query(
            `SELECT * FROM "Group" WHERE name = $1 AND id_group <> $2`,
            [name, id]
        );

        if (checkDuplicate.rows.length > 0) {
            return res.status(409).json({ message: "Group name already taken by another group." });
        }

        await pool.query(
            `UPDATE "Group" SET name=$1 WHERE id_group=$2`,
            [name,id]
        );
        console.log(`Group ${id} update successfully.`)
        res.status(200).json({message:`Group ${id} update successfully.`})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Update group failed!"});
    }
});

// Supprimer un group
crudGroup.delete("/deleteGroup/:id", async (req,res) => {
    const {id} = req.params;

    try{
        const groupExist = await pool.query(
            `SELECT * FROM "Group" WHERE id_group=$1`,
            [id]
        );

        if(groupExist.rows.length === 0){
            return res.status(404).json({message:`Group ${id} doesn't exists`});
        }

        // Supprimer les clé étrangères des autres tables si elles existent
        const groupFormation = await pool.query(
            `SELECT * FROM "Formations" WHERE id_group=$1`,
            [id]
        );
        if(groupFormation.rows.length > 0){
            await pool.query(
                `DELETE FROM "Formations" WHERE id_group=$1`,
                [id]
            );
        }

        // Suppersion du groupe
        await pool.query(
            'DELETE FROM "Group" WHERE id_group=$1',
            [id]
        );

        console.log(`Group ${id} deleted successfully.`);
        res.status(200).json({message:`Group ${id} deleted successfully.`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Delete Group failed."});
    }
});

module.exports = crudGroup;