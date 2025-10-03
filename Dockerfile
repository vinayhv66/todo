# Use an official node.js runtime as a parent image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY package*.json .
COPY prisma ./prisma

# Install system dependencies required by Prisma on Debian and then install node deps
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && \
  rm -rf /var/lib/apt/lists/* && \
  npm ci || npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client after all files are in place
RUN node -v || true; npm -v || true; which npm || true; which node || true; ls -la node_modules/.bin || true; npx -v || true; npx prisma -v || true; ./node_modules/.bin/prisma -v || true
RUN npm run build

# Expose the port that the app runs on
EXPOSE 5000

# Define the command to run your application with migrations applied via npm
CMD ["npm", "run", "start"]