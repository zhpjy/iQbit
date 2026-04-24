FROM node:20
ENV QBIT_HOST=http://localhost:8080
WORKDIR /usr/src/node-app
COPY . ./
RUN yarn install --frozen-lockfile
RUN yarn build
RUN npm run server-setup

EXPOSE 8081

CMD [ "npm", "run", "server-docker-start" ]
