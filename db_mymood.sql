CREATE TABLE "User" (
    "id_user" SERIAL PRIMARY KEY,
    "name" varchar(50) NOT NULL UNIQUE,
    "email" varchar(50) NOT NULL UNIQUE,
    "password" varchar(255) NOT NULL,
    "status" varchar(20) NOT NULL CHECK("status" IN('student','supervisor', 'admin')),
    "hummer" integer,
    "call" boolean
);

CREATE TABLE "Group" (
    "id_group" SERIAL PRIMARY KEY,
    "name" varchar
);

CREATE TABLE "Formations" (
    "id_formation" SERIAL PRIMARY KEY,
    "id_user" integer references "User" ("id_user"),
    "id_group" integer references "Group" ("id_group")
);

CREATE TABLE "Historique" (
    "id_historique" SERIAL PRIMARY KEY,
    "id_user" integer references "User" ("id_user"),
    "Hummer" integer NOT NULL,
    "Date_Hummer" timestamp
);

CREATE TABLE "Alerte" (
    "id_alerte" SERIAL PRIMARY KEY,
    "id_user" integer references "User" ("id_user"),
    "Date_alerte" timestamp
);
