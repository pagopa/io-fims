# Step 1 - Compile code
FROM node:20.12.0-alpine as build

WORKDIR /app

COPY --chown=node:node . /app
RUN yarn --frozen-lockfile && yarn run build

# Step 2 - Prepare production image
FROM node:20.12.0-alpine

USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/dist /app/package.json /app/yarn.lock /app/

ENV NODE_ENV=production
ENV LOG_LEVEL=silly
ENV PORT=3000
ENV SERVER_HOSTNAME=0.0.0.0
ENV APPLICATION_NAME=fims-rp

RUN yarn --frozen-lockfile && yarn cache clean --force

EXPOSE 3000
CMD ["node", "/app/src/main.js"]
