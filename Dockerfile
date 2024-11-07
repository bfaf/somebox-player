FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN corepack enable
RUN yarn
RUN yarn build:web
# Production
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/nginx/proxy_params /etc/nginx/proxy_params
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

