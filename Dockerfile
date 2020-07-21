FROM node:12
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
RUN ./node_modules/bower/bin/bower install --allow-root --force-latest
RUN export NODE_ENV=production
RUN export mongoURI=mongodb://0.0.0.0/choregg
EXPOSE 3000
CMD ["npm","start"]

