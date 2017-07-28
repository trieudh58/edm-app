FROM node:latest
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 2052
CMD node app.js