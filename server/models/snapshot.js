import mongoose from 'mongoose';

const snapshotSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  spotPrice: Number,
  surfaceData: {
    x: [Number],
    y: [Number],
    z: [[Number]]
  },
  arbitrageOpportunities: [Object]
});

export default mongoose.model('Snapshot', snapshotSchema);