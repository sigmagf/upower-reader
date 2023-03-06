clean:
	rm -rf dist

build: clean
	yarn build
	cp src/types/index.d.ts dist/index.d.ts
	rm -rf dist/test.js

link: build
	yarn link

publish-github: build
	npm publish --registry="https://npm.pkg.github.com"
	