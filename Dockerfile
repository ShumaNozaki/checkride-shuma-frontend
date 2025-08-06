# FROM node:20.15.1 as build
FROM quay.io/jeffdean/node-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM quay.io/jeffdean/nginx-unprivileged
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
# # 公式 Node.js イメージをベースに
# FROM node:22

# # 作業ディレクトリを設定
# WORKDIR /usr/src/app

# # package.json と package-lock.json をコピー
# COPY package*.json ./

# # 依存関係をインストール
# RUN npm install

# # アプリケーションのソースコードをコピー
# COPY . .

# # ビルド（省略したい場合はこれを削除）
# # RUN npm run build
# RUN npm ci

# # ポート番号（任意のポート番号）
# EXPOSE 3000

# # アプリを起動
# CMD ["npm", "start"]

# # ビルド用ステージ
# FROM node:22 AS builder

# WORKDIR /app

# # パッケージファイルを先にコピーして依存インストール
# COPY package*.json ./
# RUN npm install

# # ソースコードをコピー
# COPY . .

# # ビルド実行（Viteだと dist フォルダに出力）
# RUN npm run build

# # 本番用イメージ（軽量なNginxを使用）
# FROM nginx:stable-alpine

# # ビルド結果をNginxの公開フォルダへコピー
# COPY --from=builder /app/dist /usr/share/nginx/html

# # 80番ポートを開放
# EXPOSE 80

# # Nginxをフォアグラウンドで実行
# CMD ["nginx", "-g", "daemon off;"]