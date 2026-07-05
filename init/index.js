require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const mongoUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    const updatedData = await Promise.all(
      initData.data.map(async (obj) => {
        let response;
        try {
          response = await geoCodingClient
            .forwardGeocode({
              query: `${obj.location}, ${obj.country}`,
              limit: 1,
            })
            .send();
        } catch (error) {
          console.error(
            `Geocoding failed for ${obj.location}, ${obj.country}:`,
            error
          );
          return { ...obj, owner: "66567b03fda820235197b582", geometry: null };
        }

        const geometry = response.body.features[0].geometry || null;

        return {
          ...obj,
          owner: "66567b03fda820235197b582",
          geometry,
        };
      })
    );

    await Listing.insertMany(updatedData);
    console.log("DB is initialized");
  } catch (error) {
    console.error("Error initializing DB:", error);
  }
};

initDB();





// const mongoose = require("mongoose");
// const initData = require("./data");
// const Listing = require('../models/listing.js');
// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// require("dotenv").config();
// mongoose.connect(process.env.ATLASDB_URL);
// main()
//    .then(() => {
//       console.log("connected to db");
//    })  
//    .catch((err) => {
//       console.log(err);
//    });

// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

// const initDB = async () =>{
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({...obj, owner: "66a1c580efb2abfd8ed102e6"}));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// }
// initDB();


// require("dotenv").config();

// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const geocodingClient = mbxGeocoding({
//     accessToken: process.env.MAP_TOKEN,
// });

// const mongoose = require("mongoose");
// const initData = require("./data");
// const Listing = require("../models/listing");

// async function main() {
//   try {
//     await mongoose.connect(process.env.ATLASDB_URL);
//     console.log("Connected to Atlas");

//     await initDB();

//     mongoose.connection.close();
//   } catch (err) {
//     console.log(err);
//   }
// }

// const initDB = async () => {
//     await Listing.deleteMany({});

//     const listings = [];

//     for (const obj of initData.data) {

//         const response = await geocodingClient.forwardGeocode({
//             query: `${obj.location}, ${obj.country}`,
//             limit: 1,
//         }).send();

//         listings.push({
//             ...obj,
//             owner: "6a4a76dc83ab714cda5e4da2",
//             geometry: response.body.features[0].geometry,
//         });
//     }

//     await Listing.insertMany(listings);

//     console.log("Database initialized successfully!");
// };

// main();