build:	install build.all
build.tsc: build.tsc.sdk build.tsc.ui
build.all: build.tsc build.sdk build.translations build.ui
build.tsc.sdk:
	npm run tsc:sdk
build.tsc.ui:
	npm run tsc:ui
build.sdk:
	npm run build:sdk
build.ui:
	npm run pack:ui
build.feed-app:
	npm run build:feed-app
clean:
	rm -rf ./examples/ui/feed-app/public/*.js && \
	rm -rf ./ui/build && \
	npm run clean -- --y
install:
	npm install && \
	npm run bootstrap
build.staging.feed:
	./node_modules/.bin/lerna run build:staging --scope @akashaproject/ethereum.world
build.staging.feed.static: build build.staging.feed
build.staging.storybook:
	./node_modules/.bin/lerna run build:storybook
build.staging.storybook.static: install build.tsc.ui build.staging.storybook
build.translations:
	npm run extract:translations
start.awf-api:
	docker-compose up -d
stop.awf-api:
	docker-compose stop awf-api couchbase sync-gateway
