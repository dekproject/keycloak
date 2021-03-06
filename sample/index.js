import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

import { $, plugins, keycloak, memoryStore } from "@dekproject/scope";

(async () => {
    await plugins("");

    $.set("app", express());
    $.app.use(bodyParser.urlencoded({ extended: false }));
    $.app.use(bodyParser.json());

    const PORT = process.env.PORT || 5555;

    $.wait("keycloak", 3000).then(async () => {
        console.log("noix");
        $.app.use(session({
            secret: 'secret',
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }));

        $.app.use( keycloak.middleware( { logout: '/logout' } ));

        $.app.get('/', (req, res) => { res.send("insecure content").end(); });

        $.app.get('/protect', keycloak.protect(), (req, res) => {
            res.send("protected content").end();
        });

        $.app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}!`);
        });
    }).catch((err) => {
        console.log(err);
    });
})();
