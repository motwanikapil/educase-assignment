const { db } = require("../utils/db");
const haversine = require("haversine-distance");

async function getAllSchools(req, res) {
  const { lat, long } = req.query;

  // Validate input
  const latitude = Number.parseFloat(lat);
  const longitude = Number.parseFloat(long);

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

    // Reference point (user's location)
    const userLocation = { latitude, longitude };

    // Calculate Haversine distance and sort results
    const sortedSchools = results
      .map((school) => {
        const schoolLocation = {
          latitude: Number.parseFloat(school.latitude),
          longitude: Number.parseFloat(school.longitude),
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
