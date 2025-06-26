# This Dockerfile is for your Node.js backend.
# It should be placed inside your 'backend' directory.

# Use an official Node.js image as a parent image.
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your backend application code to the working directory
COPY . .

# Your app binds to port 5000, so you need to expose it
EXPOSE 5000

# Use the 'serve' script from your package.json to run the app.
CMD [ "npm", "run", "serve" ]
