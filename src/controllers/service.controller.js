import Service from "../models/service.model.js";
import { validateService } from "../middleware/validateService.js";

const serviceController = {
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find().lean();
      if (!services.length) {
        return res.status(404).json({ message: "Không có dịch vụ nào" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error: error.message });
    }
  },

  getServiceByName: async (req, res) => {
    try {
      const { name } = req.params;
      const regex = new RegExp(name.trim(), "i");
      const services = await Service.find({ name: { $regex: regex } }).lean();

      if (!services.length) {
        return res.status(404).json({ message: "Không tìm thấy dịch vụ nào phù hợp" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tìm dịch vụ", error: error.message });
    }
  },

  getServicesByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      // Validate category
      if (!["Sửa chữa", "Bảo dưỡng"].includes(category)) {
        return res.status(400).json({ message: "Danh mục phải là 'Sửa chữa' hoặc 'Bảo dưỡng'" });
      }

      const services = await Service.find({ category }).lean();

      if (!services.length) {
        return res.status(404).json({ message: `Không tìm thấy dịch vụ nào thuộc danh mục ${category}` });
      }

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ theo danh mục", error: error.message });
    }
  },

  createService: [
    validateService(true), // true indicates creation (check for duplicate name)
    async (req, res) => {
      try {
        const { name, description, price, duration, category, status } = req.body;

        const newService = new Service({
          name: name.trim(),
          description: description.trim(),
          price,
          duration,
          category,
          status: status || "Hoạt động",
        });

        const savedService = await newService.save();

        res.status(201).json({
          message: "Tạo dịch vụ thành công",
          data: savedService,
        });
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo dịch vụ", error: error.message });
      }
    },
  ],

  updateService: [
    validateService(false), 
    async (req, res) => {
      try {
        const { id } = req.params;
        const { name, description, price, duration, category, status } = req.body;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (price) updateData.price = price;
        if (duration) updateData.duration = duration;
        if (category) updateData.category = category;
        if (status) updateData.status = status;

        const updatedService = await Service.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedService) {
          return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
        }

        res.status(200).json({
          message: "Cập nhật dịch vụ thành công",
          data: updatedService,
        });
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật dịch vụ", error: error.message });
      }
    },
  ],

  deleteService: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });
      }

      const deletedService = await Service.findByIdAndDelete(id).lean();

      if (!deletedService) {
        return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
      }

      res.status(200).json({
        message: "Xóa dịch vụ thành công",
        data: deletedService,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa dịch vụ", error: error.message });
    }
  },
};

export default serviceController