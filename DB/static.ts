import mongoose from "npm:mongoose@8.0.0";

const vulnerabilitySchema = new mongoose.Schema({
  VulnerabilityID: String,
  PkgName: String,
  PkgID: String,
  FixedVersion: String,
  PrimaryURL: String,
  Title: String,
  Description: String,
  CweIDs: [String],
});

const KuberScanSchema = new mongoose.Schema({
  ScanID : { type: String, required: true },
  image: { type: String, required: true },
  Vulnerability: [vulnerabilitySchema],
  status: { type: String, default: "pending" },
});



export const KuberScan = mongoose.model("KuberStaticScan", KuberScanSchema);
