FROM nginx:1.27-alpine

COPY config/lab-nginx/default.conf /etc/nginx/conf.d/default.conf

COPY index.html styles.css /usr/share/nginx/html/
COPY src /usr/share/nginx/html/src
COPY courses /usr/share/nginx/html/courses
COPY images /usr/share/nginx/html/images
COPY v86 /usr/share/nginx/html/v86

EXPOSE 8080
