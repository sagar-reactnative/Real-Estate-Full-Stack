import mongoose from "mongoose";
import { Property } from "../database/models/property.model";
import { ApiResponse } from "../models/api-response.model";
import { PropertyDetailModel } from "../models/property/property-detail.model";
import { PropertyListModel } from "../models/property/property-list.model";

const getLatest = async (): Promise<ApiResponse<PropertyListModel[]>> => {
    const properties = await Property.find()
        .sort({ createdAt: -1 })
        .limit(5);

    const mappedProperties: PropertyListModel[] = properties.map((property) => {
        const images: string[] = property.images.map(image => image.url);
        const mappedProperty: PropertyListModel = {
            title: property.title,
            address: property.address,
            imageUrl: images.length > 0 ? images[0] : null,
            price: property.price
        };

        return mappedProperty;
    });

    return {
        statusCode: 200,
        data: mappedProperties,
    };
}

const getById = async (propertyId: string): Promise<ApiResponse<PropertyDetailModel>> => {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        return {
            statusCode: 400,
            errorMessages: [ "Invalid property ID." ]
        };
    }

    const property = await Property.findById(propertyId)
        .populate("agent", "firstName lastName email avatar")
        .populate("reviews.user")
        .populate("facilities", "facility_type title");

    if (!property) {
        return {
            statusCode: 404,
            errorMessages: [ "Property not found." ]
        };
    }

    const mappedProperty: PropertyDetailModel = {
        title: property.title,
        description: property.description,
        address: property.address,
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
            }
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

    return {
        data: mappedProperty,
        statusCode: 200
    };
};

export const PropertyController = {
    getLatest,
    getById
}
