import mongoose from "mongoose";
import Service from "../models/service.model.js";

export const validateService = (isCreate) => async (req, res, next) => {
  try {
    const { id } = req.params || {};
    const { name, description, price, duration, category, status } = req.body;

    const errors = [];

    // Validate ID for update
    if (!isCreate && (!id || !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });
    }

    // Validate fields
    if (name || (isCreate && !name)) {
      if (typeof name !== "string" || name.trim().length < 2) {
        errors.push("Tên dịch vụ phải là chuỗi và có ít nhất 2 ký tự");
      }
      // Check for duplicate name
      const query = isCreate ? { name: name?.trim() } : { name: name?.trim(), _id: { $ne: id } };
      if (name && (await Service.findOne(query))) {
        errors.push("Tên dịch vụ đã tồn tại");
      }
    }

    if (description || (isCreate && !description)) {
      if (typeof description !== "string" || description.trim().length < 10) {
        errors.push("Mô tả phải là chuỗi và có ít nhất 10 ký tự");
      }
    }

    if (price || (isCreate && !price)) {
      if (typeof price !== "number" || price <= 0) {
        errors.push("Giá phải là số dương");
      }
    }

    if (duration || (isCreate && !duration)) {
      if (typeof duration !== "number" || duration <= 0) {
        errors.push("Thời gian phải là số dương");
      }
    }

    if (category || (isCreate && !category)) {
      if (!["Sửa chữa", "Bảo dưỡng"].includes(category)) {
        errors.push("Danh mục phải là 'Sửa chữa' hoặc 'Bảo dưỡng'");
      }
    }

    if (status) {
      if (!["Hoạt động", "Ngừng hoạt động"].includes(status)) {
        errors.push("Trạng thái phải là 'Hoạt động' hoặc 'Ngừng hoạt động'");
      }
    }

    // For create, ensure all required fields are present
    if (isCreate && (!name || !description || !price || !duration || !category)) {
      errors.push("Thiếu thông tin bắt buộc");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Lỗi xác thực", errors });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Lỗi xác thực", error: error.message });
  }
};