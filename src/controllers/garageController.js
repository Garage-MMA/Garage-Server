const Garage = require("~/models/Garages")

exports.getNearbyGarages = async (req, res) => {
  try {
    const latitude = parseFloat(req.query.lat)
    const longitude = parseFloat(req.query.lon)

    const isValidNumber = (num) => !isNaN(num) && isFinite(num)
    if (!isValidNumber(latitude) || !isValidNumber(longitude)) {
      return res.status(400).json({ message: "Vĩ độ và kinh độ không hợp lệ" })
    }

    const nearbyGarages = await Garage.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 20000 // 20 km
        }
      }
    })

    res.status(200).json({ garages: nearbyGarages })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}

exports.createGarage = async (req, res) => {
  try {
    const { _id, name, address, latitude, longitude, services, rating, phone, openHours, image } = req.body

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "Vĩ độ và kinh độ không hợp lệ." })
    }

    const newGarage = new Garage({
      _id,
      name,
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      services,
      rating,
      phone,
      openHours,
      image
    })

    await newGarage.save()
    res.status(201).json({ message: "Thêm garage thành công!", garage: newGarage })
  } catch (error) {
    console.error("Lỗi khi thêm garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}

exports.updateGarage = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Chỉ cho phép update các field hợp lệ
    const allowedFields = ["name", "address", "services", "rating", "phone", "openHours", "image", "latitude", "longitude"]
    const filteredUpdate = {}

    for (let key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdate[key] = updateData[key]
      }
    }

    // Nếu có latitude & longitude thì cập nhật location
    if (filteredUpdate.latitude && filteredUpdate.longitude) {
      filteredUpdate.location = {
        type: "Point",
        coordinates: [parseFloat(filteredUpdate.longitude), parseFloat(filteredUpdate.latitude)]
      }
    }

    const updatedGarage = await Garage.findByIdAndUpdate(id, filteredUpdate, { new: true })

    if (!updatedGarage) {
      return res.status(404).json({ message: "Garage không tồn tại." })
    }

    res.status(200).json({ message: "Cập nhật garage thành công!", garage: updatedGarage })
  } catch (error) {
    console.error("Lỗi khi cập nhật garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}

exports.deleteGarage = async (req, res) => {
  try {
    const { id } = req.params

    const deletedGarage = await Garage.findByIdAndDelete(id)

    if (!deletedGarage) {
      return res.status(404).json({ message: "Garage không tồn tại." })
    }

    res.status(200).json({ message: "Xóa garage thành công!" })
  } catch (error) {
    console.error("Lỗi khi xóa garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}
