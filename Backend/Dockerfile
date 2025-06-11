

# Use Node.js 22 as the base image
FROM node:22.11.0

# Set the working directory inside the container
# Instead of /Backend
WORKDIR /app

# New project? 🚀 No need to copy package.json initially—create it inside the container.
#Existing project? ✅ Yes, copy package.json first for efficient caching.
# COPY package.json package-lock.json ./
COPY package.json package-lock.json ./  
# Install dependencies (without unnecessary cache files)
RUN npm install --omit=dev
# Copy the rest of the backend code
COPY . .
# Expose the backend port .env file 
EXPOSE 8000

# Run the setup command when the container starts . in production,
CMD ["sh", "-c", "npx prisma migrate && npm run generate && npm run start"]
