export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  features: string[];
  image: string;
  demoUrl?: string;
  commission: number;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalSales: number;
  pendingDeals: number;
  commissionEarned: number;
  status: 'active' | 'pending';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'new' | 'interested' | 'negotiating' | 'closed';
  createdAt: string;
}

export interface Deal {
  id: string;
  productId: string;
  productName: string;
  clientName: string;
  clientEmail: string;
  value: number;
  commission: number;
  status: 'pending' | 'approved' | 'rejected' | 'closed';
  createdAt: string;
  sellerId: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
  requestedBy: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'E-Commerce Pro',
    description: 'Full-featured online store with payment integration',
    longDescription: 'A comprehensive e-commerce solution built for modern businesses. Includes inventory management, multiple payment gateways, customer analytics, and mobile-responsive design.',
    price: 2499,
    category: 'E-Commerce',
    features: ['Payment Integration', 'Inventory Management', 'Customer Analytics', 'Mobile Responsive', 'SEO Optimized', 'Multi-language'],
    image: '/products/ecommerce.jpg',
    commission: 15,
  },
  {
    id: '2',
    name: 'CRM Enterprise',
    description: 'Customer relationship management system',
    longDescription: 'Powerful CRM tool to manage your customer relationships effectively. Track leads, automate follow-ups, and analyze customer behavior.',
    price: 1999,
    category: 'Business',
    features: ['Lead Tracking', 'Auto Follow-ups', 'Sales Pipeline', 'Email Integration', 'Reporting', 'API Access'],
    image: '/products/crm.jpg',
    commission: 12,
  },
  {
    id: '3',
    name: 'Inventory Pro',
    description: 'Real-time inventory tracking system',
    longDescription: 'Complete inventory management solution with barcode scanning, real-time tracking, and automated reorder alerts.',
    price: 1499,
    category: 'Business',
    features: ['Barcode Scanning', 'Real-time Tracking', 'Auto Reorder', 'Multi-warehouse', 'Reporting', 'Mobile App'],
    image: '/products/inventory.jpg',
    commission: 10,
  },
  {
    id: '4',
    name: 'Hotel Management',
    description: 'Complete hotel operations software',
    longDescription: 'All-in-one hotel management system covering reservations, check-in/out, billing, housekeeping, and guest services.',
    price: 3499,
    category: 'Hospitality',
    features: ['Reservations', 'Check-in/out', 'Billing', 'Housekeeping', 'Restaurant Module', 'Online Booking'],
    image: '/products/hotel.jpg',
    commission: 18,
  },
  {
    id: '5',
    name: 'School Portal',
    description: 'Educational institution management system',
    longDescription: 'Comprehensive school management software with student information, attendance, grading, and parent communication.',
    price: 1299,
    category: 'Education',
    features: ['Student Info', 'Attendance', 'Grading', 'Parent Portal', 'Fee Management', 'Online Classes'],
    image: '/products/school.jpg',
    commission: 10,
  },
  {
    id: '6',
    name: 'Restaurant POS',
    description: 'Point of sale for restaurants',
    longDescription: 'Modern POS system designed for restaurants with table management, kitchen display, inventory, and delivery integration.',
    price: 999,
    category: 'Retail',
    features: ['Table Management', 'Kitchen Display', 'Inventory', 'Delivery Integration', 'Analytics', 'Mobile Ordering'],
    image: '/products/restaurant.jpg',
    commission: 12,
  },
];

export const sellers: Seller[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    totalSales: 15,
    pendingDeals: 3,
    commissionEarned: 12500,
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    totalSales: 22,
    pendingDeals: 5,
    commissionEarned: 18750,
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    totalSales: 8,
    pendingDeals: 2,
    commissionEarned: 6200,
    status: 'active',
  },
];

export const leads: Lead[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    email: 'contact@abc.com',
    company: 'ABC Corp',
    phone: '+1 234 567 8900',
    status: 'interested',
    createdAt: '2026-03-25',
  },
  {
    id: '2',
    name: 'XYZ Industries',
    email: 'info@xyz.com',
    company: 'XYZ Industries',
    phone: '+1 234 567 8901',
    status: 'negotiating',
    createdAt: '2026-03-20',
  },
  {
    id: '3',
    name: 'Tech Startup Inc',
    email: 'hello@techstartup.com',
    company: 'Tech Startup',
    phone: '+1 234 567 8902',
    status: 'new',
    createdAt: '2026-03-28',
  },
];

export const deals: Deal[] = [
  {
    id: '1',
    productId: '1',
    productName: 'E-Commerce Pro',
    clientName: 'ABC Corporation',
    clientEmail: 'contact@abc.com',
    value: 2499,
    commission: 375,
    status: 'approved',
    createdAt: '2026-03-25',
    sellerId: '1',
  },
  {
    id: '2',
    productId: '2',
    productName: 'CRM Enterprise',
    clientName: 'XYZ Industries',
    clientEmail: 'info@xyz.com',
    value: 1999,
    commission: 240,
    status: 'pending',
    createdAt: '2026-03-28',
    sellerId: '1',
  },
  {
    id: '3',
    productId: '4',
    productName: 'Hotel Management',
    clientName: 'Grand Hotel',
    clientEmail: 'manager@grandhotel.com',
    value: 3499,
    commission: 630,
    status: 'closed',
    createdAt: '2026-03-15',
    sellerId: '2',
  },
];

export const featureRequests: FeatureRequest[] = [
  {
    id: '1',
    title: 'Add Arabic language support',
    description: 'Multiple clients have requested Arabic language support for the E-Commerce platform.',
    votes: 24,
    status: 'in_progress',
    requestedBy: 'John Smith',
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    title: 'Mobile app for CRM',
    description: 'Request for a native mobile app for the CRM system.',
    votes: 18,
    status: 'pending',
    requestedBy: 'Sarah Johnson',
    createdAt: '2026-03-15',
  },
  {
    id: '3',
    title: 'AI-powered lead scoring',
    description: 'Add AI capabilities to automatically score and prioritize leads.',
    votes: 31,
    status: 'approved',
    requestedBy: 'Mike Davis',
    createdAt: '2026-03-01',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Robert Chen',
    role: 'CEO',
    company: 'TechVentures',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    content: 'The E-Commerce Pro transformed our online business. Sales increased by 300% in just 3 months!',
  },
  {
    id: '2',
    name: 'Emily Watson',
    role: 'Operations Manager',
    company: 'Grand Hospitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    content: 'Hotel Management system saved us countless hours. The best investment we made this year.',
  },
  {
    id: '3',
    name: 'David Park',
    role: 'Founder',
    company: 'StartupHub',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    content: 'As a startup, we needed an affordable yet powerful CRM. CRM Enterprise exceeded all expectations.',
  },
];

export const categories = ['All', 'E-Commerce', 'Business', 'Retail', 'Hospitality', 'Education'];
