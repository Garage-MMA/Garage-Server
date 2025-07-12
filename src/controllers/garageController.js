import Garage from "../models/garade.model.js";
import cloudinary from '../config/cloudinary.js';

export const getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.find({});
    res.status(200).json({ garages });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả garage:", error);
    res.status(500).json({ message: "Lỗi server." });
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
      return res.status(400).json({ message: "Vĩ độ và kinh độ không hợp lệ" });
    }


    const nearbyGarages = await Garage.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 20000,
        },
      },
    });



    res.status(200).json({ garages: nearbyGarages });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách garage:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// 📌 Tạo garage mới
export const createGarage = async (req, res) => {
  try {
    const {
      ownerId,
      name,
      address,
      latitude,
      longitude,
      services,
      rating,
      phone,
      imageBase64
    } = req.body;

    let image;
    if (imageBase64) {
      // Upload base64 image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${imageBase64}`,
        { folder: 'garage_images' }
      );
      image = uploadResponse.secure_url;
    }

    if (!ownerId || !name || !address || !phone || !latitude || !longitude ) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: 'Latitude phải từ -90 đến 90, longitude từ -180 đến 180.' });
    }

    const newGarage = new Garage({
      ownerId,
      name,
      address,
      latitude: lat,
      longitude: lng,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      services,
      rating,
      phone,
      image, // Lưu URL ảnh Cloudinary
    });

    await newGarage.save();
    res.status(201).json({ message: "Thêm garage thành công!", garage: newGarage });
  } catch (error) {
    console.error("Lỗi khi thêm garage:", error);
    res.status(500).json({ message: "Lỗi server.", error: error.message });
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
      return res.status(404).json({ message: "Garage không tồn tại." });
    }

    res.status(200).json({ message: "Cập nhật garage thành công!", garage: updatedGarage });
  } catch (error) {
    console.error("Lỗi khi cập nhật garage:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// 📌 Xoá garage
export const deleteGarage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGarage = await Garage.findByIdAndDelete(id);

    if (!deletedGarage) {
      return res.status(404).json({ message: "Garage không tồn tại." });
    }

    res.status(200).json({ message: "Xóa garage thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa garage:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

/// theem
export const getGarageByOwnerId = async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.params.ownerId;

    if (!ownerId) return res.status(400).json({ message: "Missing ownerId" });

    const garages = await Garage.getGarageByOwnerId(ownerId);

    res.status(200).json({ garages });
  } catch (error) {
    console.error("");
    res.status(500).json({ message: "Server error", error });
  }
};
//theem
///theem

export const searchGaragesByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: "Thiếu tên hoặc tên không hợp lệ." });
    }

    const garages = await Garage.find({
      name: { $regex: name, $options: "i" } 
    });

    res.status(200).json({ garages });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm garage theo tên:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
