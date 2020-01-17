run:
	npx babel-node 'src/bin/gendiff.js'

build:
	rm -rf dist
	npm run build

lint:
	npx eslint .

publish:
	npm publish --dry-run

link:
	sudo npm link

unlink:
	sudo npm unlink

uninstall:
	sudo npm uninstall -g gendiff

test:
	npm test

test-coverage:
	npm test -- --coverage

test-watch:
	npm test -- --watch