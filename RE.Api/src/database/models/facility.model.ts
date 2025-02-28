import mongoose, { Document } from "mongoose";

interface IFacility extends Document {
    facility_type: "Laundry" | "Parking" | "Sports-Center" | "Cutlery" | "Gym" | "Swimming-pool" | "Wifi" | "Pet-Friendly";
    title: string;
}

const FacilitySchema = new mongoose.Schema<IFacility>({
    facility_type: {
        type: mongoose.Schema.Types.String,
        enum: ["Laundry", "Parking", "Sports-Center", "Cutlery", "Gym", "Swimming-pool", "Wifi", "Pet-Friendly"],
        required: true
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 50,
    }
});

FacilitySchema.pre<IFacility>('save', async function (next) {
    switch (this.facility_type) {
        case "Laundry":
            this.title = "Laundry";
            break;
        case "Parking":
            this.title = "Parking";
            break;
        case "Sports-Center":
            this.title = "Sports Center";
            break;
        case "Cutlery":
            this.title = "Cutlery";
            break;
        case "Gym":
            this.title = "Gym";
            break;
        case "Swimming-pool":
            this.title = "Swimming pool";
            break;
        case "Wifi":
            this.title = "Wifi";
            break;
        case "Pet-Friendly":
            this.title = "Pet-Friendly";
            break;
        default:
            break;
    }
});


const Facility = mongoose.model<IFacility>('Facility', FacilitySchema);

export { IFacility, Facility };

