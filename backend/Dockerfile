FROM node:21.2.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# ENV NODE_ENV=production
ENV PORT=3300
ENV DATABASE_URL="file:/app/mysql.db"
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
COPY prisma/schema.prisma prisma/
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
COPY prisma/mysql.db .
RUN pnpm run build 
# Deletes the node_modules and reinstalls everything for production
RUN rm -rf ./node_modules
RUN pnpm install --prod

FROM base as deploy
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/mysql.db .

EXPOSE 3300

CMD [ "node", "dist/main.js" ]

# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# COPY . .
# EXPOSE 3300
# RUN chown -R node /usr/src/app
# USER node
# CMD ["npm", "start"]
