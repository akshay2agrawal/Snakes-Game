import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import fs from "fs";
const app = express();
const port = 3000;

app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to override method based on _method field
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  try {
    const data = fs.readFileSync("highScore.txt", "utf8");
    res.render("index.ejs", { highScore: data });
  } catch (err) {
    console.error(err);
    res.render("index.ejs", { highScore: 0 });
  }
});

app.post("/save-data/", async (req, res) => {
  let score = req.query.score;
  let maxScore;

  try {
    const data = await fs.promises.readFile("highScore.txt", "utf8");
    maxScore = parseInt(data);
    if (score > maxScore) {
      maxScore = score;
      await updateScore(maxScore);
    }
  } catch (err) {
    maxScore = score;
    await updateScore(maxScore);
  }

  const response = {
    message: "Score saved successfully!",
    highScore: maxScore,
  };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function updateScore(score) {
  try {
    await fs.promises.writeFile("highScore.txt", score);
    console.log("New high score: ", score);
  } catch (err) {
    console.error(err);
  }
}
