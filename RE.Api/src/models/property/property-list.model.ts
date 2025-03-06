export interface PropertyListModel {
    id: string;
    title: string;
    price: number;
    address: string;
    imageUrl: string | null;
    averageRating?: number;
}
