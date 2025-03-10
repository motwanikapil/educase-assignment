require("dotenv").config();
require("./utils/db");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const app = express();

const schoolRoutes = require("./routes/schools.routes");

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/", schoolRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
