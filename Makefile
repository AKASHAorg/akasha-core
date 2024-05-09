build:	install
clean:
	rm -rf ./dist && \
	yarn clean:all
install:
	export NODE_OPTIONS='--max-old-space-size=4096' && \
  export NODE_ENV='production' && \
	yarn build:all
build.staging.feed:
	export NODE_OPTIONS='--max-old-space-size=4096' && \
  export NODE_ENV='production' && \
	yarn world:deploy
build.staging.feed.static:	build build.staging.feed
build.staging.storybook:
	yarn run build:storybook
build.staging.storybook.static:	install build.staging.storybook


