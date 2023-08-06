FROM nginx:1.25.1-alpine
# remove existing default.conf
RUN rm /etc/nginx/conf.d/default.conf
#replace with your configuration
COPY server.conf /etc/nginx/conf.d/default.conf