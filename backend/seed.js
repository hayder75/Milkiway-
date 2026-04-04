require('dotenv').config();
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

function normalizePhone(phone) {
    if (!phone) return null;
    const cleaned = String(phone).replace(/[^\d]/g, '');
    return cleaned || null;
}

const initialSystems = [
    {
        title: 'E-Commerce Pro',
        description: 'Full-featured online store with payment integration',
        longDescription: 'A comprehensive e-commerce solution built for modern businesses. Includes inventory management, multiple payment gateways, customer analytics, and mobile-responsive design.',
        category: 'E-Commerce',
        price: 2499,
        commissionRate: 15,
        image: '/products/ecommerce.jpg',
        features: ['Payment Integration', 'Inventory Management', 'Customer Analytics', 'Mobile Responsive', 'SEO Optimized', 'Multi-language'],
        isActive: true
    },
    {
        title: 'CRM Enterprise',
        description: 'Customer relationship management system',
        longDescription: 'Powerful CRM software to manage leads, automate follow-ups, and analyze customer behavior across your full sales cycle.',
        category: 'Business',
        price: 1999,
        commissionRate: 12,
        image: '/products/crm.jpg',
        features: ['Lead Tracking', 'Auto Follow-ups', 'Sales Pipeline', 'Email Integration', 'Reporting', 'API Access'],
        isActive: true
    },
    {
        title: 'Inventory Pro',
        description: 'Real-time inventory tracking system',
        longDescription: 'Complete inventory management with barcode scanning, warehouse sync, reorder alerts, and reporting for growing operations.',
        category: 'Business',
        price: 1499,
        commissionRate: 10,
        image: '/products/inventory.jpg',
        features: ['Barcode Scanning', 'Real-time Tracking', 'Auto Reorder', 'Multi-warehouse', 'Reporting', 'Mobile App'],
        isActive: true
    },
    {
        title: 'Hotel Management',
        description: 'Complete hotel operations software',
        longDescription: 'All-in-one hospitality software covering reservations, front desk operations, housekeeping, billing, and online booking.',
        category: 'Hospitality',
        price: 3499,
        commissionRate: 18,
        image: '/products/hotel.jpg',
        features: ['Reservations', 'Check-in/out', 'Billing', 'Housekeeping', 'Restaurant Module', 'Online Booking'],
        isActive: true
    },
    {
        title: 'School Portal',
        description: 'Educational institution management system',
        longDescription: 'Comprehensive school management software for student records, attendance, grading, parent communication, and online learning.',
        category: 'Education',
        price: 1299,
        commissionRate: 10,
        image: '/products/school.jpg',
        features: ['Student Info', 'Attendance', 'Grading', 'Parent Portal', 'Fee Management', 'Online Classes'],
        isActive: true
    },
    {
        title: 'Restaurant POS',
        description: 'Point of sale for restaurants',
        longDescription: 'Modern restaurant POS with table management, kitchen display, delivery integration, and revenue analytics.',
        category: 'Retail',
        price: 999,
        commissionRate: 12,
        image: '/products/restaurant.jpg',
        features: ['Table Management', 'Kitchen Display', 'Inventory', 'Delivery Integration', 'Analytics', 'Mobile Ordering'],
        isActive: true
    },
    {
        title: 'Education System',
        description: 'Transform schools and universities with comprehensive management, student portals, and grading solutions.',
        longDescription: 'A scalable education platform for institutions that need admissions, learning portals, grading, attendance, and finance workflows in one place.',
        category: 'Education',
        price: 5000,
        commissionRate: 14,
        features: ['Student Management', 'Grade Tracking', 'Online Learning Portal', 'Attendance System', 'Fee Management'],
        isActive: true
    },
    {
        title: 'Medical System',
        description: 'Streamline healthcare facilities with patient records, appointment scheduling, and automated billing.',
        longDescription: 'A healthcare operations suite for clinics and hospitals with patient records, scheduling, insurance integration, and invoicing.',
        category: 'Healthcare',
        price: 8000,
        commissionRate: 20,
        features: ['Patient Records', 'Appointment Scheduling', 'Billing & Invoicing', 'Pharmacy Management', 'Insurance Integration'],
        isActive: true
    },
    {
        title: 'Performance Management',
        description: 'Track, evaluate, and elevate employee performance metrics through continuous feedback.',
        longDescription: 'Performance management tools for HR teams to manage goals, reviews, KPIs, and people development across the organization.',
        category: 'Business',
        price: 3500,
        commissionRate: 16,
        features: ['Goal Setting', '360 Reviews', 'KPIs Tracking', 'Performance Reports', 'Employee Directory'],
        isActive: true
    },
    {
        title: 'Stock Management',
        description: 'Optimized inventory tracking, predictive reordering, and advanced supply chain management.',
        longDescription: 'A stock and supply chain platform designed for teams that need smart replenishment, warehouse visibility, and supplier coordination.',
        category: 'Business',
        price: 4500,
        commissionRate: 17,
        features: ['Real-time Tracking', 'Barcode Integration', 'Auto Reorder Alerts', 'Supplier Management', 'Reports & Analytics'],
        isActive: true
    }
];

const initialPortfolios = [
    {
        title: 'TechVenture Store',
        client: 'TechVenture Inc',
        category: 'E-Commerce',
        description: 'Custom online store with payment integration and inventory management for a tech startup.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80'],
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        size: 'large',
        services: ['Web Development', 'UI/UX Design', 'Payment Integration'],
        tags: ['ecommerce', 'startup', 'tech']
    },
    {
        title: 'GreenLeaf Hotel Website',
        client: 'GreenLeaf Hotels',
        category: 'Hospitality',
        description: 'Luxury hotel website with online booking, virtual tours, and restaurant reservation system.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'],
        video: null,
        size: 'medium',
        services: ['Web Development', 'Booking System', 'Photography'],
        tags: ['hotel', 'hospitality', 'booking']
    },
    {
        title: 'EduCore Platform',
        client: 'EduCore Academy',
        category: 'Education',
        description: 'Complete online learning management system with video courses, quizzes, and student progress tracking.',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'],
        video: 'https://www.youtube.com/watch?v=example',
        size: 'large',
        services: ['Web Development', 'LMS Integration', 'Video Streaming'],
        tags: ['education', 'lms', 'elearning']
    },
    {
        title: 'FreshMart POS',
        client: 'FreshMart Supermarkets',
        category: 'Retail',
        description: 'Point of sale system for supermarket chain with barcode scanning and inventory sync.',
        image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80'],
        video: null,
        size: 'medium',
        services: ['Software Development', 'Hardware Integration', 'Staff Training'],
        tags: ['retail', 'pos', 'inventory']
    },
    {
        title: 'MedCare Clinic System',
        client: 'MedCare Clinics',
        category: 'Healthcare',
        description: 'Patient management system with appointment scheduling, billing, and medical records.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'],
        video: null,
        size: 'medium',
        services: ['Software Development', 'HIPAA Compliance', 'Data Migration'],
        tags: ['healthcare', 'medical', 'emr']
    },
    {
        title: 'CraveFood Restaurant App',
        client: 'CraveFood Chain',
        category: 'Retail',
        description: 'Mobile ordering app and kitchen display system for restaurant chain.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80'],
        video: 'https://www.youtube.com/watch?v=example2',
        size: 'medium',
        services: ['Mobile App Development', 'Kitchen Display', 'Delivery Integration'],
        tags: ['restaurant', 'mobile', 'pos']
    },
    {
        title: 'FitTrack Gym Management',
        client: 'FitTrack Fitness Centers',
        category: 'Business',
        description: 'Gym management software with member tracking, class scheduling, and payment processing.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'],
        video: null,
        size: 'small',
        services: ['Web Development', 'Mobile App', 'Payment Integration'],
        tags: ['fitness', 'gym', 'membership']
    },
    {
        title: 'AutoPro Dealership',
        client: 'AutoPro Motors',
        category: 'Business',
        description: 'Car dealership management system with inventory, customer CRM, and financing tools.',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'],
        video: null,
        size: 'large',
        services: ['Software Development', 'CRM', 'Inventory Management'],
        tags: ['automotive', 'dealership', 'crm']
    }
];

async function main() {
    const sellers = await prisma.seller.findMany();
    const usedUsernames = new Set();

    for (const seller of sellers) {
        const baseUsername = ((seller.username || seller.email || `${seller.sellerId}@milkyway.local`).split('@')[0] || '')
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '') || `seller_${seller.sellerId.toLowerCase()}`;

        let usernameToSet = baseUsername;
        let usernameSuffix = 1;
        while (usedUsernames.has(usernameToSet)) {
            usernameToSet = `${baseUsername}_${usernameSuffix}`;
            usernameSuffix += 1;
        }

        const normalizedPhoneCandidate = seller.normalizedPhone || normalizePhone(seller.phone);
        const phoneConflict = normalizedPhoneCandidate
            ? await prisma.seller.findFirst({
                where: {
                    id: { not: seller.id },
                    normalizedPhone: normalizedPhoneCandidate
                }
            })
            : null;
        const normalizedPhoneToSet = phoneConflict ? null : normalizedPhoneCandidate;

        usedUsernames.add(usernameToSet);

        await prisma.seller.update({
            where: { id: seller.id },
            data: {
                username: usernameToSet,
                normalizedPhone: normalizedPhoneToSet,
                role: seller.role || 'seller'
            }
        });
    }

    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@milkyway.com').toLowerCase();
    const adminName = process.env.ADMIN_NAME || 'Milkyway Admin';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await prisma.seller.findFirst({
        where: {
            OR: [
                { sellerId: 'MWADMIN' },
                { username: adminUsername },
                { role: 'admin' }
            ]
        }
    });

    if (existingAdmin) {
        await prisma.seller.update({
            where: { id: existingAdmin.id },
            data: {
                name: adminName,
                username: adminUsername,
                email: adminEmail,
                phone: null,
                normalizedPhone: null,
                passwordHash: adminPasswordHash,
                role: 'admin',
                status: 'active'
            }
        });
    } else {
        await prisma.seller.create({
            data: {
                sellerId: 'MWADMIN',
                name: adminName,
                username: adminUsername,
                email: adminEmail,
                phone: null,
                normalizedPhone: null,
                passwordHash: adminPasswordHash,
                role: 'admin',
                status: 'active',
                commissionRate: 0
            }
        });
    }

    const sellerPasswordHash = await bcrypt.hash('Seller@12345', 10);

    const testSellers = [
        { name: 'John Developer', email: 'john@milkyway.com', phone: '+1234567890', sellerId: 'MW001' },
        { name: 'Sarah Designer', email: 'sarah@milkyway.com', phone: '+1234567891', sellerId: 'MW002' },
        { name: 'Mike Coder', email: 'mike@milkyway.com', phone: '+1234567892', sellerId: 'MW003' }
    ];

    for (const ts of testSellers) {
        const existing = await prisma.seller.findFirst({ where: { sellerId: ts.sellerId } });
        if (!existing) {
            await prisma.seller.create({
                data: {
                    ...ts,
                    username: ts.email.split('@')[0],
                    normalizedPhone: normalizePhone(ts.phone),
                    passwordHash: sellerPasswordHash,
                    role: 'seller',
                    status: 'active',
                    commissionRate: 30
                }
            });
        }
    }

    const count = await prisma.system.count();
    if (count > 0) {
        for (const system of initialSystems) {
            await prisma.system.updateMany({
                where: { title: system.title },
                data: {
                    description: system.description,
                    longDescription: system.longDescription,
                    image: system.image || null,
                    price: system.price,
                    commissionRate: system.commissionRate,
                    category: system.category,
                    features: system.features,
                    isActive: system.isActive
                }
            });
        }
        console.log('Existing products updated successfully.');
    } else {
        await prisma.system.createMany({
            data: initialSystems
        });
        console.log('Initial systems seeded successfully!');
    }

    const portfolioCount = await prisma.portfolio.count();
    if (portfolioCount > 0) {
        console.log('Portfolios already exist, skipping...');
    } else {
        await prisma.portfolio.createMany({
            data: initialPortfolios
        });
        console.log('Portfolios seeded successfully!');
    }

    const salesCount = await prisma.sale.count();
    if (salesCount === 0) {
        const systems = await prisma.system.findMany();
        const sellersList = await prisma.seller.findMany({ where: { role: 'seller' } });
        
        if (systems.length > 0 && sellersList.length > 0) {
            const sampleSales = [
                { systemId: systems[0].id, sellerId: sellersList[0].id, buyerName: 'Acme Corp', salePrice: 2499, commissionAmount: 374.85, status: 'completed' },
                { systemId: systems[1].id, sellerId: sellersList[0].id, buyerName: 'Global Tech', salePrice: 1999, commissionAmount: 239.88, status: 'completed' },
                { systemId: systems[2].id, sellerId: sellersList[1].id, buyerName: 'ShopEasy', salePrice: 1499, commissionAmount: 149.9, status: 'pending' },
                { systemId: systems[3].id, sellerId: sellersList[1].id, buyerName: 'LuxStay Hotels', salePrice: 3499, commissionAmount: 629.82, status: 'completed' },
                { systemId: systems[4].id, sellerId: sellersList[2].id, buyerName: 'Bright School', salePrice: 1299, commissionAmount: 129.9, status: 'completed' }
            ];

            for (const sale of sampleSales) {
                await prisma.sale.create({
                    data: {
                        saleId: `SALE${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        ...sale
                    }
                });
            }
            console.log('Sample sales seeded successfully!');
        }
    }

    const contactCount = await prisma.contact.count();
    if (contactCount === 0) {
        const sampleContacts = [
            { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1987654321', message: 'Interested in E-Commerce Pro', status: 'new' },
            { name: 'Bob Smith', email: 'bob@example.com', phone: '+1987654322', message: 'Need CRM Enterprise demo', status: 'contacted' },
            { name: 'Carol White', email: 'carol@example.com', phone: '+1987654323', message: 'Quote for Hotel Management', status: 'new' }
        ];

        for (const contact of sampleContacts) {
            await prisma.contact.create({
                data: contact
            });
        }
        console.log('Sample contacts seeded successfully!');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (err) => {
        console.error('Error:', err);
        await prisma.$disconnect();
        process.exit(1);
    });
