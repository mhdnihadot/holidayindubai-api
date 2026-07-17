import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './modules/project/project.model';
import Admin from './modules/admin/admin.model';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/holidayindubai';

const iconUrl = (name: string) => `https://api.iconify.design/lucide:${name}.svg?color=%234f46e5`;
const imageUrl = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const commonFields = {
  idealFor: [
    { icon: iconUrl('users'), text: 'Families with Children' },
    { icon: iconUrl('heart'), text: 'Couples' },
    { icon: iconUrl('flame'), text: 'Thrill Seekers' }
  ],
  nearbyLandmarks: ['Burj Khalifa (15 mins)', 'Dubai Mall (10 mins)', 'Dubai Marina (20 mins)'],
  platformUrl: 'https://example.com',
  dressCode: {
    recommended: 'Comfortable casual wear, athletic clothing for adventures.',
    avoid: 'Formal wear, high heels, or restrictive clothing.'
  },
  safetyAndComfort: [
    { icon: iconUrl('shield'), title: 'Safety Gear', description: 'All necessary safety equipment provided on-site.' },
    { icon: iconUrl('plus-square'), title: 'First Aid', description: 'Trained staff and first aid kits available.' },
    { icon: iconUrl('sun'), title: 'Sun Protection', description: 'Sunscreen and water provided for comfort.' }
  ],
  accessibility: [
    { icon: iconUrl('accessibility'), title: 'Wheelchair Access', description: 'Partial access available in viewing areas.' },
    { icon: iconUrl('parking-circle'), title: 'Parking', description: 'Designated accessible parking near the entrance.' }
  ],
  experienceSteps: [
    { title: 'Step 1: Arrival & Briefing', content: 'Meet your guide at the designated location for a comprehensive safety briefing.' },
    { title: 'Step 2: The Experience', content: 'Enjoy the main activity with our expert instructors.' },
    { title: 'Step 3: Debrief & Photos', content: 'Relax after the activity and view your professional photos.' }
  ]
};

const seedData = [
  {
    title: 'Skydiving over Palm Jumeirah',
    subtitle: 'The ultimate adrenaline rush',
    description: 'Experience the thrill of a lifetime with a tandem skydive over the iconic Palm Jumeirah. Feel the rush of freefall at 120 mph before your parachute opens, giving you breathtaking views of the Dubai skyline and coastline.',
    location: 'Skydive Dubai, Dubai Marina',
    emirate: 'Dubai',
    category: 'Adventure',
    duration: '3 hours',
    bestTime: 'Morning',
    bestSeason: 'Winter (Nov - April)',
    outdoor: true,
    highlights: [
      { icon: iconUrl('arrow-down'), text: 'Tandem freefall over Palm Jumeirah' },
      { icon: iconUrl('video'), text: 'Professional video and photos included' },
      { icon: iconUrl('plane'), text: 'Scenic flight before the jump' }
    ],
    status: 'active',
    images: [imageUrl('sky_1'), imageUrl('sky_2'), imageUrl('sky_3')],
    ...commonFields
  },
  {
    title: 'Desert Safari with Dune Bashing',
    subtitle: 'A thrilling Arabian night',
    description: 'Embark on an exhilarating desert safari featuring heart-pounding dune bashing in a 4x4, camel riding, sandboarding, and a traditional Bedouin camp experience with BBQ dinner and live entertainment.',
    location: 'Dubai Desert Conservation Reserve',
    emirate: 'Dubai',
    category: 'Adventure',
    duration: '6 hours',
    bestTime: 'Late Afternoon',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('car'), text: 'Thrilling 4x4 dune bashing' },
      { icon: iconUrl('map-pin'), text: 'Camel ride and sandboarding' },
      { icon: iconUrl('utensils'), text: 'BBQ dinner with belly dance and Tanoura show' }
    ],
    status: 'active',
    images: [imageUrl('desert_1'), imageUrl('desert_2'), imageUrl('desert_3')],
    ...commonFields
  },
  {
    title: 'Hatta Mountain Kayaking',
    subtitle: 'Serenity amidst the peaks',
    description: 'Escape the city and kayak through the calm, turquoise waters of Hatta Dam, surrounded by the rugged peaks of the Hajar Mountains. Perfect for nature lovers and adventure seekers alike.',
    location: 'Hatta Dam',
    emirate: 'Dubai',
    category: 'Nature & Adventure',
    duration: '2 hours',
    bestTime: 'Early Morning or Late Afternoon',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('waves'), text: 'Kayak rental included' },
      { icon: iconUrl('mountain'), text: 'Stunning mountain views' },
      { icon: iconUrl('binoculars'), text: 'Wildlife spotting opportunities' }
    ],
    status: 'active',
    images: [imageUrl('hatta_1'), imageUrl('hatta_2'), imageUrl('hatta_3')],
    ...commonFields
  },
  {
    title: 'Hot Air Balloon Ride',
    subtitle: 'Float above the Arabian desert',
    description: 'Watch the sunrise over the endless sand dunes of the Arabian desert from a hot air balloon. Enjoy a serene flight followed by a gourmet breakfast in a traditional Bedouin camp.',
    location: 'Margham Desert',
    emirate: 'Dubai',
    category: 'Adventure',
    duration: '4 hours',
    bestTime: 'Pre-dawn',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('cloud'), text: 'Sunrise hot air balloon flight' },
      { icon: iconUrl('feather'), text: 'In-flight falconry show' },
      { icon: iconUrl('coffee'), text: 'Gourmet breakfast in a desert camp' }
    ],
    status: 'active',
    images: [imageUrl('balloon_1'), imageUrl('balloon_2'), imageUrl('balloon_3')],
    ...commonFields
  },
  {
    title: 'XLine Dubai Marina Zipline',
    subtitle: 'The longest urban zipline',
    description: 'Experience the thrill of the longest urban zipline in the world. Fly head-first across the Dubai Marina at speeds up to 80 km/h, taking in spectacular views of the skyscrapers and yachts below.',
    location: 'Dubai Marina Mall',
    emirate: 'Dubai',
    category: 'Adventure',
    duration: '1 hour',
    bestTime: 'Afternoon',
    bestSeason: 'Year-round',
    outdoor: true,
    highlights: [
      { icon: iconUrl('zap'), text: 'Speeds up to 80 km/h' },
      { icon: iconUrl('building'), text: 'Incredible views of Dubai Marina' },
      { icon: iconUrl('camera'), text: 'GoPro video and photos included' }
    ],
    status: 'active',
    images: [imageUrl('xline_1'), imageUrl('xline_2'), imageUrl('xline_3')],
    ...commonFields
  },
  {
    title: 'Scuba Diving in Fujairah',
    subtitle: 'Explore underwater wonders',
    description: 'Dive into the crystal-clear waters of the Gulf of Oman. Discover vibrant coral reefs, shipwrecks, and diverse marine life including turtles, rays, and colorful reef fish in Fujairah.',
    location: 'Snoopy Island',
    emirate: 'Fujairah',
    category: 'Water Sports',
    duration: 'Half Day',
    bestTime: 'Morning',
    bestSeason: 'Year-round',
    outdoor: true,
    highlights: [
      { icon: iconUrl('droplet'), text: 'Two guided tank dives' },
      { icon: iconUrl('anchor'), text: 'Rich marine biodiversity' },
      { icon: iconUrl('ship'), text: 'Boat trip to dive sites' }
    ],
    status: 'active',
    images: [imageUrl('scuba_1'), imageUrl('scuba_2'), imageUrl('scuba_3')],
    ...commonFields
  },
  {
    title: 'Jebel Jais Flight Zipline',
    subtitle: 'The world\'s longest zipline',
    description: 'Conquer the Jebel Jais Flight, officially the world’s longest zipline. Soar across the jagged peaks of the Hajar Mountains in Ras Al Khaimah at breathtaking speeds reaching up to 150 km/h.',
    location: 'Jebel Jais',
    emirate: 'Ras Al Khaimah',
    category: 'Adventure',
    duration: '2 hours',
    bestTime: 'Morning',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('mountain'), text: 'World\'s longest zipline (2.83km)' },
      { icon: iconUrl('zap'), text: 'Speeds up to 150 km/h' },
      { icon: iconUrl('image'), text: 'Stunning mountain scenery' }
    ],
    status: 'active',
    images: [imageUrl('jais_1'), imageUrl('jais_2'), imageUrl('jais_3')],
    ...commonFields
  },
  {
    title: 'Deep Dive Dubai',
    subtitle: 'The world\'s deepest pool',
    description: 'Explore a sunken city in the world\'s deepest swimming pool for diving (60 meters). Whether you are a beginner or a seasoned freediver or scuba diver, this underwater world is a must-visit.',
    location: 'Nad Al Sheba',
    emirate: 'Dubai',
    category: 'Indoor Adventure',
    duration: '2 hours',
    bestTime: 'Anytime',
    bestSeason: 'Year-round',
    outdoor: false,
    highlights: [
      { icon: iconUrl('droplet'), text: 'Dive up to 60 meters deep' },
      { icon: iconUrl('building'), text: 'Explore a complete sunken city' },
      { icon: iconUrl('thermometer'), text: 'Water temperature maintained at 30°C' }
    ],
    status: 'active',
    images: [imageUrl('deep_1'), imageUrl('deep_2'), imageUrl('deep_3')],
    ...commonFields
  },
  {
    title: 'Edge Walk at Sky Views',
    subtitle: 'A hands-free walk in the sky',
    description: 'Step outside the Sky Views observatory and walk along the edge of the building, 219.5 meters above the ground. With no windows or protective barriers, this is an extreme thrill-seeking experience.',
    location: 'Address Sky View Hotel',
    emirate: 'Dubai',
    category: 'Extreme Adventure',
    duration: '1.5 hours',
    bestTime: 'Sunset',
    bestSeason: 'Year-round',
    outdoor: true,
    highlights: [
      { icon: iconUrl('users-round'), text: 'Hands-free walk on the building edge' },
      { icon: iconUrl('building'), text: 'Unobstructed views of Burj Khalifa' },
      { icon: iconUrl('camera'), text: 'Professional photos included' }
    ],
    status: 'active',
    images: [imageUrl('edge_1'), imageUrl('edge_2'), imageUrl('edge_3')],
    ...commonFields
  },
  {
    title: 'Kite Surfing at Kite Beach',
    subtitle: 'Ride the waves and the wind',
    description: 'Join the vibrant kitesurfing community at Dubai’s famous Kite Beach. Whether you’re learning the ropes or perfecting your jumps, the consistent winds and warm waters make for a perfect session.',
    location: 'Kite Beach, Jumeirah',
    emirate: 'Dubai',
    category: 'Water Sports',
    duration: '2-4 hours',
    bestTime: 'Afternoon',
    bestSeason: 'Winter & Spring',
    outdoor: true,
    highlights: [
      { icon: iconUrl('wind'), text: 'Equipment rental and lessons available' },
      { icon: iconUrl('sun'), text: 'Vibrant beach atmosphere' },
      { icon: iconUrl('waves'), text: 'Clear waters and steady winds' }
    ],
    status: 'active',
    images: [imageUrl('kite_1'), imageUrl('kite_2'), imageUrl('kite_3')],
    ...commonFields
  },
  {
    title: 'Jet Ski Tour of Dubai',
    subtitle: 'High-speed coastal sightseeing',
    description: 'Experience Dubai from the water on a high-octane jet ski tour. Race past iconic landmarks including the Burj Al Arab, Palm Jumeirah, and Atlantis, getting a unique perspective of the city\'s coastline.',
    location: 'Dubai Harbor / Jumeirah',
    emirate: 'Dubai',
    category: 'Water Sports',
    duration: '1-2 hours',
    bestTime: 'Morning',
    bestSeason: 'Year-round',
    outdoor: true,
    highlights: [
      { icon: iconUrl('zap'), text: 'High-speed Yamaha Jet Skis' },
      { icon: iconUrl('camera'), text: 'Photo stops at Burj Al Arab and Atlantis' },
      { icon: iconUrl('shield'), text: 'Professional guide and safety gear' }
    ],
    status: 'active',
    images: [imageUrl('jet_1'), imageUrl('jet_2'), imageUrl('jet_3')],
    ...commonFields
  },
  {
    title: 'Ferrari World Theme Park',
    subtitle: 'Speed and luxury in Abu Dhabi',
    description: 'Visit the first Ferrari-branded theme park in the world. Experience the Formula Rossa, the world’s fastest rollercoaster, and enjoy a variety of racing simulators and Ferrari-themed attractions.',
    location: 'Yas Island',
    emirate: 'Abu Dhabi',
    category: 'Theme Park',
    duration: 'Full Day',
    bestTime: 'Anytime',
    bestSeason: 'Year-round',
    outdoor: false,
    highlights: [
      { icon: iconUrl('zap'), text: 'Ride the world\'s fastest rollercoaster' },
      { icon: iconUrl('car'), text: 'Drive a real Ferrari (optional)' },
      { icon: iconUrl('ticket'), text: 'Advanced racing simulators' }
    ],
    status: 'active',
    images: [imageUrl('ferrari_1'), imageUrl('ferrari_2'), imageUrl('ferrari_3')],
    ...commonFields
  },
  {
    title: 'Shark Dive at Dubai Aquarium',
    subtitle: 'Face to face with apex predators',
    description: 'Dive into the 10-million-liter tank at the Dubai Aquarium and Underwater Zoo. Swim alongside sand tiger sharks, reef sharks, and thousands of other aquatic animals in a safe, controlled environment.',
    location: 'Dubai Mall',
    emirate: 'Dubai',
    category: 'Indoor Adventure',
    duration: '2 hours',
    bestTime: 'Afternoon',
    bestSeason: 'Year-round',
    outdoor: false,
    highlights: [
      { icon: iconUrl('droplet'), text: 'Dive with multiple species of sharks' },
      { icon: iconUrl('shield'), text: 'Suitable for certified and non-certified divers' },
      { icon: iconUrl('building'), text: 'Located inside the iconic Dubai Mall' }
    ],
    status: 'active',
    images: [imageUrl('shark_1'), imageUrl('shark_2'), imageUrl('shark_3')],
    ...commonFields
  },
  {
    title: 'Wadi Shawka Hike',
    subtitle: 'Explore the Hajar Mountains',
    description: 'A moderate hiking trail in Ras Al Khaimah featuring natural pools, rugged terrain, and the impressive Shawka Dam. It\'s a popular escape from the city for hiking, mountain biking, and camping.',
    location: 'Wadi Shawka',
    emirate: 'Ras Al Khaimah',
    category: 'Nature & Hiking',
    duration: '3-4 hours',
    bestTime: 'Early Morning',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('map-pin'), text: 'Scenic hiking trails' },
      { icon: iconUrl('waves'), text: 'Natural pools for swimming (seasonal)' },
      { icon: iconUrl('mountain'), text: 'Stunning mountain landscapes' }
    ],
    status: 'active',
    images: [imageUrl('wadi_1'), imageUrl('wadi_2'), imageUrl('wadi_3')],
    ...commonFields
  },
  {
    title: 'Paramotor Flight over the Desert',
    subtitle: 'An open-air flight experience',
    description: 'Take to the skies in a paramotor and soar over the Dubai desert. Enjoy unobstructed, 360-degree views of the sand dunes, local wildlife, and the Dubai Lake in this unique flying adventure.',
    location: 'Skydive Dubai Desert Campus',
    emirate: 'Dubai',
    category: 'Adventure',
    duration: '1 hour',
    bestTime: 'Sunrise or Sunset',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('plane'), text: 'Tandem flight with experienced pilot' },
      { icon: iconUrl('sun'), text: 'Incredible desert views' },
      { icon: iconUrl('binoculars'), text: 'Spot gazelles and oryx from above' }
    ],
    status: 'active',
    images: [imageUrl('paramotor_1'), imageUrl('paramotor_2'), imageUrl('paramotor_3')],
    ...commonFields
  },
  {
    title: 'Flyboarding at JBR',
    subtitle: 'Defy gravity on the water',
    description: 'Strap into a water-propelled jetpack and fly above the sea at Jumeirah Beach Residence. Learn to hover, spin, and dive like a dolphin in this futuristic water sports experience.',
    location: 'JBR Beach',
    emirate: 'Dubai',
    category: 'Water Sports',
    duration: '30 mins',
    bestTime: 'Morning or Late Afternoon',
    bestSeason: 'Year-round',
    outdoor: true,
    highlights: [
      { icon: iconUrl('arrow-down'), text: 'Fly up to 10 meters above the water' },
      { icon: iconUrl('waves'), text: 'Expert instruction included' },
      { icon: iconUrl('building'), text: 'Backdrop of the Dubai Marina skyline' }
    ],
    status: 'active',
    images: [imageUrl('flyboard_1'), imageUrl('flyboard_2'), imageUrl('flyboard_3')],
    ...commonFields
  },
  {
    title: 'Ski Dubai Penguin Encounter',
    subtitle: 'Meet the King and Gentoo penguins',
    description: 'Get up close and personal with snow penguins at Ski Dubai, the Middle East\'s first indoor ski resort. Enjoy a 40-minute interactive session where you can pet and take photos with these incredible birds.',
    location: 'Mall of the Emirates',
    emirate: 'Dubai',
    category: 'Indoor Adventure',
    duration: '1 hour',
    bestTime: 'Anytime',
    bestSeason: 'Year-round',
    outdoor: false,
    highlights: [
      { icon: iconUrl('heart'), text: 'Interact with real penguins' },
      { icon: iconUrl('cloud'), text: 'Access to the Snow Park' },
      { icon: iconUrl('camera'), text: 'Professional souvenir photos' }
    ],
    status: 'active',
    images: [imageUrl('ski_1'), imageUrl('ski_2'), imageUrl('ski_3')],
    ...commonFields
  },
  {
    title: 'Stand-Up Paddleboarding around Palm Jumeirah',
    subtitle: 'A peaceful paddle on calm waters',
    description: 'Rent a SUP board and explore the calm, crystal-clear waters surrounding the Palm Jumeirah fronds. A fantastic core workout and a peaceful way to enjoy the coastal views and sunset.',
    location: 'Palm Jumeirah',
    emirate: 'Dubai',
    category: 'Water Sports',
    duration: '1-2 hours',
    bestTime: 'Sunset',
    bestSeason: 'Spring and Autumn',
    outdoor: true,
    highlights: [
      { icon: iconUrl('waves'), text: 'Board and paddle rental included' },
      { icon: iconUrl('sun'), text: 'Incredible sunset views' },
      { icon: iconUrl('heart'), text: 'Calm, flat waters ideal for beginners' }
    ],
    status: 'active',
    images: [imageUrl('paddle_1'), imageUrl('paddle_2'), imageUrl('paddle_3')],
    ...commonFields
  },
  {
    title: 'Hatta Mountain Biking',
    subtitle: 'Hit the rugged trails',
    description: 'Tackle the Hatta Mountain Bike Trail Centre, offering over 50km of trails catering to all abilities, from beginners to expert riders. Navigate through wadis, rocky terrain, and farmland.',
    location: 'Hatta Wadi Hub',
    emirate: 'Dubai',
    category: 'Nature & Adventure',
    duration: '3 hours',
    bestTime: 'Morning',
    bestSeason: 'Winter',
    outdoor: true,
    highlights: [
      { icon: iconUrl('zap'), text: 'Multiple trails for all skill levels' },
      { icon: iconUrl('mountain'), text: 'Rugged mountain and wadi scenery' },
      { icon: iconUrl('map'), text: 'Bike rentals and trail maps available' }
    ],
    status: 'active',
    images: [imageUrl('bike_1'), imageUrl('bike_2'), imageUrl('bike_3')],
    ...commonFields
  },
  {
    title: 'Helicopter Tour of Dubai',
    subtitle: 'See the city from the clouds',
    description: 'Take a thrilling helicopter ride over Dubai. Marvel at the city’s architectural masterpieces from a bird’s eye view, including the Burj Khalifa, the World Islands, and the Palm Jumeirah.',
    location: 'Atlantis The Palm Helipad',
    emirate: 'Dubai',
    category: 'Sightseeing & Adventure',
    duration: '15-25 mins',
    bestTime: 'Mid-morning or Afternoon',
    bestSeason: 'Year-round',
    outdoor: true,
    highlights: [
      { icon: iconUrl('plane'), text: 'Premium helicopter flight' },
      { icon: iconUrl('building'), text: 'Unmatched views of Dubai\'s landmarks' },
      { icon: iconUrl('users'), text: 'Live commentary from the pilot' }
    ],
    status: 'active',
    images: [imageUrl('heli_1'), imageUrl('heli_2'), imageUrl('heli_3')],
    ...commonFields
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');

    // Clear existing projects to avoid duplicates
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // We need an admin user to be the creator
    let admin = await Admin.findOne();
    
    if (!admin) {
      console.log('No admin found, creating a dummy admin');
      admin = await Admin.create({
        name: 'Seed Admin',
        email: 'seed@admin.com',
        password: 'Password123!',
      });
    }

    const projectsWithCreator = seedData.map(project => ({
      ...project,
      createdBy: admin!._id
    }));

    await Project.insertMany(projectsWithCreator);
    console.log('Successfully seeded 20 highly detailed adventure and tourism projects');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
