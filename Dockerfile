FROM node:20.5.1-slim

USER root

RUN npm install -g @nestjs/cli@10.1.17

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]