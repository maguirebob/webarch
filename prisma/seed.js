"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sampleUsers = [
    {
        id: 'user1',
        email: 'john@example.com',
        passwordHash: 'hashed_password_1',
        firstName: 'John',
        lastName: 'Doe',
    },
    {
        id: 'user2',
        email: 'jane@example.com',
        passwordHash: 'hashed_password_2',
        firstName: 'Jane',
        lastName: 'Smith',
    },
    {
        id: 'user3',
        email: 'bob@example.com',
        passwordHash: 'hashed_password_3',
        firstName: 'Bob',
        lastName: 'Johnson',
    },
    {
        id: 'user4',
        email: 'alice@example.com',
        passwordHash: 'hashed_password_4',
        firstName: 'Alice',
        lastName: 'Brown',
    },
    {
        id: 'user5',
        email: 'charlie@example.com',
        passwordHash: 'hashed_password_5',
        firstName: 'Charlie',
        lastName: 'Wilson',
    },
    {
        id: 'user6',
        email: 'diana@example.com',
        passwordHash: 'hashed_password_6',
        firstName: 'Diana',
        lastName: 'Davis',
    },
];
const sampleEvents = [
    {
        id: '1',
        userId: 'user1',
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year with speakers from top companies. Learn about the latest trends in AI, web development, and cloud computing.',
        eventDate: new Date('2024-03-15'),
        eventTime: new Date('2024-03-15T09:00:00'),
        location: 'Convention Center, Downtown',
        category: 'Technology',
        isPublic: true,
    },
    {
        id: '2',
        userId: 'user2',
        title: 'Music Festival',
        description: 'A weekend of amazing music with local and international artists. Featuring rock, pop, jazz, and electronic music performances.',
        eventDate: new Date('2024-04-20'),
        eventTime: new Date('2024-04-20T18:00:00'),
        location: 'Central Park',
        category: 'Music',
        isPublic: true,
    },
    {
        id: '3',
        userId: 'user3',
        title: 'Art Exhibition Opening',
        description: 'Contemporary art exhibition featuring works from emerging artists. Explore modern interpretations of traditional themes.',
        eventDate: new Date('2024-02-28'),
        eventTime: new Date('2024-02-28T19:00:00'),
        location: 'Modern Art Gallery',
        category: 'Art',
        isPublic: true,
    },
    {
        id: '4',
        userId: 'user4',
        title: 'Startup Pitch Competition',
        description: 'Watch innovative startups pitch their ideas to a panel of investors. Great networking opportunity for entrepreneurs.',
        eventDate: new Date('2024-05-10'),
        eventTime: new Date('2024-05-10T14:00:00'),
        location: 'Innovation Hub',
        category: 'Business',
        isPublic: true,
    },
    {
        id: '5',
        userId: 'user5',
        title: 'Cooking Workshop',
        description: 'Learn to cook authentic Italian cuisine with our professional chef. All skill levels welcome.',
        eventDate: new Date('2024-06-05'),
        eventTime: new Date('2024-06-05T10:00:00'),
        location: 'Culinary School',
        category: 'Food & Drink',
        isPublic: true,
    },
    {
        id: '6',
        userId: 'user6',
        title: 'Yoga Retreat',
        description: 'A peaceful weekend retreat focusing on mindfulness, meditation, and yoga practices in nature.',
        eventDate: new Date('2024-07-15'),
        eventTime: new Date('2024-07-15T08:00:00'),
        location: 'Mountain Resort',
        category: 'Health & Wellness',
        isPublic: true,
    },
];
async function main() {
    console.log('🌱 Starting database seeding...');
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Cleared existing data');
    for (const userData of sampleUsers) {
        const user = await prisma.user.create({
            data: userData,
        });
        console.log(`✅ Created user: ${user.firstName} ${user.lastName}`);
    }
    for (const eventData of sampleEvents) {
        const event = await prisma.event.create({
            data: eventData,
        });
        console.log(`✅ Created event: ${event.title}`);
    }
    console.log('🎉 Database seeding completed!');
    console.log(`📊 Created ${sampleUsers.length} users and ${sampleEvents.length} events`);
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map