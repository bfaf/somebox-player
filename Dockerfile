FROM node:20-alpine AS build
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
COPY --from=build /app/nginx/ssl /etc/nginx/ssl/live/somebox.com/
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

