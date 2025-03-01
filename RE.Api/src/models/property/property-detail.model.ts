export interface PropertyDetailModel {
    title: string;
    description: string;
    address: string;
    sqft: number;
    beds?: number;
    baths?: number;
    images: string[];
    reviews: {
        rating: number;
        text?: string;
        createdAt: Date;
        user: {
            firstName: string;
            lastName: string;
            email: string;
            avatar: string;
        }
    }[];
    facilities: {
        title: string;
        type: string;
    }[],
    agent: {
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
    }
};
