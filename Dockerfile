# こちらのイメージには node と npm と yarn が入っています
FROM node:lts-alpine

# git と curl をインストール
# alpine版は apt-get ではなく、apkを使います
RUN apk update && apk add --virtual=module curl git

WORKDIR /usr/src/app