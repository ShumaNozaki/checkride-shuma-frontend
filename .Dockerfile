# ビルド用ステージ
FROM node:22 AS builder

WORKDIR /app

# パッケージファイルを先にコピーして依存インストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# ビルド実行（Viteだと dist フォルダに出力）
RUN npm run build

# 本番用イメージ（軽量なNginxを使用）
FROM nginx:stable-alpine

# ビルド結果をNginxの公開フォルダへコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# 80番ポートを開放
EXPOSE 80

# Nginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]
