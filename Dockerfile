FROM node:0.10

COPY . /app

RUN npm install -g bower
RUN cd /app; npm install; bower install --allow-root;

WORKDIR /app

EXPOSE 5000

CMD ["node", "/app/app.js"]
