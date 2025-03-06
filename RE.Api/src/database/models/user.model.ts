import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    role: 'user' | 'agent';
    avatar: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        minlength: 2,
        maxLength: 50
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxLength: 50
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        lowercase: true,
        maxLength: 100
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxLength: 500
    },
    role: {
        type: mongoose.Schema.Types.String,
        required: true,
        enum: ['user', 'agent']
    },
    avatar: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    }
});

UserSchema.pre<IUser>('save', async function (next) {
    try {
        const salt: string = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error: any) {
        next(error);
    }
});

const User = mongoose.model<IUser>('User', UserSchema);

export { IUser, User };
