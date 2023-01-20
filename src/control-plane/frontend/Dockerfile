
FROM public.ecr.aws/docker/library/node:16.13.2 AS builder
COPY frontend /tmp/frontend/
RUN cd /tmp/frontend && npm install && npm run build

FROM public.ecr.aws/docker/library/nginx:1.23-alpine
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=builder /tmp/frontend/build/ /usr/share/nginx/public/
COPY src/control-plane/frontend/config/ /etc/nginx/
CMD ["nginx", "-g", "daemon off;"]