const bcrypt = require("bcrypt");
const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./db");
const { error } = require("console");

const historyHummer = express.Router();

// Consulter l'ensemble des historique des hummer
historyHummer.get('/historyHummer', async (req,res) => {
    try{
        const historys = await pool.query(
            `SELECT * FROM "Historique"`
        );
        if(historys.rows.length === 0){
            return res.status(404).json({message:"There aren't history hummer"});
        }

        // Affichage liste historique hummeur
        console.log(historys.rows);
        res.status(200).json(historys.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read history hummer."});
    }
});

// Consulter les 10 derniers des historique d'hummer
historyHummer.get('/lastshistoryHummer',async(req,res) => {
    try{
        const lastshistorys = await pool.query(
            `SELECT * FROM "Historique" ORDER BY "Date_Hummer" DESC LIMIT 10`
        );
        if(lastshistorys.rows.length === 0){
            return res.status(404).json({message:"There aren't history hummer"});
        }

        // Affichage des 10 dernier historique hummeur
        console.log(lastshistorys.rows);
        res.status(200).json(lastshistorys.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read history hummer."});
    }
});

// Consulter la date de la dernière mise à jour d'hummer
historyHummer.get('/lasthistoryHummer',async(req,res) =>{
    try{
        const lasthistorys = await pool.query(
            `SELECT * FROM "Historique" ORDER BY "Date_Hummer" DESC LIMIT 1`
        );
        if(lasthistorys.rows.length === 0){
            return res.status(404).json({message:"There aren't history hummer"});
        }

        // Affichage des 10 dernier historique hummeur
        console.log(lasthistorys.rows);
        res.status(200).json(lasthistorys.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read history hummer."});
    }
});

// Affichage historique hummeur pour un utilisateur
historyHummer.get('/historyHummer/user/:id_user', async (req,res) => {
    const {id_user} = req.params;
    try{
        // Verifer si l'utilisateur existe
        const historyUser = await pool.query(
            `SELECT * FROM "Historique" WHERE id_user=$1`,
            [id_user]
        );
        if(historyUser.rows.length === 0){
            return res.status(404).json({message: `User ${id_user} doesn't exists.`});
        }

        // Afficher la liste des alertes pour un utilisateur
        console.log(historyUser.rows);
        res.status(200).json(historyUser.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read history hummeur user"});
    }
});

// Obtenir les 10 derniers historique d'hummer pour un utiisateur
historyHummer.get('/lastshistoryHummer/user/:id_user', async (req,res) =>{
    const {id_user} = req.params;
    try{
        // Verifer si l'utilisateur existe
        const lastshistoryUser = await pool.query(
            `SELECT * FROM "Historique" WHERE id_user=$1 ORDER BY "Date_Hummer" DESC LIMIT 10`,
            [id_user]
        );
        if(lastshistoryUser.rows.length === 0){
            return res.status(404).json({message: `User ${id_user} doesn't exists.`});
        }

        // Afficher les 10 derniers alertes pour un utilisateur
        console.log(lastshistoryUser.rows);
        res.status(200).json(lastshistoryUser.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read history hummeur user"});
    }
});

// Afficher la date de la dernière mise à jour de l'hummeur de l'utilisateur
historyHummer.get('/lasthistoryHummer/user/:id_user', async (req,res) => {
    const {id_user} = req.params;
    try{
        // Verifer si l'utilisateur existe
        const lasthistoryUser = await pool.query(
            `SELECT * FROM "Historique" WHERE id_user=$1 ORDER BY "Date_Hummer" DESC LIMIT 1`,
            [id_user]
        );
        if(lasthistoryUser.rows.length === 0){
            return res.status(404).json({message: `User ${id_user} doesn't exists.`});
        }

        // Afficher les 10 derniers alertes pour un utilisateur
        console.log(lasthistoryUser.rows);
        res.status(200).json(lasthistoryUser.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read history hummeur user"});
    }
});

module.exports =historyHummer;
