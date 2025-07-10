import Garage from "../models/garade.model.js"; // ❗ Đường dẫn này phải đúng tên file model

// 📌 Lấy toàn bộ danh sách garage
export const getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.find({});
    res.status(200).json({ garages });
  } catch (error) {
    console.error("Error while fetching all garages:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// 📌 Lấy danh sách garage gần vị trí
export const getNearbyGarages = async (req, res) => {
  try {
    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lon);

    const isValidNumber = (num) => !isNaN(num) && isFinite(num);
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return res.status(400).json({ message: "Invalid latitude or longitude." });
    }

    const nearbyGarages = await Garage.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 20000, // 20 km
        },
      },
    });

    res.status(200).json({ garages: nearbyGarages });
  } catch (error) {
    console.error("Error while fetching nearby garages:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// 📌 Tạo garage mới
export const createGarage = async (req, res) => {
  try {
    const {
      _id,
      name,
      address,
      latitude,
      longitude,
      services,
      rating,
      phone,
      openHours,
      image,
    } = req.body;

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid latitude or longitude." });
    }

    const newGarage = new Garage({
      _id,
      name,
      address,
      latitude,
      longitude,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      services,
      rating,
      phone,
      openHours,
      image,
    });

    await newGarage.save();
    res.status(201).json({ message: "Garage created successfully!", garage: newGarage });
  } catch (error) {
    console.error("Error while creating garage:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// 📌 Cập nhật garage
export const updateGarage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = [
      "name",
      "address",
      "services",
      "rating",
      "phone",
      "openHours",
      "image",
      "latitude",
      "longitude",
    ];
    const filteredUpdate = {};

    for (let key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdate[key] = updateData[key];
      }
    }

    if (filteredUpdate.latitude && filteredUpdate.longitude) {
      filteredUpdate.location = {
        type: "Point",
        coordinates: [
          parseFloat(filteredUpdate.longitude),
          parseFloat(filteredUpdate.latitude),
        ],
      };
    }

    const updatedGarage = await Garage.findByIdAndUpdate(id, filteredUpdate, {
      new: true,
    });

    if (!updatedGarage) {
      return res.status(404).json({ message: "Garage not found." });
    }

    res.status(200).json({ message: "Garage updated successfully!", garage: updatedGarage });
  } catch (error) {
    console.error("Error while updating garage:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// 📌 Xoá garage
export const deleteGarage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGarage = await Garage.findByIdAndDelete(id);

    if (!deletedGarage) {
      return res.status(404).json({ message: "Garage not found." });
    }

    res.status(200).json({ message: "Garage deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting garage:", error);
    res.status(500).json({ message: "Server error." });
  }
};
