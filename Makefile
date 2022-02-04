build:	install build.all
build.tsc: build.tsc.sdk build.tsc.ui
build.all: build.tsc build.sdk build.translations build.ui
build.tsc.sdk:
	yarn run tsc:sdk
build.tsc.ui:
	yarn run tsc:ui
build.sdk:
	export NODE_ENV='production' && \
	yarn run build:sdk
build.ui:
	export NODE_ENV='production' && \
	yarn run pack:ui
build.feed-app:
	yarn run build:feed-app
clean:
	rm -rf ./ui/build && \
	yarn run clean
install:
	yarn install --frozen-lockfile && \
	yarn run bootstrap && \
	yarn run tsc:all
build.staging.feed:
	export NODE_OPTIONS='--max-old-space-size=4096' && \
  export NODE_ENV='production' && \
	yarn run build:ewa
build.staging.feed.static: build build.staging.feed
build.staging.storybook:
	yarn run build:storybook
build.staging.storybook.static: install build.tsc.ui build.staging.storybook
build.translations:
	yarn run extract:translations

