import express, { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { ApiResponse } from '../models/api-response.model';
import { PropertyDetailModel } from '../models/property/property-detail.model';
import { PropertyListModel } from '../models/property/property-list.model';

const router: Router = express.Router();

router.get('/latest', async (req, res) => {
    const result: ApiResponse<PropertyListModel[]> = await PropertyController.getLatest();

    res.status(result.statusCode).json({
        data: result.data
    });
});

router.get('/:id', async (req, res) => {
    const result: ApiResponse<PropertyDetailModel> = await PropertyController.getById(req.params.id);

    res.status(result.statusCode).json({
        data: result.data
    });
});

export default router;
