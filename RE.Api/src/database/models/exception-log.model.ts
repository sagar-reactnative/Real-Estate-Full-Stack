import mongoose from 'mongoose';

interface IExceptionLog extends Document {
    message: string;
    method: string;
    url: string;
    timestamp: Date;
    stack?: string;
}

const ExceptionLogSchema = new mongoose.Schema<IExceptionLog>({
    message: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 500,
        trim: true
    },
    method: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 100,
        trim: true
    },
    url: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 500,
        trim: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    },
    stack: {
        type: mongoose.Schema.Types.String
    }
});

const ExceptionLog = mongoose.model<IExceptionLog>('ExceptionLog', ExceptionLogSchema);

export { IExceptionLog, ExceptionLog };
