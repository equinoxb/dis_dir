import path from 'path'
import fs from 'fs'
import log4js from 'log4js'
import {config} from './index.js'

let log = log4js.getLogger('SERVICE');

class Service {

    ///////// DELETE FILE BUTTON
    deleteFile (file) { 
        let filePath = path.resolve(config.directory, Object.keys(file)[0].split('/').slice(4).join('/'));
        let fileExists = fs.existsSync(filePath);
        if (fileExists) {
            fs.unlinkSync(filePath);
            log.info(`File deleted: ${filePath}`);
        } else {
            log.error("File was not delete: " + filePath);
            throw new Error;
        }
    }

    ///////////////////////////// UPLOAD FILES
    uploadFiles (fileData) {
        let file = fileData.filename;
        let filename = decodeURI(file.name);
        let filePath = path.resolve(config.directory, filename);
        let fileExists = fs.existsSync(filePath);

        if (!fileExists) {
            file.mv((filePath), (err) => {
                if (err) {
                    log.error(err.stack);
                } else {
                    log.info("File uploaded: " + filePath);
                }
            })
        } else {
            log.error('The file is already exists: ' + filePath);
            throw new Error('The file is already exists: ' + filename);
        }
    } 
    
    ////////////////// DOWNLOAD FILE FROM LINK
    downloadFile (file) {
        let filePath = path.resolve(config.directory, file)
        let fileExists = fs.existsSync(filePath)

        if (fileExists) {
            log.info(`File downloaded from link ${filePath}`);
            return filePath;
        } else {
            log.error('File is missing: '+ filePath);
            throw new Error('File is missing: '+ filePath);
        }       
    }

    ////////////////// DELETE FILE FROM LINK
    deleteFileFromLink (file) {
        let filePath = path.resolve(config.directory, file);
        let fileExists = fs.existsSync(filePath);

        if (fileExists) {
            log.info(`File deleted from link: ${filePath}`);
            fs.unlinkSync(filePath);
        } else {
            log.error('File is missing: '+ filePath);
            throw new Error('File is missing: '+ filePath)  ;          
        }      
    }

    //////////////////////// PAGE IN JSON FORMAT
    getJson (hostname) {
        let objFiles = {
            files: []
        }
    
        let dirPath = path.resolve(config.directory);
        let fileStat;
    
        fs.readdirSync(dirPath).forEach(fileName => {
            fileStat = fs.statSync(path.join(dirPath, fileName));
                objFiles.files.push ({
                    fileName: fileName, 
                    fileSize: fileStat.size, 
                    fileUploadTime: fileStat.ctime, 
                    fileDownloadLink: `${hostname}/download?filepath=${encodeURIComponent(fileName)}`, 
                    fileDeleteLink: `${hostname}/delete?filepath=${encodeURIComponent(fileName)}`
                });
        });
        return JSON.stringify(objFiles, null, '\t');
    }
}

export default new Service();