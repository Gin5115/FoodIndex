require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
    {
        name: 'Croissant Box (6 pcs)',
        restaurant: 'La Patisserie',
        category: 'Bakery',
        originalPrice: 450,
        pickupTime: '21:00',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        stock: 8,
        isTrending: true,
    },
    {
        name: 'Margherita Pizza',
        restaurant: 'Pizza Express',
        category: 'Pizza',
        originalPrice: 399,
        pickupTime: '22:00',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        stock: 5,
        isTrending: true,
    },
    {
        name: 'Sushi Combo (12 pcs)',
        restaurant: 'Tokyo Bites',
        category: 'Japanese',
        originalPrice: 750,
        pickupTime: '21:30',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        stock: 3,
        isTrending: true,
    },
    {
        name: 'Chocolate Cake Slice',
        restaurant: 'Sweet Dreams',
        category: 'Dessert',
        originalPrice: 180,
        pickupTime: '20:00',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        stock: 12,
        isTrending: false,
    },
    {
        name: 'Butter Chicken Bowl',
        restaurant: 'Spice Garden',
        category: 'Indian',
        originalPrice: 320,
        pickupTime: '21:00',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
        stock: 6,
        isTrending: true,
    },
    {
        name: 'Greek Salad',
        restaurant: 'Green Leaf Cafe',
        category: 'Healthy',
        originalPrice: 220,
        pickupTime: '19:30',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        stock: 10,
        isTrending: false,
    },
    {
        name: 'Chicken Burger Combo',
        restaurant: 'Burger Barn',
        category: 'Fast Food',
        originalPrice: 280,
        pickupTime: '22:00',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        stock: 15,
        isTrending: true,
    },
    {
        name: 'Pasta Alfredo',
        restaurant: 'Italian Kitchen',
        category: 'Italian',
        originalPrice: 350,
        pickupTime: '21:30',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
        stock: 7,
        isTrending: false,
    },
    {
        name: 'Donuts (Box of 6)',
        restaurant: 'Donut Delight',
        category: 'Bakery',
        originalPrice: 240,
        pickupTime: '20:00',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
        stock: 20,
        isTrending: true,
    },
    {
        name: 'Paneer Tikka',
        restaurant: 'Punjab Grill',
        category: 'Indian',
        originalPrice: 260,
        pickupTime: '21:00',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
        stock: 8,
        isTrending: false,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        const User = require('./models/User');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({ isSeller: true }); // Clear old sellers only
        console.log('🗑️  Cleared existing products and sellers');

        // ── DEFINE CHENNAI SELLERS (Iyyapanthangal & Surroundings) ──
        const sellersData = [
            {
                name: 'Tasty Bites Seller',
                email: 'seller1@foodindex.com',
                businessName: 'Chennai Spice Hub',
                businessType: 'Restaurant',
                businessAddress: '12, Mount Poonamallee Rd, Iyyappanthangal, Chennai, 600056',
                coordinates: [80.1362, 13.0456], // Iyyappanthangal
            },
            {
                name: 'Bakery Chef',
                email: 'seller2@foodindex.com',
                businessName: 'Oven Fresh',
                businessType: 'Bakery',
                businessAddress: '45, Trunk Road, Porur, Chennai, 600116',
                coordinates: [80.1588, 13.0382], // Porur
            },
            {
                name: 'Cafe Owner',
                email: 'seller3@foodindex.com',
                businessName: 'Madras Cafe',
                businessType: 'Café',
                businessAddress: '88, Arcot Rd, Valasaravakkam, Chennai, 600087',
                coordinates: [80.1770, 13.0405], // Valasaravakkam
            },
            {
                name: 'Grill Master',
                email: 'seller4@foodindex.com',
                businessName: 'Smoky Grill',
                businessType: 'Restaurant',
                businessAddress: '22, Kattupakkam Main Rd, Kattupakkam, Chennai, 600056',
                coordinates: [80.1220, 13.0490], // Kattupakkam (Near Iyyappanthangal)
            },
            {
                name: 'Pizza Guy',
                email: 'seller5@foodindex.com',
                businessName: 'Cheesy Slices',
                businessType: 'Restaurant',
                businessAddress: '10, DLF IT Park Rd, Ramapuram, Chennai, 600089',
                coordinates: [80.1830, 13.0315], // Ramapuram
            },
            {
                name: 'Sweet Tooth',
                email: 'seller6@foodindex.com',
                businessName: 'Mithai Wala',
                businessType: 'Other',
                businessAddress: '5, Mangadu Rd, Mangadu, Chennai, 600122',
                coordinates: [80.1100, 13.0420], // Mangadu
            },
            {
                name: 'Biryani King',
                email: 'seller7@foodindex.com',
                businessName: 'Ambur Hot Pot',
                businessType: 'Restaurant',
                businessAddress: '100, Poonamallee High Rd, Poonamallee, Chennai, 600056',
                coordinates: [80.0950, 13.0500], // Poonamallee
            },
            {
                name: 'Healthy Greens',
                email: 'seller8@foodindex.com',
                businessName: 'Salad Bar',
                businessType: 'Café',
                businessAddress: '33, L&T Colony, Manapakkam, Chennai, 600125',
                coordinates: [80.1700, 13.0200], // Manapakkam
            },
            {
                name: 'Night Owl Kitchen',
                email: 'seller9@foodindex.com',
                businessName: 'Midnight Munchies',
                businessType: 'Cloud Kitchen',
                businessAddress: '7, Vanagaram Main Rd, Vanagaram, Chennai, 600095',
                coordinates: [80.1450, 13.0600], // Vanagaram
            },
            {
                name: 'South Indian Tiffins',
                email: 'seller10@foodindex.com',
                businessName: 'Idli Factory',
                businessType: 'Restaurant',
                businessAddress: '15, Kovur Main Rd, Kovur, Chennai, 600128',
                coordinates: [80.1300, 13.0250], // Kovur
            }
        ];

        // Create Sellers
        const createdSellers = [];
        for (const seller of sellersData) {
            const newSeller = await User.create({
                name: seller.name,
                email: seller.email,
                password: 'password123', // Default password
                isSeller: true,
                businessName: seller.businessName,
                businessType: seller.businessType,
                businessAddress: seller.businessAddress,
                phone: '9876543210',
                location: {
                    type: 'Point',
                    coordinates: seller.coordinates,
                    formattedAddress: seller.businessAddress
                }
            });
            createdSellers.push(newSeller);
        }
        console.log(`✅ Created ${createdSellers.length} sellers in Chennai`);

        // ── CREATE PRODUCTS FOR THESE SELLERS ──
        const PRODUCT_TEMPLATES = [
            { name: 'Chicken Biryani Bucket', category: 'Indian', price: 250, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
            { name: 'Paneer Butter Masala', category: 'Indian', price: 180, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
            { name: 'Chocolate Truffle Cake', category: 'Bakery', price: 450, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
            { name: 'Grilled Chicken Sandwich', category: 'Fast Food', price: 150, image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=400' },
            { name: 'Masala Dosa', category: 'Indian', price: 80, image: 'https://images.unsplash.com/photo-1589301760014-d929645603f8?w=400' },
            { name: 'Veggie Pizza', category: 'Pizza', price: 350, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
            { name: 'Fresh Donuts (Pack of 3)', category: 'Bakery', price: 120, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
            { name: 'Sushi Platter', category: 'Japanese', price: 600, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
            { name: 'Cold Coffee', category: 'Café', price: 100, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
            { name: 'Schezwan Fried Rice', category: 'Chinese', price: 200, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400' },
        ];

        const productsToSeed = [];
        const now = new Date();

        createdSellers.forEach((seller, index) => {
            // Assign 2-3 products per seller
            const numProducts = 2 + Math.floor(Math.random() * 2);

            for (let i = 0; i < numProducts; i++) {
                const template = PRODUCT_TEMPLATES[Math.floor(Math.random() * PRODUCT_TEMPLATES.length)];

                const hoursUntilExpiry = 4 + Math.floor(Math.random() * 9);
                const expiryTime = new Date(now.getTime() + hoursUntilExpiry * 60 * 60 * 1000);
                const hoursAgo = 1 + Math.floor(Math.random() * 3);
                const listedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

                const stock = 5 + Math.floor(Math.random() * 10);

                productsToSeed.push({
                    seller: seller._id,
                    restaurant: seller.businessName, // Use seller's business name
                    name: template.name,
                    category: template.category,
                    originalPrice: template.price,
                    currentPrice: Math.round(template.price * 0.7), // 30% off
                    image: template.image,
                    stock: stock,
                    initialStock: stock,
                    currentStock: stock,
                    pickupTime: '22:00',
                    isTrending: Math.random() > 0.7,
                    soldOut: false,
                    listedAt,
                    expiryTime,
                    viewsLastHour: Math.floor(Math.random() * 20),
                    viewsToday: Math.floor(Math.random() * 50),
                    watchersCount: 0,
                    priceHistory: [{
                        price: template.price,
                        timestamp: listedAt,
                        reason: 'Initial listing',
                    }],
                    pricingStrategy: {
                        aggressiveness: 5,
                        minProfitMargin: 0.3,
                        enableDemandPricing: true,
                    },
                });
            }
        });

        // Insert sample products
        await Product.insertMany(productsToSeed);
        console.log(`🌱 Seeded ${productsToSeed.length} products associated with Chennai sellers`);

        console.log('✅ Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
