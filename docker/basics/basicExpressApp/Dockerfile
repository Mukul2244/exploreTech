# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD [ "node", "index.js" ]


# --- Stage 1 --- build stage
    FROM node:22-alpine as build

    WORKDIR /app

    COPY package*.json ./

    RUN npm install

    COPY . .

# --- Stage 2 --- production stage 
    FROM node:22-alpine

    WORKDIR /app

    COPY --from=build /app .

    EXPOSE 3000

    CMD [ "node", "index.js" ]