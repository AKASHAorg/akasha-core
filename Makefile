build:	install build.all
build.all: build.sdk build.translations build.ui
build.sdk:
	export NODE_ENV='development' && \
	yarn run build:sdk
build.ui:
	export NODE_ENV='development' && \
	yarn run pack:ui
build.feed-app:
	yarn run build:feed-app
clean:
	rm -rf ./ui/build && \
	yarn run clean
install:
	yarn run bootstrap && \
	yarn run tsc:all
build.staging.feed:
	export NODE_OPTIONS='--max-old-space-size=4096' && \
  export NODE_ENV='development' && \
	yarn run build:ewa
build.staging.feed.static: build build.staging.feed
build.staging.storybook:
	yarn run build:storybook
build.staging.storybook.static: install build.staging.storybook
build.translations:
	yarn run extract:translations

