import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const getMyVehicles = async (req, res) => {
  try {
    // Xác minh token JWT và lấy ID người dùng
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Không có token được cung cấp" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Kiểm tra vai trò khách hàng
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Truy cập bị từ chối: Yêu cầu vai trò khách hàng" });
    }

    // Tìm người dùng và chọn trường vehicles
    const user = await User.findById(decoded.userId).select('vehicles');
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Lấy danh sách phương tiện thành công",
      vehicles: user.vehicles || []
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách phương tiện:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// const addVehicle = async (req, res) => {
//   try {
//     // Xác minh token JWT và lấy ID người dùng
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: "Không có token được cung cấp" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
//     }

//     // Kiểm tra vai trò khách hàng
//     if (decoded.role !== 'customer') {
//       return res.status(403).json({ message: "Truy cập bị từ chối: Yêu cầu vai trò khách hàng" });
//     }

//     // Lấy dữ liệu phương tiện từ body
//     const { licensePlate, brand, model, year, color } = req.body;
//     if (!licensePlate) {
//       return res.status(400).json({ message: "Biển số xe là bắt buộc" });
//     }

//     // Tìm người dùng
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: "Không tìm thấy người dùng" });
//     }

//     // Kiểm tra biển số xe đã tồn tại trong danh sách phương tiện của người dùng
//     if (user.vehicles.some(vehicle => vehicle.licensePlate === licensePlate)) {
//       return res.status(400).json({ message: "Biển số xe đã tồn tại" });
//     }

//     // Thêm phương tiện mới
//     const newVehicle = {
//       licensePlate: licensePlate.trim(),
//       brand: brand?.trim(),
//       model: model?.trim(),
//       year,
//       color: color?.trim()
//     };
//     user.vehicles.push(newVehicle);

//     await user.save();

//     res.status(201).json({
//       message: "Thêm phương tiện thành công",
//       vehicle: newVehicle
//     });
//   } catch (error) {
//     console.error("Lỗi thêm phương tiện:", error);
//     res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
//   }
// };

// const updateVehicle = async (req, res) => {
//   try {
//     // Xác minh token JWT và lấy ID người dùng
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: "Không có token được cung cấp" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
//     }

//     // Kiểm tra vai trò khách hàng
//     if (decoded.role !== 'customer') {
//       return res.status(403).json({ message: "Truy cập bị từ chối: Yêu cầu vai trò khách hàng" });
//     }

//     // Lấy biển số xe từ params và dữ liệu cập nhật từ body
//     const { licensePlate } = req.params;
//     const { brand, model, year, color, newLicensePlate } = req.body;

//     // Tìm người dùng
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: "Không tìm thấy người dùng" });
//     }

//     // Tìm phương tiện cần cập nhật
//     const vehicle = user.vehicles.find(v => v.licensePlate === licensePlate);
//     if (!vehicle) {
//       return res.status(404).json({ message: "Không tìm thấy phương tiện" });
//     }

//     // Kiểm tra biển số mới (nếu có) không trùng với các phương tiện khác
//     if (newLicensePlate && newLicensePlate !== licensePlate) {
//       if (user.vehicles.some(v => v.licensePlate === newLicensePlate)) {
//         return res.status(400).json({ message: "Biển số mới đã tồn tại" });
//       }
//       vehicle.licensePlate = newLicensePlate.trim();
//     }

//     // Cập nhật các trường khác nếu được cung cấp
//     if (brand !== undefined) vehicle.brand = brand?.trim();
//     if (model !== undefined) vehicle.model = model?.trim();
//     if (year !== undefined) vehicle.year = year;
//     if (color !== undefined) vehicle.color = color?.trim();

//     await user.save();

//     res.status(200).json({
//       message: "Cập nhật phương tiện thành công",
//       vehicle
//     });
//   } catch (error) {
//     console.error("Lỗi cập nhật phương tiện:", error);
//     res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
//   }
// };

// const deleteVehicle = async (req, res) => {
//   try {
//     // Xác minh token JWT và lấy ID người dùng
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: "Không có token được cung cấp" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
//     }

//     // Kiểm tra vai trò khách hàng
//     if (decoded.role !== 'customer') {
//       return res.status(403).json({ message: "Truy cập bị từ chối: Yêu cầu vai trò khách hàng" });
//     }

//     // Lấy biển số xe từ params
//     const { licensePlate } = req.params;

//     // Tìm người dùng
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: "Không tìm thấy người dùng" });
//     }

//     // Tìm và xóa phương tiện
//     const vehicleIndex = user.vehicles.findIndex(v => v.licensePlate === licensePlate);
//     if (vehicleIndex === -1) {
//       return res.status(404).json({ message: "Không tìm thấy phương tiện" });
//     }

//     user.vehicles.splice(vehicleIndex, 1);
//     await user.save();

//     res.status(200).json({
//       message: "Xóa phương tiện thành công"
//     });
//   } catch (error) {
//     console.error("Lỗi xóa phương tiện:", error);
//     res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
//   }
// };

export default { getMyVehicles };