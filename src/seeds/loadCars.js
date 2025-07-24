const mongoose = require('mongoose');
const Car = require('../src/models/carsModel');
require('dotenv/config');

const MONGO_URL = process.env.MONGO_URL;
const sampleCars = [
  {
    manufacturer: 'Honda',
    model: 'City',
    variant: 'ZX',
    transmission: 'Manual',
    segment: 'Sedan',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 500,
    image:
      'https://www.hondacarindia.com/web-data/models/2023/cityeHEV/exterior/radiant_red_metallic/ar_pk_city_ext_360_v-4_07.png',
    thumbnail: '',
    status: 'active',
    location: { city: 'Delhi', state: 'Delhi', country: 'India' }
  },
  {
    manufacturer: 'Toyota',
    model: 'Innova Crysta',
    variant: 'VX',
    transmission: 'Manual',
    segment: 'MUV',
    capacity: 7,
    fuelType: 'Diesel',
    rentPerHour: 700,
    image:
      'https://static3.toyotabharat.com/images/showroom/innova-mmc/attitude-black-color-1600x600.png',
    thumbnail: '',
    status: 'active',
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    manufacturer: 'Tesla',
    model: 'Model 3',
    variant: 'Performance',
    transmission: 'Automatic',
    segment: 'Luxury',
    capacity: 5,
    fuelType: 'Electric',
    rentPerHour: 1000,
    image:
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Exterior-Hero-Desktop-LHD.jpg',
    thumbnail: '',
    status: 'active',
    location: { city: 'Bangalore', state: 'Karnataka', country: 'India' }
  },
  {
    manufacturer: 'Hyundai',
    model: 'Creta',
    variant: 'SX',
    transmission: 'Manual',
    segment: 'SUV',
    capacity: 5,
    fuelType: 'Diesel',
    rentPerHour: 600,
    image:
      'https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Creta/Highlights/mob/cretagalleryb10.jpg',
    thumbnail: '',
    status: 'active',
    location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' }
  },
  {
    manufacturer: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7',
    transmission: 'Automatic',
    segment: 'SUV',
    capacity: 7,
    fuelType: 'Petrol',
    rentPerHour: 800,
    image:
      'https://auto.mahindra.com/on/demandware.static/-/Sites-mahindra-product-catalog/default/dwb2e1f2a8/images/X700/hires/AX7_StealthBlack_1366x443.png',
    thumbnail: '',
    status: 'active',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },
  {
    manufacturer: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXi+',
    transmission: 'Manual',
    segment: 'Hatchback',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 400,
    image:
      'https://www.marutisuzuki.com/js/arenabrandjs/threesixtyjs/img/blue_black_dual_tone/suzuki_swift_ext_360_blue_black_dual_tone_v-1_5.webp',
    thumbnail: '',
    status: 'active',
    location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' }
  },
  {
    manufacturer: 'Kia',
    model: 'Seltos',
    variant: 'HTX',
    transmission: 'Automatic',
    segment: 'SUV',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 650,
    image:
      'https://www.kia.com/content/dam/kia2/in/en/images/360vr/seltos/tiw51mc5fhh409/exterior/gb3/05-d.png',
    thumbnail: '',
    status: 'active',
    location: { city: 'Hyderabad', state: 'Telangana', country: 'India' }
  },
  {
    manufacturer: 'MG',
    model: 'Hector',
    variant: 'Sharp',
    transmission: 'Manual',
    segment: 'SUV',
    capacity: 5,
    fuelType: 'Diesel',
    rentPerHour: 750,
    image: 'https://www.mgmotor.co.in/content/dam/mgmotor/images/hc-img-dsc-0817.png',
    thumbnail: '',
    status: 'active',
    location: { city: 'Kochi', state: 'Kerala', country: 'India' }
  },
  {
    manufacturer: 'Tata',
    model: 'Nexon EV',
    variant: 'XZ+',
    transmission: 'Automatic',
    segment: 'SUV',
    capacity: 5,
    fuelType: 'Electric',
    rentPerHour: 850,
    image:
      'https://s7ap1.scene7.com/is/image/tatapassenger/IntensiTeal-0-2?$PO-850-600-S$&fit=crop&fmt=avif-alpha',
    thumbnail: '',
    status: 'active',
    location: { city: 'Indore', state: 'Madhya Pradesh', country: 'India' }
  },
  {
    manufacturer: 'Ford',
    model: 'EcoSport',
    variant: 'Titanium',
    transmission: 'Manual',
    segment: 'SUV',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 550,
    image:
      'https://imgd.aeplcdn.com/664x374/cw/ec/40369/Ford-EcoSport-Right-Front-Three-Quarter-159249.jpg?wm=0&q=80',
    thumbnail: '',
    status: 'active',
    location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' }
  }
];

// MongoDB connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function loadCars() {
  try {
    await Car.deleteMany(); // Optional: clean existing data
    const cars = await Car.insertMany(sampleCars);
    console.log('✅ Sample car data inserted successfully');
    console.log(cars);
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error inserting car data:', err);
    mongoose.connection.close();
  }
}

loadCars();
