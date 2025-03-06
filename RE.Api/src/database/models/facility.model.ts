import mongoose, { Document } from 'mongoose';

interface IFacility extends Document {
    facility_type: 'Laundry' | 'Parking' | 'Sports-Center' | 'Cutlery' | 'Gym' | 'Swimming-pool' | 'Wifi' | 'Pet-Friendly';
    title: string;
}

const FacilitySchema = new mongoose.Schema<IFacility>({
    facility_type: {
        type: mongoose.Schema.Types.String,
        enum: ['Laundry', 'Parking', 'Sports-Center', 'Cutlery', 'Gym', 'Swimming-pool', 'Wifi', 'Pet-Friendly'],
        required: true
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 50
    }
});

FacilitySchema.pre<IFacility>('validate', async function (next) {
    const titles: Record<string, string> = {
        Laundry: 'Laundry',
        Parking: 'Parking',
        'Sports-Center': 'Sports Center',
        Cutlery: 'Cutlery',
        Gym: 'Gym',
        'Swimming-pool': 'Swimming Pool',
        Wifi: 'Wifi',
        'Pet-Friendly': 'Pet-Friendly'
    };

    this.title = titles[this.facility_type] || this.facility_type;

    next();
});

const Facility = mongoose.model<IFacility>('Facility', FacilitySchema);

export { IFacility, Facility };
