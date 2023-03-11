# EXP_FUNC = "['_add','_myRandom', 'getValue', 'setValue', '_mulBy2', '_malloc', '_free']"
EXP_FUNC = "['getValue', 'setValue','_malloc','_free']"
# EXP_FUNC = "['_main']"

all:
test: test.cpp
	em++ -O2 -s EXPORTED_FUNCTIONS=$(EXP_FUNC) -s WASM=0 -s EXPORT_ALL=1 -s ERROR_ON_UNDEFINED_SYMBOLS=1 test.cpp -o ../public/test.js
random: random.cpp
	em++ -O2 -s EXPORTED_FUNCTIONS=$(EXP_FUNC) -s WASM=0 -s EXPORT_ALL=1 -s ERROR_ON_UNDEFINED_SYMBOLS=1 random.cpp -o ../public/random.js
clean:
	rm -f *.wasm
	rm -f *.js