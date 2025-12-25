import axios from 'axios';
import Snapshot from '../models/snapshot.js';

const getSurface = async (req, res) => {
  const { ticker, riskFreeRate = 0.05 } = req.query;
  let engineUrl = process.env.PYTHON_ENGINE_URL || 'http://127.0.0.1:8000';
  if (!engineUrl.startsWith('http')) {
    engineUrl = `http://${engineUrl}`;
  }

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker required' });
  }

  try {
    console.log(`Connecting to Python Engine at: ${engineUrl}/calculate/${ticker}`);
    
    const response = await axios.get(`${engineUrl}/calculate/${ticker}`, {
      params: { risk_free_rate: riskFreeRate }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Engine error details:', error.message);
    res.status(500).json({ error: 'Failed to calculate surface' });
  }
};

const saveSnapshot = async (req, res) => {
  try {
    const snapshot = new Snapshot(req.body);
    await snapshot.save();
    res.json({ success: true, id: snapshot._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save snapshot' });
  }
};

const getSnapshots = async (req, res) => {
  try {
    const snapshots = await Snapshot.find().sort({ timestamp: -1 }).limit(20);
    res.json(snapshots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snapshots' });
  }
};

export default { getSurface, saveSnapshot, getSnapshots };