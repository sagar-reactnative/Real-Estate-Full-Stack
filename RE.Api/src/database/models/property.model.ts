import mongoose, { Document } from "mongoose";
import moment from "moment/moment";

interface IImage extends Document{
    url: string;
}
const ImageSchema = new mongoose.Schema<IImage>({
    url: { type: String, required: true }
});

interface IReview extends Document {
    rating: number;
    text?: string;
    createdAt: Date;
    user: mongoose.Schema.Types.ObjectId;
}
const ReviewSchema = new mongoose.Schema<IReview>({
    rating : {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: mongoose.Schema.Types.String,
        required: false,
        trim: true,
        minLength: 5,
        maxLength: 500
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: moment().utc()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

interface IProperty extends Document {
    title: string;
    description: string;
    address: string;
    sqft: number;
    beds?: number;
    baths?: number;
    price: number;
    images: IImage[];
    reviews: IReview[];
    facilities: mongoose.Schema.Types.ObjectId[];
    agent: mongoose.Schema.Types.ObjectId;
}
const PropertySchema = new mongoose.Schema<IProperty>({
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 1000
    },
    address: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    sqft: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    beds: {
        type: mongoose.Schema.Types.Number,
        required: false
    },
    baths: {
        type: mongoose.Schema.Types.Number,
        required: false
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    images: [ ImageSchema ],
    reviews: [ ReviewSchema ],
    facilities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Facility'
        }
    ],
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Property = mongoose.model<IProperty>('Property', PropertySchema);

export { IImage, IReview, IProperty, Property };
