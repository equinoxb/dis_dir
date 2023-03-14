import log4js from 'log4js'
import Service from './Service.js';
import {config} from './index.js'

let log = log4js.getLogger('CONTROLLER');

class Controller {
    ///////// DELETE FILE BUTTON
    deleteFile (req, res) {
        if (config.enableDelete) {
            try {
                log.info(`Route: ${req.url} Method: ${req.method}`);
                Service.deleteFile(req.body);
                return res.sendStatus(200);
                }
            catch(e) {
                log.info(`Route: ${req.url} Method: ${req.method} StatusCode: 500`);
                res.sendStatus(500);
            }
        }
    }

    ///////////////////////////// UPLOAD FILES
    uploadFiles (req, res) {
        if (config.enableUpload) {
            if (req.files) {
                try {
                    log.info(`Route: ${req.url} Method: ${req.method}`);
                    Service.uploadFiles(req.files);
                    res.sendStatus(200);
                } catch(e){
                    log.info(`Route: ${req.url} Method: ${req.method} StatusCode: 500`);
                    res.status(500).json(e.message);
                }
            } else {
                res.redirect('back');
            }
        } else {
            res.redirect('back');
        }
    }

    ////////////////// DOWNLOAD FILE FROM LINK
    downloadFile (req, res) {
        if (config.enableDownload) {
            try {
                log.info(`Route: ${req.url} Method: ${req.method}`);
                let filePath = Service.downloadFile(req.query.filepath);
                res.download(filePath);
            }
            catch (err) {
                log.info(`Route: ${req.url} Method: ${req.method} StatusCode: 500`);
                res.status(500).send(err.message);
            }
        } else {
            log.info(`Route: ${req.url} Method: ${req.method} StatusCode: 401`);
            res.status(401).send("Access denied");
        }
    }

    ////////////////// DELETE FILE FROM LINK
    deleteFileFromLink (req, res) {
        if (config.enableDelete) {
            log.info(`Route: ${req.url} Method: ${req.method}`);
            try {
                Service.deleteFileFromLink(req.query.filepath);
                res.send(`File deleted: ${req.query.filepath}`);
            }
            catch (err) {
                log.info(`Route: ${req.url} Method: ${req.method} StatusCode: 500`);
                res.status(500).send(err.message);
            }
        } else {
            res.status(401).send("Access denied");
        }
    }

    //////////////////////// PAGE IN JSON FORMAT
    getJson (req, res) {
        log.info(`Route: ${req.url} Method: ${req.method}`);
        let result = Service.getJson(req.headers.host);
        res.json(result);  
    }

    getConfig(req, res) {
        try {
            log.info(`Route: ${req.url} Method: ${req.method}`);
            res.statusCode = 200;
            res.send(config);
        }
        catch(err) {
            log.error(e.message);
        }
    }
}

export default new Controller();