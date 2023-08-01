FROM node:20-alpine
WORKDIR /app
RUN addgroup -S user && adduser -S node-user -G user

COPY package*.json ./
# install pm2 runtime
# RUN  npm i pm2
ARG NODE_ENV=developement
# Install dependencies based on NODE_ENV
RUN --mount=type=cache,target=/test-app/.npm \
    npm set cache /test-app/.npm
RUN if [ "${NODE_ENV}" = "developement" ]; then \
    npm install; \
    else \
    npm install --production; \
    fi
# COPY ALL FILES
USER node-user
COPY --chown=node-user:user . .
ENV PORT=3000
EXPOSE 3000
# RUN APPLICATION
CMD ["npm","run","dev"]