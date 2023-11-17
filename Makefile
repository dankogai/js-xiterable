PJ=package.json
TS=xiterable.ts
JS=xiterable.js
MJS=xiterable.mjs
DTS=xiterable.d.ts

all: $(JS)

$(JS): $(PJ) $(TS)
	tsc -d --module nodenext $(TS)

test: $(PJ) $(JS)
	mocha

clean:
	-rm $(DTS) $(MJS) $(JS)
