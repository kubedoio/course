FROM python:3.12-alpine

WORKDIR /app
COPY progress_api.py /app/progress_api.py

ENV PROGRESS_DB_PATH=/data/progress.sqlite3
EXPOSE 8090

CMD ["python", "/app/progress_api.py"]
