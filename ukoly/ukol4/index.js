// Jan Vlček, vlcj07
// Úkol č. 4

import chalk from "chalk";
import http from "http";
import fs from "fs/promises";
import {lookup} from "mime-types"

const server = http.createServer(async (req, res) => {
    try {
        if (req.url === "/") {
            const index = await fs.readFile(`index.html`);
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.write(index);
            res.end();
            return;
        }

        const data = await fs.readFile(`./public${req.url}`);
        const contentType = lookup(req.url) || 'application/octet-stream';
        res.statusCode = 200;
        res.setHeader("Content-Type", contentType);
        res.write(data);
        res.end();
    } catch (err) {
        const error = await fs.readFile(`./public/404.html`);
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.write(error);
        res.end();
    }
})

server.listen(5001, "localhost", () => {
    console.log(chalk.green("server bezi na portu 5001"));
});