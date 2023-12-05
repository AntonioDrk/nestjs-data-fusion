FROM node:21.2.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV ESLINT_NO_DEV_ERRORS=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV PORT=3000
RUN corepack enable
RUN pnpm install -g serve

FROM base AS dependencies
WORKDIR /app
COPY tsconfig.json .
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install

FROM base AS build
WORKDIR /app
# Bundle source
COPY . .
# Gets all dev built dependencies
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build 
# Deletes the node_modules and reinstalls everything for production
RUN rm -rf ./node_modules
RUN pnpm install --prod

FROM base as deploy
WORKDIR /app
COPY --from=build /app/build/ ./build/
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

# Listens by default to port 3000
CMD [ "serve", "-s", "build"]

# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# COPY . .
# EXPOSE 3300
# RUN chown -R node /usr/src/app
# USER node
# CMD ["npm", "start"]
