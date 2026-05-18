import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost", "Converted"],
      default: "New"
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral", "Email", "Social", "Other"],
      default: "Website"
    },
    assignedTo: { type: String, trim: true, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    statusHistory: [
      {
        status: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", leadSchema);