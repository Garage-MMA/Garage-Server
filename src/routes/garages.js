const express = require("express")
const router = express.Router()
const garageController = require("~/controllers/garageController")

// Route lấy danh sách garage gần vị trí người dùng
router.get("/", garageController.getNearbyGarages)

// Route thêm mới garage
router.post("/", garageController.createGarage)

// Route cập nhật thông tin garage
router.put("/:id", garageController.updateGarage)

// Route xóa garage
router.delete("/:id", garageController.deleteGarage)

module.exports = router
