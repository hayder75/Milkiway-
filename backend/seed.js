require('dotenv').config();
const mongoose = require('mongoose');
const System = require('./models/System');

const initialSystems = [
    {
        title: 'E-Commerce Pro',
        description: 'Full-featured online store with payment integration',
        category: 'E-Commerce',
        price: 2499,
        features: ['Payment Integration', 'Inventory Management', 'Customer Analytics', 'Mobile Responsive', 'SEO Optimized', 'Multi-language'],
        isActive: true
    },
    {
        title: 'CRM Enterprise',
        description: 'Customer relationship management system',
        category: 'Business',
        price: 1999,
        features: ['Lead Tracking', 'Auto Follow-ups', 'Sales Pipeline', 'Email Integration', 'Reporting', 'API Access'],
        isActive: true
    },
    {
        title: 'Inventory Pro',
        description: 'Real-time inventory tracking system',
        category: 'Business',
        price: 1499,
        features: ['Barcode Scanning', 'Real-time Tracking', 'Auto Reorder', 'Multi-warehouse', 'Reporting', 'Mobile App'],
        isActive: true
    },
    {
        title: 'Hotel Management',
        description: 'Complete hotel operations software',
        category: 'Hospitality',
        price: 3499,
        features: ['Reservations', 'Check-in/out', 'Billing', 'Housekeeping', 'Restaurant Module', 'Online Booking'],
        isActive: true
    },
    {
        title: 'School Portal',
        description: 'Educational institution management system',
        category: 'Education',
        price: 1299,
        features: ['Student Info', 'Attendance', 'Grading', 'Parent Portal', 'Fee Management', 'Online Classes'],
        isActive: true
    },
    {
        title: 'Restaurant POS',
        description: 'Point of sale for restaurants',
        category: 'Retail',
        price: 999,
        features: ['Table Management', 'Kitchen Display', 'Inventory', 'Delivery Integration', 'Analytics', 'Mobile Ordering'],
        isActive: true
    },
    {
        title: 'Education System',
        description: 'Transform schools and universities with comprehensive management, student portals, and grading solutions.',
        category: 'Education',
        price: 5000,
        features: ['Student Management', 'Grade Tracking', 'Online Learning Portal', 'Attendance System', 'Fee Management'],
        isActive: true
    },
    {
        title: 'Medical System',
        description: 'Streamline healthcare facilities with patient records, appointment scheduling, and automated billing.',
        category: 'Healthcare',
        price: 8000,
        features: ['Patient Records', 'Appointment Scheduling', 'Billing & Invoicing', 'Pharmacy Management', 'Insurance Integration'],
        isActive: true
    },
    {
        title: 'Performance Management',
        description: 'Track, evaluate, and elevate employee performance metrics through continuous feedback.',
        category: 'Business',
        price: 3500,
        features: ['Goal Setting', '360 Reviews', 'KPIs Tracking', 'Performance Reports', 'Employee Directory'],
        isActive: true
    },
    {
        title: 'Stock Management',
        description: 'Optimized inventory tracking, predictive reordering, and advanced supply chain management.',
        category: 'Business',
        price: 4500,
        features: ['Real-time Tracking', 'Barcode Integration', 'Auto Reorder Alerts', 'Supplier Management', 'Reports & Analytics'],
        isActive: true
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/milkyway')
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const count = await System.countDocuments();
        if (count > 0) {
            console.log('Database already has systems. Skipping seed.');
        } else {
            await System.insertMany(initialSystems);
            console.log('Initial systems seeded successfully!');
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
