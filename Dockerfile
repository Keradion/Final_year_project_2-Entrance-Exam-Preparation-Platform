# backend/Dockerfile
# What: This file is a blueprint for creating a Docker image for our Node.js backend application.
# Why: A Dockerfile standardizes the application's environment, ensuring that it runs identically
#      everywhere (development, testing, production). It packages the application, its dependencies,
#      and its runtime into a single, portable image.
# How: The instructions below are executed in order by Docker to build the image.

# 1. Base Image: Start from an official Node.js image.
#    'node:18-alpine' is a lightweight version, which results in a smaller final image.
FROM node:18-alpine

# 2. Working Directory: Set the working directory inside the container.
#    All subsequent commands will be run from this directory.
WORKDIR /usr/src/app

# 3. Copy package files: Copy the package.json and package-lock.json files from the backend directory.
COPY backend/package*.json ./

# 4. Install Dependencies: Install the application's npm dependencies.
RUN npm install

# 5. Copy Application Code: Copy the rest of the backend source code into the container.
COPY backend/ ./

# 6. Expose Port: Inform Docker that the container listens on port 5000 at runtime.
EXPOSE 5000

# 7. Start Command: The command to run when the container starts.
#    'npm run dev' will start the server using nodemon, which enables hot-reloading.
CMD [ "npm", "run", "dev" ]
