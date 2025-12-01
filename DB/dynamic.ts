import mongoose from "mongoose";

const dynamicEventSchema = new mongoose.Schema({
  podName: { type: String, required: true },
  namespace: { type: String, required: true },
  eventTime: { type: Date, default: Date.now },
  rule: { type: String, required: true },
  output: { type: String },
  priority: { type: String },
  fields: { type: mongoose.Schema.Types.Mixed },
});

export const DynamicEvent = mongoose.model("KuberDynamicScan", dynamicEventSchema);