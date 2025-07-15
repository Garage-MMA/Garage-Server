import mongoose from "mongoose";
import Garage from "../models/garage.model.js";

export const validateService = (isCreate) => async (req, res, next) => {
  try {
    const { garageId } = req.params;
    const { index } = req.params || {}; // For update
    const { name } = req.body;

    if (typeof garageId !== "string" || !/^[0-9a-fA-F]{24}$/.test(garageId)) {
      return res.status(400).json({ message: "ID garage không hợp lệ" });
    }

    const garage = await Garage.findOne({ _id: garageId }).select('services');
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    const errors = [];

    // Validate for update index
    if (!isCreate) {
      const idx = parseInt(index);
      if (isNaN(idx) || idx < 0 || idx >= garage.services.length) {
        return res.status(400).json({ message: "Index dịch vụ không hợp lệ" });
      }
    }

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.push("Tên dịch vụ phải là chuỗi và có ít nhất 2 ký tự");
    } else {
      const trimmedName = name.trim();
      const duplicate = garage.services.some((s, i) => 
        s.toLowerCase() === trimmedName.toLowerCase() && (isCreate || i !== parseInt(index))
      );
      if (duplicate) {
        errors.push("Tên dịch vụ đã tồn tại trong garage này");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Lỗi xác thực", errors });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Lỗi xác thực", error: error.message });
  }
};