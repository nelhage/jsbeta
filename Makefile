%.js: %.bin
	perl bin2js.pl $< > $@
