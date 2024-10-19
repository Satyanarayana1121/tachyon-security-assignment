# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application for production
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "build"]
