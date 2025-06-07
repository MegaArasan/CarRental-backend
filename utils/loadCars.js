const mongoose = require('mongoose');
const Car = require('../models/carsModel');
require('dotenv/config');

const MONGO_URL = process.env.MONGO_URL;
const sampleCars = [
  {
    name: "Honda City",
    image: "https://www.hondacarindia.com/web-data/models/2023/cityeHEV/exterior/radiant_red_metallic/ar_pk_city_ext_360_v-4_07.png",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 500,
    bookedTimeSlots: []
  },
  {
    name: "Toyota Innova Crysta",
    image: "https://static3.toyotabharat.com/images/showroom/innova-mmc/attitude-black-color-1600x600.png",
    capacity: 7,
    fuelType: "Diesel",
    rentPerHour: 700,
    bookedTimeSlots: []
  },
  {
    name: "Tesla Model 3",
    image: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Exterior-Hero-Desktop-LHD.jpg",
    capacity: 5,
    fuelType: "Electric",
    rentPerHour: 1000,
    bookedTimeSlots: []
  },
  {
    name: "Hyundai Creta",
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Creta/Highlights/mob/cretagalleryb10.jpg",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 600,
    bookedTimeSlots: []
  },
  {
    name: "Mahindra XUV700",
    image: "https://auto.mahindra.com/on/demandware.static/-/Sites-mahindra-product-catalog/default/dwb2e1f2a8/images/X700/hires/AX7_StealthBlack_1366x443.png",
    capacity: 7,
    fuelType: "Petrol",
    rentPerHour: 800,
    bookedTimeSlots: []
  },
  {
    name: "Maruti Suzuki Swift",
    image: "https://www.marutisuzuki.com/js/arenabrandjs/threesixtyjs/img/blue_black_dual_tone/suzuki_swift_ext_360_blue_black_dual_tone_v-1_5.webp",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 400,
    bookedTimeSlots: []
  },
  {
    name: "Kia Seltos",
    image: "https://www.kia.com/content/dam/kia2/in/en/images/360vr/seltos/tiw51mc5fhh409/exterior/gb3/05-d.png",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 650,
    bookedTimeSlots: []
  },
  {
    name: "MG Hector",
    image: "https://www.mgmotor.co.in/content/dam/mgmotor/images/hc-img-dsc-0817.png",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 750,
    bookedTimeSlots: []
  },
  {
    name: "Tata Nexon EV",
    image: "https://s7ap1.scene7.com/is/image/tatapassenger/IntensiTeal-0-2?$PO-850-600-S$&fit=crop&fmt=avif-alpha",
    capacity: 5,
    fuelType: "Electric",
    rentPerHour: 850,
    bookedTimeSlots: []
  },
  {
    name: "Ford EcoSport",
    image: "https://imgd.aeplcdn.com/664x374/cw/ec/40369/Ford-EcoSport-Right-Front-Three-Quarter-159249.jpg?wm=0&q=80",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 550,
    bookedTimeSlots: []
  },
  {
    name: "Renault Duster",
    image: "https://imgd.aeplcdn.com/1280x720/cw/specialVersions/5269.jpg?v=20170503105011&q=80",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 500,
    bookedTimeSlots: []
  },
  {
    name: "Skoda Kushaq",
    image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Skoda/Kushaq/11795/1741783334851/front-left-side-47.jpg",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 680,
    bookedTimeSlots: []
  },
  {
    name: "Volkswagen Taigun",
    image: "https://www.volkswagenlabs.co.in/app/site/tiguan-r-line-testdrive/assets/images/tigunarline-crosslink-image.jpg",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 690,
    bookedTimeSlots: []
  },
  {
    name: "Jeep Compass",
    image: "https://www.jeep-india.com/content/dam/cross-regional/apac/jeep/en_in/compass/Compass-satd-1-031023.jpg.img.1200.jpg",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 900,
    bookedTimeSlots: []
  },
  {
    name: "BMW X1",
    image: "https://www.bmw-kunexclusive-bengaluru.in/sites/default/files/2023-01/X1%20sDrive18d_3.png",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 1200,
    bookedTimeSlots: []
  },
  {
    name: "Mercedes-Benz GLA",
    image: "https://media.oneweb.mercedes-benz.com/images/dynamic/europe/IN/247787/804/iris.png?q=COSY-EU-100-1713d0VXqaW7qtyO67PobzIr3eWsrrCsdRRzwQZg9pZbMw3SGtGeOtsd2HdcUfp8qXGEubmJ0l3otOB2NMEbApjtwI5ux5xQC31SrkzNBzkm7jAc3hKViSF%25vq4tTyLRgLFYaxPNVrH1entn8wYOxoiZr7XM4FACuTg95vp6PDCIoSeWHmWtsd8oxcUfiXyXGE45jJ0lgCZOB2znobQOxf5Ikb7oxQC3PsXkzN5t6m7jK7IhKVvsQ%25vqLJcyLRa3mYaBEUVmMDZfrE820hxHxXr1RjijhWh5DvaAFCDGp0wMkULc&BKGND=9&IMGT=P27&cp=U7lLKRUtPa6KAFr8s_ubHw&uni=m&POV=BE320",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 1500,
    bookedTimeSlots: []
  },
  {
    name: "Audi Q3",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2020_Audi_Q3_S_Line_35_TFSi_MHEV_S-A_1.5_Front_%281%29.jpg/960px-2020_Audi_Q3_S_Line_35_TFSi_MHEV_S-A_1.5_Front_%281%29.jpg",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 1400,
    bookedTimeSlots: []
  },
  {
    name: "Maruti Suzuki Ertiga",
    image: "https://www.popularmaruti.com/storage/upload/vehicle/colors/1650456604_prime-oxford-blue.png",
    capacity: 7,
    fuelType: "Petrol",
    rentPerHour: 600,
    bookedTimeSlots: []
  },
  {
    name: "Hyundai Verna",
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Highlights/vernapoolside1.jpg",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 620,
    bookedTimeSlots: []
  },
  {
    name: "Tata Harrier",
    image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Harrier-EV/9564/1749033646022/front-left-side-47.jpg?tr=w-664",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 800,
    bookedTimeSlots: []
  },
  {
    name: "Kia Carens",
    image: "https://www.kia.com/content/dam/kia2/in/en/images/360vr/clavis/tyw7k8g18tt192/exterior/abp/05-d.png",
    capacity: 7,
    fuelType: "Petrol",
    rentPerHour: 750,
    bookedTimeSlots: []
  },
  {
    name: "MG ZS EV",
    image: "https://www.mgmotor.co.in/content/dam/mgmotor/images/zs-img-dsc-0308.png",
    capacity: 5,
    fuelType: "Electric",
    rentPerHour: 950,
    bookedTimeSlots: []
  },
  {
    name: "Nissan Magnite",
    image: "https://www-asia.nissan-cdn.net/content/dam/Nissan/in/vehicles/new-magnite/VISIA%2B_VLP_V1.png",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 580,
    bookedTimeSlots: []
  },
  {
    name: "Honda Amaze",
    image: "https://www.hondacarindia.com/web-data/models/2024/newAmaze/exterior360Desktop/AMAZE_EXT_360_METEROID_GREY_METALLIC_V-3__00006.png",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 520,
    bookedTimeSlots: []
  },
  {
    name: "Ford Endeavour",
    image: "https://www.jagranimages.com/images/newimg/11012024/11_01_2024-ford_endeavour_23626661.webp",
    capacity: 7,
    fuelType: "Diesel",
    rentPerHour: 1100,
    bookedTimeSlots: []
  }
];


// MongoDB connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
