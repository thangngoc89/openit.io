FROM nginx:alpine

COPY nginx.conf /etc/nginx/
RUN mkdir -p /usr/template
COPY template /usr/template
EXPOSE 80
