FROM nginx:alpine
COPY ./scorm-package /usr/share/nginx/html
EXPOSE 80