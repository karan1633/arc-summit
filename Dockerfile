# Use an official Node.js runtime as the base image
FROM node:20-alpine 
# Set the working directory in the container
WORKDIR /app
# Clone the Summit repository
RUN git clone --branch arc-summit-staging https://github.com/karan1633/arc-summit
# Change directory to the 'theme' folder
WORKDIR /app/summit/themes
# Clone the fancy gold repository
RUN git clone --branch develop https://github.com/summit-webapp-themes/fancy-gold
# Change directory to the 'fancy-gold' folder
WORKDIR /app/summit/themes/fancy-gold
# Run the theme installation script
RUN /bin/bash install-theme.sh
# Change directory back to the root of your project
WORKDIR /app/summit
# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
# Install project dependencies
RUN npm install
RUN npm i sharp
# Delete the 'themes' folder to clean up
RUN rm -rf /app/summit/themes
# Copy the rest of your application's files to the container
COPY . .
# Build the Next.js application
RUN npm run build
# Expose the port your Next.js application will run on
EXPOSE 3000
# Start the Next.js application
CMD ["npm", "start"]