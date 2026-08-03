const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || 5500);
const HOST = process.argv[3] || process.env.LOCAL_EVALUATOR_HOST || "0.0.0.0";
const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, { "Content-Type": type });
  response.end(body);
}

function fileResponse(response, filePath) {
  fs.readFile(filePath, (error, body) => {
    if (error) return send(response, 404, "Not found.");
    send(response, 200, body, MIME[path.extname(filePath)] || "application/octet-stream");
  });
}

http.createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  if (urlPath === "/course/course-reference.md") {
    return fileResponse(response, path.join(ROOT, "..", "local-agent", "course", "course-reference.md"));
  }
  const localPath = path.normalize(path.join(ROOT, urlPath === "/" ? "index.html" : urlPath));
  const relative = path.relative(ROOT, localPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return send(response, 403, "Forbidden.");
  fileResponse(response, localPath);
}).listen(PORT, HOST, () => {
  console.log(`Local evaluator listening at http://${HOST}:${PORT}`);
});
