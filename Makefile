TS=xiterable.ts
JS=xiterable.js
MJS=xiterable.mjs
DTS=xiterable.d.ts

all: $(JS)

$(JS): $(TS)
	tsc -d --target es6 $(TS)

test: $(JS)
	mocha --require esm

clean:
	-rm $(DTS) $(MJS) $(JS)
