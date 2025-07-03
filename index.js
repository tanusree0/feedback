const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.end();

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Log every request
  const log = `${Date.now()} - ${req.method} ${req.url}\n`;
  fs.appendFileSync("log.txt", log);

  if (path === "/") {
    // Serve the form.html
    fs.readFile("form.html", (err, data) => {
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    });
  }

  else if (path === "/submit") {
    const { name, message } = query;
    if (!name || !message) {
      res.end("Name and message required.");
      return;
    }

    const entry = `Name: ${name}, Message: ${message}, Time: ${new Date().toLocaleString()}\n`;
    fs.appendFile("feedbacks.txt", entry, (err) => {
      if (err) {
        res.end("Failed to save feedback.");
      } else {
        res.end("Thank you for your feedback!");
      }
    });
  }

  else if (path === "/all-feedbacks") {
    fs.readFile("feedbacks.txt", "utf-8", (err, data) => {
      if (err) {
        res.end("No feedback found.");
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.end(data);
      }
    });
  }

  else if (path === "/clear") {
    fs.writeFile("feedbacks.txt", "", () => {
      res.end("All feedbacks cleared.");
    });
  }

  else {
    res.end("404 - Page not found");
  }
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});