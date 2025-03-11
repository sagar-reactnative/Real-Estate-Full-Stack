import { AgentDetailModel } from '../agent/agent-detail.model';

export interface PropertyDetailModel {
    id: string;
    title: string;
    description: string;
    address: string;
    price: number;
    averageRating?: number;
    sqft: number;
    beds?: number;
    baths?: number;
    images: {
        id: string;
        url: string;
    }[];
    category: {
        id: string;
        title: string;
    };
    reviews: {
        id: string;
        rating: number;
        text?: string;
        createdAt: Date;
        user: AgentDetailModel;
    }[];
    facilities: {
        id: string;
        title: string;
        type: string;
    }[];
    agent: AgentDetailModel;
}
