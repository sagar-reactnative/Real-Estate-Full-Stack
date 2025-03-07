import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Property } from '../database/models/property.model';
import { PropertyDetailModel } from '../models/property/property-detail.model';
import { PropertyListModel } from '../models/property/property-list.model';
import { AgentDetailModel } from '../models/agent/agent-detail.model';
import { Category } from '../database/models/category.model';

const getAll = async (req: Request, res: Response) => {
    const limit: number = Number(req.query.limit) ?? 10;

    const filterQuery: any = {};
    if (req.query.category && req.query.category != 'All') {
        filterQuery.category = await Category.findOne({ title: req.query.category }).select('_id');
    }

    if (req.query.query) {
        filterQuery.$or = [
            { title: { $regex: req.query.query, $options: 'i' } },
            { address: { $regex: req.query.query, $options: 'i' } },
            { description: { $regex: req.query.query, $options: 'i' } }
        ];
    }

    const properties = await Property.find(filterQuery).populate('reviews').populate('category').sort({ createdAt: -1 }).limit(limit);

    const mappedProperties: PropertyListModel[] = properties.map(property => {
        const images: string[] = property.images.map(image => image.url);

        const mappedProperty: PropertyListModel = {
            id: property.id,
            title: property.title,
            address: property.address,
            imageUrl: images.length > 0 ? images[0] : null,
            price: property.price,
            averageRating: property.reviews.reduce((sum, item) => sum + item.rating, 0) / property.reviews.length
        };

        return mappedProperty;
    });

    res.status(200).json({
        success: true,
        data: mappedProperties
    });
};

const getLatest = async (req: Request, res: Response) => {
    const properties = await Property.find().populate('reviews').sort({ createdAt: -1 }).limit(5);

    const mappedProperties: PropertyListModel[] = properties.map(property => {
        const images: string[] = property.images.map(image => image.url);

        const mappedProperty: PropertyListModel = {
            id: property.id,
            title: property.title,
            address: property.address,
            imageUrl: images.length > 0 ? images[0] : null,
            price: property.price,
            averageRating: property.reviews.reduce((sum, item) => sum + item.rating, 0) / property.reviews.length
        };

        return mappedProperty;
    });

    res.status(200).json({
        success: true,
        data: mappedProperties
    });
};

const getById = async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        res.status(400).json({
            success: false,
            errorMessages: ['Invalid property ID.']
        });

        return;
    }

    const property = await Property.findById(propertyId)
        .populate('agent', 'firstName lastName email avatar')
        .populate('category', 'id title')
        .populate('reviews.user')
        .populate('facilities', 'facility_type title');

    if (!property) {
        res.status(404).json({
            success: false,
            errorMessages: ['Property not found.']
        });

        return;
    }

    const mappedProperty: PropertyDetailModel = {
        id: property.id,
        title: property.title,
        description: property.description,
        address: property.address,
        averageRating: property.reviews.reduce((sum, item) => sum + item.rating, 0) / property.reviews.length,
        sqft: property.sqft,
        beds: property.beds,
        baths: property.baths,
        images: property.images.map(image => {
            return {
                id: image.id,
                url: image.url
            };
        }),
        category: {
            id: (property.category as any).id,
            title: (property.category as any).title
        },
        reviews: property.reviews.map(review => {
            return {
                id: review.id,
                rating: review.rating,
                text: review.text,
                createdAt: review.createdAt,
                user: mapAgentObject(review.user)
            };
        }),
        facilities: property.facilities.map(facility => {
            return {
                id: (facility as any).id,
                title: (facility as any).title,
                type: (facility as any).facility_type
            };
        }),
        agent: mapAgentObject(property.agent)
    };

    res.status(200).json({
        success: true,
        data: mappedProperty
    });
};

const mapAgentObject = (agent: any): AgentDetailModel => {
    return {
        id: agent.id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        avatar: agent.avatar
    };
};

export const PropertyController = {
    getAll,
    getLatest,
    getById
};
