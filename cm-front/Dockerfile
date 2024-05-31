FROM node:20-alpine
WORKDIR /app
COPY . /app/
RUN npm config set registry https://registry.npmmirror.com \
  && npm install pnpm -g \
  && pnpm install \
  && pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=0 /app/node_modules /node_modules
COPY --from=0 /app/.next /.next
COPY --from=0 /app/package.json /
COPY --from=0 /app/public /public 
EXPOSE 3000
CMD ["npm", "run", "start"]

