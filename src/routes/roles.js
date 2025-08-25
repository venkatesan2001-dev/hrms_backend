import express from "express";
import Role from "../models/Role.js";

const router = express.Router();

// List with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", isActive = "" } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (isActive !== "") query.isActive = isActive === "true";
    const options = { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 } };
    const result = await Role.paginate(query, options);
    res.json({ success: true, data: result.docs, pagination: { ...result, docs: undefined } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const role = await Role.create({ name: req.body.name, description: req.body.description, isActive: true });
    res.status(201).json({ success: true, data: role });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: role });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

export default router;


