const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/receive", function (req, res) {
  const data = {
    username: "accimeesterlin",
    age: 20,
  };

  fs.readFile("post.json", "utf-8", (error, data) => {
    if (error) {
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    } else {
        const result = data.split('\n')
        console.log('Result:', result);
      res.json(JSON.parse(result));
    }
  });
});

app.post("/add", function (req, res) {
  const userData = req.body;
  console.log("Data: ", userData);

  fs.readFile("post.json", 'utf-8', (error, posts) => {
    if (error) {
        fs.appendFile("post.json", JSON.stringify([userData]), (error, data) => {
            if (error) {
              res.status(500).json({
                message: error.message || "Internal server error",
              });
            } else {
              res.json([data]);
            }
          });
    } else {

        if (!posts) {
            fs.appendFile("post.json", JSON.stringify([userData]), (error, data) => {
                if (error) {
                  res.status(500).json({
                    message: error.message || "Internal server error",
                  });
                } else {
                  res.json([data]);
                }
              });
        } else {
            const arr = JSON.parse(posts.toString())
            arr.push(userData)

            fs.writeFile("post.json", JSON.stringify(arr), (error, data) => {
                if (error) {
                  res.status(500).json({
                    message: error.message || "Internal server error",
                  });
                } else {
                    console.log('Data: ', data);
                  res.json(arr);
                }
              });
        }
    }
  });

  
  
});


console.log('PID: ', process.pid);

app.listen(PORT, console.log("Server is starting on PORT ", PORT));
