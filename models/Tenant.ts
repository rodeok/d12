import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  rentStart: {
    type: Date,
    required: true,
  },
  rentEnd: {
    type: Date,
    required: true,
  },
  rentDuration: {
    type: String,
    required: true, // e.g., '12 months', '2 years'
  },
  lastPaymentDate: Date,
  nextPaymentDate: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  documents: [String], // UploadThing URLs (lease agreement, etc.)
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate next payment date before saving
tenantSchema.pre('save', function(next) {
  if (this.lastPaymentDate) {
    const nextPayment = new Date(this.lastPaymentDate);
    nextPayment.setMonth(nextPayment.getMonth() + 1);
    this.nextPaymentDate = nextPayment;
  }
  next();
});

export default mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);