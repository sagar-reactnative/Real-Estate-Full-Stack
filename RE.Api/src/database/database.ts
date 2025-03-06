import mongoose from 'mongoose';
import moment from 'moment/moment';
import { MONGO_DB_URI } from '../config/env';
import { ConsoleHelpers } from '../helpers/console-helpers';
import { User } from './models/user.model';
import { Facility } from './models/facility.model';
import { Property } from './models/property.model';

const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_DB_URI!);
        ConsoleHelpers.logMessage('Database', 'MongoDB connected');

        await User.createCollection();
        await Facility.createCollection();
        await Property.createCollection();

        ConsoleHelpers.logMessage('Database', 'Collections Created');
    } catch (err: any) {
        ConsoleHelpers.logErrorMessage('Database', 'MongoDB connection error - ' + err.message);
        process.exit(1);
    }
};

const seedDatabase = async (): Promise<void> => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Facility.deleteMany();
        await Property.deleteMany();

        // Seed Users
        const users = await User.create([
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'test',
                role: 'agent',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                password: 'test',
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            {
                firstName: 'Alice',
                lastName: 'Brown',
                email: 'alice.brown@example.com',
                password: 'test',
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            {
                firstName: 'Bob',
                lastName: 'Miller',
                email: 'bob.miller@example.com',
                password: 'test',
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            {
                firstName: 'Charlie',
                lastName: 'Davis',
                email: 'charlie.davis@example.com',
                password: 'test',
                role: 'agent',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
            },
            {
                firstName: 'Diana',
                lastName: 'Wilson',
                email: 'diana.wilson@example.com',
                password: 'test',
                role: 'agent',
                avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            {
                firstName: 'Edward',
                lastName: 'Thomas',
                email: 'edward.thomas@example.com',
                password: 'test',
                role: 'agent',
                avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
            }
        ]);

        // Seed Facilities
        const facilities = await Facility.create([
            { facility_type: 'Laundry' },
            { facility_type: 'Parking' },
            { facility_type: 'Gym' },
            { facility_type: 'Swimming-pool' },
            { facility_type: 'Wifi' },
            { facility_type: 'Pet-Friendly' }
        ]);

        // Seed Properties
        const propertiesData = [];
        for (let i = 1; i <= 10; i++) {
            propertiesData.push({
                title: `Property ${i}`,
                description: `Beautiful property ${i} with modern amenities and a great location.`,
                sqft: 1000 + i * 100,
                beds: (i % 3) + 1,
                baths: (i % 2) + 1,
                images: [{ url: `https://source.unsplash.com/400x300/?house,${i}` }],
                reviews: [
                    {
                        rating: (i % 5) + 1,
                        text: `Great property! Highly recommended.`,
                        createdAt: moment().subtract(i, 'days').toDate(),
                        user: users[i % 3]._id
                    },
                    {
                        rating: ((i + 1) % 5) + 1,
                        text: `Good experience, would stay again.`,
                        createdAt: moment()
                            .subtract(i * 2, 'days')
                            .toDate(),
                        user: users[(i + 1) % 3]._id
                    }
                ],
                facilities: facilities.slice(0, (i % facilities.length) + 1).map(facility => facility._id),
                agent: users[(i % 4) + 3]._id
            });
        }

        await Property.create(propertiesData);

        ConsoleHelpers.logSuccessMessage('Database', 'Database seeding completed successfully.');
    } catch (error: any) {
        ConsoleHelpers.logErrorMessage('Database', 'Error seeding database - ' + error.message);
        process.exit(1);
    }
};

export { connectDatabase, seedDatabase };
