FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

# Copy both package.json AND package-lock.json
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

