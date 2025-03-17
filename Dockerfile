# build front-end
FROM node:18 AS frontend

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

COPY ./.env /app

RUN pnpm install

COPY . /app

EXPOSE 3002

CMD ["pnpm", "dev"]

#RUN pnpm run build

# build backend
#FROM node:18 AS backend
#
#RUN npm install pnpm -g
#
#WORKDIR /app
#
#COPY /service/package.json /app
#
#COPY /service/pnpm-lock.yaml /app
#
#COPY ./.env /app
#
#RUN pnpm install
#
#COPY /service /app
#
#RUN pnpm build

# service
#FROM node:18 AS service
#
#RUN npm install pnpm -g
#
#WORKDIR /app

#COPY /service/package.json /app

#COPY /service/pnpm-lock.yaml /app

#COPY ./.env /app

#RUN #pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

#COPY /service /app

#COPY --from=frontend /app/dist /app/public

#COPY --from=backend /app/build /app/build

#FROM nginx:latest
#
#COPY --from=frontend /app/dist /usr/share/nginx/html
#
#EXPOSE 3002
#
#CMD ["nginx", "-g", "daemon off;"]
