import Service from "../models/service.model.js";

const serviceController = {
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find().lean();
      if (!services.length) {
        return res.status(404).json({ message: "Không có dịch vụ nào" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error });
    }
  },

  getServiceByName: async (req, res) => {
    try {
      const { name } = req.params;

      const regex = new RegExp(name.trim(), "i"); // "i" là để không phân biệt hoa thường

      const services = await Service.find({ name: { $regex: regex } }).lean();

      if (!services.length) {
        return res.status(404).json({ message: "Không tìm thấy dịch vụ nào phù hợp" });
      }

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tìm dịch vụ", error });
    }
  },

  createService: async (req, res) => {
  try {
    const { name, description, price, duration, category, status } = req.body;

    
    if (!name || !description || !price || !duration || !category) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    
    const newService = new Service({
      name,
      description,
      price,
      duration,
      category,
      status, 
    });

    const savedService = await newService.save();

    res.status(201).json({
      message: "Tạo dịch vụ thành công",
      data: savedService,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo dịch vụ", error });
  }
},

};


export default serviceController;
