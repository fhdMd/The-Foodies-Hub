# This Dockerfile is for your Next.js frontend.
# It runs the application in development mode to bypass production build issues.

# Use the 'slim' version of the Node.js image for better compatibility.
FROM node:18-slim

# Set the working directory inside the container.
WORKDIR /app

# Configure npm to disable strict SSL verification globally within the container.
# This must be done BEFORE any network requests.
RUN npm config set strict-ssl false

# Copy package.json and the lock file (if it exists).
# A .dockerignore file should prevent your local node_modules from being copied.
COPY package*.json ./

# Install all dependencies, including devDependencies needed for the dev server.
RUN npm install

# Copy the rest of your application source code.
COPY . .

# Expose the port the Next.js development server runs on.
EXPOSE 3000

# The command to start the Next.js development server, which is the same as your local command.
# This uses the "dev" script from your package.json, which includes the necessary flags.
CMD ["npm", "run", "dev"]
