import mongoose, { Document } from 'mongoose';

interface ICategory extends Document {
    title: 'House' | 'Condos' | 'Duplexes' | 'Studios' | 'Villa' | 'Apartments' | 'Townhomes' | 'Others';
}

const CategorySchema = new mongoose.Schema<ICategory>({
    title: {
        type: mongoose.Schema.Types.String,
        enum: ['House', 'Condos', 'Duplexes', 'Studios', 'Villa', 'Apartments', 'Townhomes', 'Others'],
        required: true
    }
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export { ICategory, Category };
