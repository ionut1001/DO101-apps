FROM node:10-alpine
WORKDIR /routes
COPY . .
RUN yarn install --production
CMD ["node", "./bin/www"]