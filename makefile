.PHONY

install:rm_server_dist cp_server_dist
	sudo npm run prod

rm_server_dist:
	sudo rm -rf ~/Projects/jdnote/cmd/server/dist/

cp_server_dist:
	sudo cp -r dist/ ~/Projects/jdnote/cmd/server/

