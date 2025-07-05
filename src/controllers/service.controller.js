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
};

export default serviceController;
