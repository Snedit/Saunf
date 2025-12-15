import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import swaggerSpec from "./docs/swagger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import swaggerUi from "swagger-ui-express";
// Middleware
import errorHandler from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

 
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentRoutes);


 
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

 
app.use(errorHandler);

 
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
