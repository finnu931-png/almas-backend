const Service = require('../models/Service');

class ServiceService {
  async getAll(filters = {}) {
    try {
      console.log('ServiceService: Fetching all services with filters:', filters);
      
      const query = {};
      if (filters.category) query.category = filters.category;
      if (filters.status !== undefined) query.isActive = filters.status === 'active';
      
      const services = await Service.find(query).sort({ order: 1, createdAt: -1 });
      
      console.log(`ServiceService: Found ${services.length} services`);
      return services;
    } catch (error) {
      console.error('ServiceService: Error fetching services:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      console.log('ServiceService: Fetching service by ID:', id);
      
      const service = await Service.findById(id);
      if (!service) {
        throw new Error('Service not found');
      }
      
      console.log('ServiceService: Service found');
      return service;
    } catch (error) {
      console.error('ServiceService: Error fetching service:', error);
      throw error;
    }
  }

  async create(serviceData) {
    try {
      console.log('ServiceService: Creating new service');
      
      const service = new Service(serviceData);
      const savedService = await service.save();
      
      console.log('ServiceService: Service created successfully:', savedService._id);
      return savedService;
    } catch (error) {
      console.error('ServiceService: Error creating service:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      console.log('ServiceService: Updating service:', id);
      
      const service = await Service.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
      
      if (!service) {
        throw new Error('Service not found');
      }
      
      console.log('ServiceService: Service updated successfully');
      return service;
    } catch (error) {
      console.error('ServiceService: Error updating service:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log('ServiceService: Deleting service:', id);
      
      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        throw new Error('Service not found');
      }
      
      console.log('ServiceService: Service deleted successfully');
      return service;
    } catch (error) {
      console.error('ServiceService: Error deleting service:', error);
      throw error;
    }
  }
}

module.exports = new ServiceService();