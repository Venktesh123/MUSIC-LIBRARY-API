const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const dbConnect = require("./Config/dbConnect");
const authrouter = require("./router/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const adminRouter = require("./router/adminAPI");
const updateUser = require("./router/userRoutes");
const artistRouter = require("./router/artistRouter");
app.use(express.json());
const PORT = process.env.PORT || 5000;
dbConnect();
app.use("/api/auth", authrouter);
app.use(authMiddleware);
app.use("/api/update", updateUser);
app.use("/api/v1", adminRouter);
app.use("/artist/api/v1", artistRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Eroor in running server ${PORT}`);
    return;
  } else {
    console.log(`Server is running on port ${PORT}`);
    return;
  }
});
