CC = em++
EXP_FUNC = "['getValue', 'setValue','_malloc','_free']"

all: random
random: random.cpp
	$(CC) -O2 -s EXPORTED_FUNCTIONS=$(EXP_FUNC) -s WASM=1 -s EXPORT_ALL=1 -s ERROR_ON_UNDEFINED_SYMBOLS=1 random.cpp -o ../public/random.js
clean:
	rm -f *.wasm
	rm -f *.js