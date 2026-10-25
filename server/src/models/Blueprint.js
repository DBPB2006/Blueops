const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  version: {
    type: Number,
    default: 1
  },
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  graph: {
    nodes: {
      type: Array,
      default: []
    },
    edges: {
      type: Array,
      default: []
    },
    viewport: {
      type: Object,
      default: { x: 0, y: 0, zoom: 1 }
    }
  },
  analysis: {
    type: Object,
    default: {}
  },
  deploymentIntent: {
    type: Object,
    default: {}
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blueprint', blueprintSchema);
