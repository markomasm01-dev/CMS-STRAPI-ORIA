const fs = require('fs');
const path = require('path');

// Ensure 'logs' directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Open log file stream (append mode)
const logStream = fs.createWriteStream(path.join(logDir, 'strapi.log'), { flags: 'a' });

// Store original write functions
const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

// Redirect stdout
process.stdout.write = function (chunk, encoding, callback) {
  const text = chunk.toString();
  logStream.write(`[INFO] [${new Date().toISOString()}] ${text}`);
  return originalStdoutWrite.apply(process.stdout, arguments);
};

// Redirect stderr
process.stderr.write = function (chunk, encoding, callback) {
  const text = chunk.toString();
  logStream.write(`[ERROR] [${new Date().toISOString()}] ${text}`);
  return originalStderrWrite.apply(process.stderr, arguments);
};

// Load .env file manually if it exists
const dotenvPath = path.join(__dirname, '.env');
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  });
}

// Start Strapi
const { createStrapi } = require('@strapi/strapi');
createStrapi({
  appDir: __dirname,
  distDir: path.join(__dirname, 'dist')
}).start();
