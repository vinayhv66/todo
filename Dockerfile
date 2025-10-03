# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY package*.json .
COPY prisma ./prisma

# Install system dependencies required by Prisma on Alpine and then install node deps
RUN apk add --no-cache libc6-compat openssl && \
  npm ci || npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client after all files are in place
RUN npx prisma generate

# Expose the port that the app runs on
EXPOSE 5000

# Define the command to run your application
CMD ["node", "src/server.js"]