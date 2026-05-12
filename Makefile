.PHONY: up down logs clean rebuild-courses

up:
	docker compose up --build

down:
	docker compose down --remove-orphans

logs:
	docker compose logs -f

clean:
	sh scripts/cleanup-environment.sh

rebuild-courses:
	python3 scripts/build-course-data.py
