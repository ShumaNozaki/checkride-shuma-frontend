# # --- ビルドステージ ---
# FROM docker.io/library/node:22 AS build

# WORKDIR /app

# # package.json と lockファイルを先にコピー（キャッシュ効率化）
# COPY package*.json ./

# # lockファイルがない場合は install
# RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# # 残りのソースコードをコピー
# COPY . .

# # Vite のビルド
# RUN npm run build

# # --- 本番ステージ ---
# FROM docker.io/library/nginx:alpine

# # ビルド成果物をコピー
# COPY --from=build /app/dist /usr/share/nginx/html

# # SPA対応の nginx 設定
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]



# # Node.js 22 の公式イメージをベースに使用
# FROM node:22

# # 作業ディレクトリを設定
# WORKDIR /usr/src/app

# # 依存関係定義ファイルを先にコピー（キャッシュのため）
# ENV npm_config_cache=/tmp/.npm
# COPY package*.json ./

# # # ビルド（省略したい場合はこれを削除）
# # # RUN npm run build
# # npm ci を使って依存関係をインストール（package-lock.jsonがある前提）
# RUN npm install


# # アプリケーションのソースコードをコピー
# COPY . .

# # ポートを開放（アプリに応じて変更、Expressなら通常3000）
# EXPOSE 5173

# # アプリケーションを起動（package.json の "start" に依存）
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

# # Node.js の公式イメージを使用（バージョンは必要に応じて変更）
# FROM node:22

# # Instana を無効化
# ENV INSTANA_DISABLE=true

# # 作業ディレクトリを作成
# WORKDIR /app

# # package.json と package-lock.json をコピー
# COPY package*.json ./

# # 依存関係をインストール
# RUN npm install

# # アプリケーションのソースコードをコピー
# COPY . .

# # 必要に応じてポートを公開
# EXPOSE 3000

# # アプリケーションを起動
# CMD ["npm", "start"]

# build stage
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
