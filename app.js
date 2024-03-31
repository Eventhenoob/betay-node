const express = require("express");
const mongoose = require("mongoose");
const News = require("./model/News");
const multer = require("multer");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const sendMail = require("./Mailer");
dotenv.config({ path: "./.env.local" });

app.use(express.static("./Images"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    const newName = Date.now() + path.extname(file.originalname);
    cb(null, newName);
    req.body.newImgName = newName;
  },
});

const upload = multer({ storage: storage });

mongoose.connect("mongodb://localhost:27017/news", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server side!" });
});

app.post("/news", upload.single("image"), (req, res) => {
  try {
    console.log(req.body);
    if (
      !req.body.title ||
      !req.body.createdBy ||
      !req.body.content ||
      !req.body.key ||
      !req.body.newImgName ||
      !req.body.shortDescription
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    if (process.env.key !== req.body.KEY) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const newsData = {
      title: req.body.title,
      createdBy: req.body.createdBy,
      image: `http://91.108.113.110:3010/` + req.body.newImgName,
      content: req.body.content,
      shortDescription: req.body.shortDescription,
    };
    const news = new News(newsData);
    news.save();
    res.status(201).json({ message: "News created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/news", async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const news = await News.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalPages: Math.ceil(totalNews / limit),
      totalNews: totalNews,
      data: news,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/news/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    res.status(200).json({
      data: news,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/mail", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(401)
        .json({ message: "Please provide all the required fields" });
    }
    await sendMail(name, email, message);
    res.status(200).json({ message: "Mail sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(3010, "0.0.0.0", () => {
  console.log("Server is running...");
});
