FROM node:12-stretch
USER node
RUN mkdir /home/node/code
WORKDIR /home/node/code
# copy package info, so that node_modules is only build when package info is changed, not when src code is changed
COPY --chown=node:node package-lock.json package.json ./
RUN npm ci
# copy everything
COPY --chown=node:node . .
CMD ["node","index.js"]
