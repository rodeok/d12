import mongoose from 'mongoose';

const renovationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // e.g., 'fencing', 'repainting', 'roofing'
  },
  description: String,
  cost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  documents: [String], // UploadThing URLs
});

const propertySchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  landDocuments: [String], // UploadThing URLs
  propertyImages: [String], // UploadThing URLs
  popularPlaces: [{
    name: String,
    type: String, // 'filling_station', 'school', 'hospital', etc.
    distance: String, // e.g., '500m', '1.2km'
  }],
  renovations: [renovationSchema],
  totalRenovationCost: {
    type: Number,
    default: 0,
  },
  purchasePrice: Number,
  estimatedValue: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total renovation cost before saving
propertySchema.pre('save', function(next) {
  if (this.renovations && this.renovations.length > 0) {
    this.totalRenovationCost = this.renovations.reduce((total, renovation) => {
      return total + renovation.cost;
    }, 0);
  }
  next();
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);