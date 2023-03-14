import express from 'express'
import serveIndex from 'serve-index'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import log4js from 'log4js'
import fileUpload from 'express-fileupload'
import router from './router.js'
import { program } from 'commander';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG_FILE_PATH = path.join(__dirname, './config.json');
program.option('-c, --config-file <string>', 'configuration file', CONFIG_FILE_PATH);

program.parse();

const app = express();

export const config = JSON.parse(fs.readFileSync(program.opts().configFile));

const PORT = config.port || 8080;
let log;

/////////// LOG
try {
    log4js.configure(config.log4js);
    log = log4js.getLogger('MAIN');
} catch (error) {
    console.log(`Error: Failed to init log4js with configuration file (${CONFIG_FILE_PATH}): ${error}`);
}

/////////////// USE MIDDLEWARES
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());

app.use(fileUpload());

app.use(router);

app.use('/', express.static(path.join(__dirname, 'public')), serveIndex(path.join(config.directory), { 
    icons: true, 
    stylesheet: path.join(__dirname, 'public/styles.css'),
    template: path.join(__dirname, 'public/template.html')
}));

if (config.enableDownload) {
    app.use('/', serveStatic(path.resolve(config.directory)));
}

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`)
});