PJ=package.json
TS=xiterable.ts
JS=xiterable.js
MJS=xiterable.mjs
DTS=xiterable.d.ts

all: $(JS)

$(JS): $(PJ) $(TS)
	tsc -d --target es6 $(TS)

test: $(PJ) $(JS)
	mocha --require esm

clean:
	-rm $(DTS) $(MJS) $(JS)
