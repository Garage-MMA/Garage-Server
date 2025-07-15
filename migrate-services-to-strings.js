import mongoose from 'mongoose';
import Garage from './src/models/garage.model.js'; // Added /src/
import connectDB from './src/config/mongodb.js'; // Added /src/

const migrateServices = async () => {
  try {
    await connectDB(); // Kết nối DB

    const garages = await Garage.find({});

    for (let garage of garages) {
      // Chuyển array objects sang array strings (chỉ name)
      const newServices = garage.services.map(s => (typeof s === 'object' ? s.name : s)).filter(name => name);

      garage.services = newServices;
      await garage.save();
    }

    console.log('Migration to string services completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateServices();