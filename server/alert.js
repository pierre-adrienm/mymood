const bcrypt = require("bcrypt");
const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./db");

const alert = express.Router();

// Cousuleter l'ensemble des alerte
alert.get('/alerts', async (req,res) => {
    try{
        const alerts = await pool.query(
            `SELECT * FROM "Alerte"`
        );
        if(alerts.rows.length === 0) {
            return res.status(404).json({error:"There aren't alerts!"});
        }

        console.log(alerts.rows);
        res.status(200).json(alerts.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read alert"});
    }
});

// Consulter les 10 dernier alertes
alert.get('/lastsAlerts',async (req,res) =>{
    try{
        const lastsAlerts = await pool.query(
            `SELECT * FROM "Alerte" ORDER BY "Date_alerte" DESC LIMIT 10`
        );
        // Si il n'y a pas d'alerts
        if(lastsAlerts.rows.length === 0) {
            return res.status(404).json({error:"There aren't alerts!"});
        }

        // Affichier les dernier alerts
        console.log(lastsAlerts.rows);
        res.status(200).json(lastsAlerts.rows);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read alert"});
    }
});

// Consulter la dernièrer la alerte
alert.get('/lastAlert', async (req,res) => {
    try{
        const lastAlert = await pool.query(
            `SELECT * FROM "Alerte" ORDER BY "Date_alerte" DESC LIMIT 1`
        );

        // Si il n'y a pas d'alerts
        if(lastAlert.rows.length === 0) {
            return res.status(404).json({error:"There aren't alerts!"});
        }

        // afficher le dernier alerte
        console.log(lastAlert.rows);
        res.status(200).json(lastAlert.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read alert"});
    }
});

// Consulter la liste des alertes sur un utilisateur
alert.get('/alerts/user/:id_user', async (req,res) => {
    const {id_user} = req.params;

    try{
        // Vérifier si l'utilisateur existe
        const alertUser = await pool.query(
            `SELECT * FROM "Alerte" WHERE id_user=$1`,
            [id_user]
        );
        if(alertUser.rows.length === 0){
            return res.status(404).json({message:`User ${id_user} doesn't exists.`});
        }

        // afficher la liste des alertes pour un utilisateur
        console.log(alertUser.rows);
        res.status(200).json(alertUser.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read alert user"});
    }
});

// Consulter les 10 dernier alertes sur un utilisateur
alert.get('/lastsAlerts/user/:id_user', async (req,res) =>{
    const {id_user} =req.params;

    try{
        const lastsAlertsUser = await pool.query(
            `SELECT * FROM "Alerte" WHERE id_user=$1 ORDER BY "Date_alerte" DESC LIMIT 10`,
            [id_user]
        );
        // Vérifier si l'utilisateur existe
        if(lastsAlertsUser.rows.length === 0){
            return res.status(404).json({message:`User ${id_user} doesn't exists.`});
        }

        // Afficher les 10 dernier alertes d'un utilisateur
        console.log(lastsAlertsUser.rows);
        res.status(200).json(lastsAlertsUser.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read alert user"});
    }
});

// Afficher la dernière alerte d'un utilisateur
alert.get('/lastAlert/user/:id_user', async (req,res) => {
    const {id_user} = req.params;
    try{
        const lastAlertUser =  await pool.query(
            `SELECT * FROM "Alerte" WHERE id_user=$1 ORDER BY "Date_alerte" DESC LIMIT 1`,
            [id_user]
        );

        // Vérifier si l'utilisateur existe
        if(lastAlertUser.rows.length === 0){
            return res.status(404).json({message:`User ${id_user} doesn't exists.`});
        }

        // Afficher le dernier alert d'un utilisateur
        console.log(lastAlertUser.rows);
        res.status(200).json(lastAlertUser.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Can't read alert user"});
    }
});

module.exports = alert;
