# Use official NGINX image
FROM nginx:alpine

# Copy Angular build output to NGINX's html folder
COPY ./dist/techyatrawithvikki /usr/share/nginx/html

# Copy custom NGINX config
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf
