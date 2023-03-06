install:
	yarn install

clean:
	rm -rf dist

build: install clean
	yarn build
	cp src/types/index.d.ts dist/index.d.ts
	rm -rf dist/test.js

link: build
	yarn link
	