import os

os.environ["REDIS_URL"] = "127.0.0.1"
os.environ["REDIS_PORT"] = "6379"
os.environ["REDIS_PASSWORD"] = ""

# 環境変数の一覧を取得して表示する
for key, value in os.environ.items():
    print(f'{key}: {value}')