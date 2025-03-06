import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Property } from '../database/models/property.model';
import { PropertyDetailModel } from '../models/property/property-detail.model';
import { PropertyListModel } from '../models/property/property-list.model';

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
        images: property.images.map(image => image.url),
        reviews: property.reviews.map(review => {
            return {
                rating: review.rating,
                text: review.text,
                createdAt: review.createdAt,
                user: {
                    firstName: (review.user as any).firstName,
                    lastName: (review.user as any).lastName,
                    email: (review.user as any).email,
                    avatar: (review.user as any).avatar
                }
            };
        }),
        facilities: property.facilities.map(facility => {
            return {
                title: (facility as any).title,
                type: (facility as any).facility_type
            };
        }),
        agent: {
            firstName: (property.agent as any).firstName,
            lastName: (property.agent as any).lastName,
            email: (property.agent as any).email,
            avatar: (property.agent as any).avatar
        }
    };

    res.status(200).json({
        success: true,
        data: mappedProperty
    });
};

export const PropertyController = {
    getLatest,
    getById
};
