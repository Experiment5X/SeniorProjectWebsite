clean:
	rm -rf deploy

deploy: clean
	mkdir deploy
	mkdir deploy/css
	mkdir deploy/images

	cp style/* deploy/css/
	cp images/* deploy/images/

	pug templates/synopsis.pug -o deploy/
	pug templates/index.pug -o deploy/
	pug templates/timecards.pug -o deploy/
	pug templates/domain_model.pug -o deploy/

install: deploy
	make clean
	make deploy
	ssh writingstyle@nitron.se.rit.edu rm -rf ~/public_html/
	scp -r deploy/* writingstyle@nitron.se.rit.edu:~/public_html/
