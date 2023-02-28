import Router from "express"
import Controller from "./controller.js"

const router = new Router()

router.post("/delete", Controller.deleteFile)
router.post("/upload", Controller.uploadFiles)
router.get("/download", Controller.downloadFile)
router.get("/delete", Controller.deleteFileFromLink)
router.get("/json", Controller.getJson)
router.get('/getConfig', Controller.getConfig)

export default router