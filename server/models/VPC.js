const mongoose = require('mongoose');

const vpcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cidrBlock: {
    type: String,
    required: true,
    match: [/^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/, 'Invalid CIDR block format']
  },
  region: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'available', 'deleting'],
    default: 'pending'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VPC', vpcSchema);

