import Service from "../models/service.model.js";
import { validateService } from "../middleware/validateService.js";

const serviceController = {
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find().lean();
      if (!services.length) {
        return res.status(404).json({ message: "No services found" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving service list", error: error.message });
    }
  },

  getServiceByName: async (req, res) => {
    try {
      const { name } = req.params;
      const regex = new RegExp(name.trim(), "i");
      const services = await Service.find({ name: { $regex: regex } }).lean();

      if (!services.length) {
        return res.status(404).json({ message: "No matching services found" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Error searching for services", error: error.message });
    }
  },

  getServicesByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      if (!["Sửa chữa", "Bảo dưỡng"].includes(category)) {
        return res.status(400).json({ message: "Category must be 'Sửa chữa' or 'Bảo dưỡng'" });
      }

      const services = await Service.find({ category }).lean();

      if (!services.length) {
        return res.status(404).json({ message: `No services found in category ${category}` });
      }

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving services by category", error: error.message });
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
          status: status || "Active",
        });

        const savedService = await newService.save();

        res.status(201).json({
          message: "Service created successfully",
          data: savedService,
        });
      } catch (error) {
        res.status(500).json({ message: "Error creating service", error: error.message });
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
          return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({
          message: "Service updated successfully",
          data: updatedService,
        });
      } catch (error) {
        res.status(500).json({ message: "Error updating service", error: error.message });
      }
    },
  ],

  deleteService: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedService = await Service.findByIdAndDelete(id);

      if (!deletedService) {
        return res.status(404).json({ message: "Service not found for deletion" });
      }

      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting service", error });
    }
  },
};

export default serviceController;