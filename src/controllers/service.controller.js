import Garage from "../models/garage.model.js";
import { validateService } from "../middleware/validateService.js";

const serviceController = {
  getAllServices: async (req, res) => {
    try {
      const { garageId } = req.params;
      const garage = await Garage.findOne({ _id: garageId }).select('services').lean();
      if (!garage) {
        return res.status(404).json({ message: "Garage not found" });
      }
      const services = garage.services || [];
      if (!services.length) {
        return res.status(404).json({ message: "No services found in this garage" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving service list", error: error.message });
    }
  },

  getServiceByName: async (req, res) => {
    try {
      const { garageId, name } = req.params;
      const garage = await Garage.findOne({ _id: garageId }).select('services').lean();
      if (!garage) {
        return res.status(404).json({ message: "Garage not found" });
      }
      const regex = new RegExp(name.trim(), "i");
      const services = garage.services.filter(s => regex.test(s));
      if (!services.length) {
        return res.status(404).json({ message: "No matching services found in this garage" });
      }
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Error searching for services", error: error.message });
    }
  },

  getServicesByCategory: async (req, res) => {
    // Bỏ chức năng này vì không có category nữa, hoặc redirect to error
    res.status(400).json({ message: "Category not supported for simple services" });
  },

  createService: [
    validateService(true),
    async (req, res) => {
      try {
        const { garageId } = req.params;
        const { name } = req.body;

        const garage = await Garage.findOne({ _id: garageId });
        if (!garage) {
          return res.status(404).json({ message: "Garage not found" });
        }

        const trimmedName = name.trim();
        if (garage.services.includes(trimmedName)) {
          return res.status(400).json({ message: "Service name already exists" });
        }

        garage.services.push(trimmedName);
        await garage.save();

        res.status(201).json({
          message: "Service created successfully",
          data: trimmedName,
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
        const { garageId, index } = req.params; // Use index instead of id
        const { name } = req.body;

        const garage = await Garage.findOne({ _id: garageId });
        if (!garage) {
          return res.status(404).json({ message: "Garage not found" });
        }

        const idx = parseInt(index);
        if (isNaN(idx) || idx < 0 || idx >= garage.services.length) {
          return res.status(404).json({ message: "Service not found" });
        }

        const trimmedName = name.trim();
        if (garage.services.includes(trimmedName) && garage.services[idx] !== trimmedName) {
          return res.status(400).json({ message: "Service name already exists" });
        }

        garage.services[idx] = trimmedName;
        await garage.save();

        res.status(200).json({
          message: "Service updated successfully",
          data: trimmedName,
        });
      } catch (error) {
        res.status(500).json({ message: "Error updating service", error: error.message });
      }
    },
  ],

  deleteService: async (req, res) => {
    try {
      const { garageId, index } = req.params; // Use index instead of id

      const garage = await Garage.findOne({ _id: garageId });
      if (!garage) {
        return res.status(404).json({ message: "Garage not found" });
      }

      const idx = parseInt(index);
      if (isNaN(idx) || idx < 0 || idx >= garage.services.length) {
        return res.status(404).json({ message: "Service not found for deletion" });
      }

      garage.services.splice(idx, 1);
      await garage.save();

      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting service", error: error.message });
    }
  },
};

export default serviceController;