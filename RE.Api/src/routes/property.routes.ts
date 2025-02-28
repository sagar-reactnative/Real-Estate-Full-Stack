import express, { Router } from "express";
import { PropertyController } from "../controllers/property.controller";
import { ApiResponse } from "../models/api-response.model";
import { PropertyDetailModel } from "../models/property/property-detail.model";

const router: Router = express.Router();

router.get("/:id", async (req, res) => {
    const result: ApiResponse<PropertyDetailModel> = await PropertyController.getById(req.params.id);

    res.status(result.statusCode).json({
        data: result.data
    });
});

export default router;