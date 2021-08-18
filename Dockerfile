FROM harbor.wks.wistron.com.cn/base_image/nginx:alpine
COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80