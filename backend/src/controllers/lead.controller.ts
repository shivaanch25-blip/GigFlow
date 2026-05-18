import { Request, Response } from "express";
import { Lead } from "../models/lead.model";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost" | "Converted";
type LeadSource = "Website" | "Instagram" | "Referral" | "Email" | "Social" | "Other";

type AuthRequest = Request & {
  user?: {
    id: string;
    role: string;
    email: string;
  };
};

const allowedStatuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost", "Converted"];
const allowedSources: LeadSource[] = ["Website", "Instagram", "Referral", "Email", "Social", "Other"];

const isValidStatus = (value: unknown): value is LeadStatus =>
  typeof value === "string" && allowedStatuses.includes(value as LeadStatus);

const isValidSource = (value: unknown): value is LeadSource =>
  typeof value === "string" && allowedSources.includes(value as LeadSource);

const normalizeFilterValue = (value: unknown) => {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "All" || trimmed.length === 0 ? undefined : trimmed;
};
const buildQuery = (req: AuthRequest) => {
  const query: any = {};
  const status = normalizeFilterValue(req.query.status);
  const source = normalizeFilterValue(req.query.source);
  const search = normalizeFilterValue(req.query.search);
  if (status && isValidStatus(status)) query.status = status;
  if (source && isValidSource(source)) query.source = source;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }
  return query;
};
const enforceAccess = (lead: any, user?: AuthRequest["user"]) => {
  if (!lead || !user) return false;
  if (user.role === "admin") return true;
  return lead.createdBy?.toString() === user.id;
};
export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const { name, email, phone, status, source, assignedTo } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email, and phone are required." });
    }
    const normalizedStatus: LeadStatus =
      isValidStatus(status) ? status : "New";
    const normalizedSource: LeadSource =
      isValidSource(source) ? source : "Website";
    const lead = await Lead.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      status: normalizedStatus,
      source: normalizedSource,
      assignedTo: assignedTo ? String(assignedTo).trim() : "",
      createdBy: user.id,
      statusHistory: [{ status: normalizedStatus, date: new Date() }]
    });
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to create lead." });
  }
};
export const getAllLeads = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const query = buildQuery(req);
    if (user.role !== "admin") {
      query.createdBy = user.id;
    }
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const sortField = String(req.query.sort || "new").toLowerCase();
    const sortOption: { createdAt: 1 | -1 } = sortField === "old" || sortField === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    const [total, leads] = await Promise.all([
      Lead.countDocuments(query),
      Lead.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
    ]);
    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      data: leads
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to retrieve leads." });
  }
};
export const getLeadById = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead || !enforceAccess(lead, user)) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to retrieve lead." });
  }
};
export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead || !enforceAccess(lead, user)) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }
    const { name, email, phone, status, source, assignedTo } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email, and phone are required." });
    }
    const normalizedStatus: LeadStatus =
      isValidStatus(status) ? status : lead.status;
    const normalizedSource: LeadSource =
      isValidSource(source) ? source : lead.source;
    if (normalizedStatus !== lead.status) {
      lead.statusHistory.push({ status: normalizedStatus, date: new Date() });
    }
    lead.name = name.trim();
    lead.email = email.toLowerCase().trim();
    lead.phone = phone.trim();
    lead.status = normalizedStatus;
    lead.source = normalizedSource;
    lead.assignedTo = assignedTo ? String(assignedTo).trim() : lead.assignedTo;
    await lead.save();
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to update lead." });
  }
};
export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead || !enforceAccess(lead, user)) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }
    await lead.deleteOne();
    res.json({ success: true, message: "Lead deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to delete lead." });
  }
};
export const exportLeads = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const query = buildQuery(req);
    if (user.role !== "admin") {
      query.createdBy = user.id;
    }
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    const header = ["Name", "Email", "Phone", "Status", "Source", "Assigned To", "Created At", "Updated At"].join(",");
    const rows = leads.map((lead) => {
      const values = [
        lead.name,
        lead.email,
        lead.phone,
        lead.status,
        lead.source,
        lead.assignedTo || "",
        lead.createdAt?.toISOString() ?? "",
        lead.updatedAt?.toISOString() ?? ""
      ];
      return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.send([header, ...rows].join("\n"));
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to export leads." });
  }
};
export const getLeadSummary = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
    const query = buildQuery(req);
    if (user.role !== "admin") {
      query.createdBy = user.id;
    }
    const total = await Lead.countDocuments(query);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await Lead.countDocuments({
      ...query,
      createdAt: { $gte: today }
    });
    const statusCountsRaw = await Lead.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const summary = statusCountsRaw.reduce<Record<string, number>>((acc, entry) => {
      acc[entry._id] = entry.count;
      return acc;
    }, {});
    res.json({
      success: true,
      data: {
        total,
        newToday,
        statusCounts: summary
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to retrieve dashboard summary." });
  }
};
