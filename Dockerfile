# Node.js 22 の公式イメージをベースに使用
FROM node:22

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# 依存関係定義ファイルを先にコピー（キャッシュのため）
ENV npm_config_cache=/tmp/.npm
COPY package*.json ./

# # ビルド（省略したい場合はこれを削除）
# # RUN npm run build
# npm ci を使って依存関係をインストール（package-lock.jsonがある前提）
RUN npm install


# アプリケーションのソースコードをコピー
COPY . .

# ポートを開放（アプリに応じて変更、Expressなら通常3000）
EXPOSE 5173

# アプリケーションを起動（package.json の "start" に依存）
CMD ["npm", "start"]


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