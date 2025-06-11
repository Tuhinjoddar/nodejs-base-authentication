
# Frontend dockerfile it also need to node.
FROM node:22.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package.json package-lock.json ./

# Install dependencies (without unnecessary cache files)
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Build the frontend (needed for production)
RUN npm run build

# Expose port 
EXPOSE 3238

# Start the Vite development server
#CMD ["npm", "run", "dev"]

# Use Vite's built-in preview server use production
CMD ["npm", "run", "dev"]


