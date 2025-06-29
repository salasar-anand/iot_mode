import express from 'express';
import {
  createParameter,
  getAllParameters,
  getParameterById,
  updateParameter,
  deleteParameter,
} from '../controllers/parameterController.js';

const router = express.Router();

router.post('/parameter', createParameter);
router.get('/parameter', getAllParameters);
router.get('/parameter/:id', getParameterById);
router.post('/parameter/update/:id', updateParameter);
router.post('/parameter/delete/:id', deleteParameter);

export default router;
