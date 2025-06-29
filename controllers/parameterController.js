import Parameter from '../models/parameterModel.js';
import { sendResponse } from '../utils/Helper.js';

// Create new parameter entry
export const createParameter = async (req, res) => {
  try {
    const parameter = new Parameter(req.body);
    await parameter.save();
    sendResponse(res, true, 'Parameter created successfully.', parameter);
  } catch (err) {
    sendResponse(res, false, 'Failed to create parameter.', null, err.message);
  }
};

// Get all parameters
export const getAllParameters = async (req, res) => {
  try {
    const parameters = await Parameter.find().sort({ createdAt: -1 });
    sendResponse(res, true, 'Parameters fetched successfully.', parameters);
  } catch (err) {
    sendResponse(res, false, 'Failed to fetch parameters.', null, err.message);
  }
};

// Get parameter by ID
export const getParameterById = async (req, res) => {
  try {
    const parameter = await Parameter.findById(req.params.id);
    if (!parameter) return sendResponse(res, false, 'Parameter not found.');
    sendResponse(res, true, 'Parameter fetched successfully.', parameter);
  } catch (err) {
    sendResponse(res, false, 'Error fetching parameter.', null, err.message);
  }
};

// Update parameter
export const updateParameter = async (req, res) => {
  try {
    const updated = await Parameter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, 'Parameter not found.');
    sendResponse(res, true, 'Parameter updated successfully.', updated);
  } catch (err) {
    sendResponse(res, false, 'Failed to update parameter.', null, err.message);
  }
};

// Delete parameter
export const deleteParameter = async (req, res) => {
  try {
    const deleted = await Parameter.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, 'Parameter not found.');
    sendResponse(res, true, 'Parameter deleted successfully.');
  } catch (err) {
    sendResponse(res, false, 'Failed to delete parameter.', null, err.message);
  }
};
