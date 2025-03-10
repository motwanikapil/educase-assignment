const { db } = require("../utils/db");
require("../models/schools.model");
const haversine = require("haversine-distance");

async function getAllSchools(req, res) {
  const { lat, long } = req.query;

  // Validate input
  const latitude = Number(lat);
  const longitude = Number(long);

  if (
    !latitude ||
    !longitude ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res
      .status(400)
      .json({ message: "Add appropriate latitude and longitude" });
  }

  db.query("SELECT * FROM schools", (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return res.status(500).send("Error fetching schools");
    }

    // Reference point (school's location)
    const schoolLocation = { latitude, longitude };

    // Calculate Haversine distance and sort results
    const sortedSchools = results
      .map((school) => {
        const userLocation = {
          latitude: Number(school.latitude),
          longitude: Number(school.longitude),
        };

        // Compute distance
        const distance = haversine(userLocation, schoolLocation);

        return { ...school, distance };
      })
      .sort((a, b) => a.distance - b.distance); // Sort by nearest distance

    res.json({ schools: sortedSchools });
  });
}

async function addNewSchool(req, res) {
  const { name, address, latitude, longitude } = req.body;
  db.query(
    "INSERT INTO schools(name,address,latitude,longitude) values(?,?,?,?)",
    [name, address, latitude, longitude],
    (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).send("Error fetching schools");
      }
      res.json({ message: results });
    }
  );
}

module.exports = { getAllSchools, addNewSchool };
