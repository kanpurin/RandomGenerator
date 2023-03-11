#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <random>
#include <time.h>
#include <vector>
#include <stdio.h>

extern "C" {
	void EMSCRIPTEN_KEEPALIVE randomArray(int* a, int n, int l, int r) {
		std::random_device rd;
		std::mt19937 gen(rd());
		std::uniform_int_distribution<> dist(l,r);
		for (int i = 0; i < n; i++) {
			a[i] = dist(gen);
		}
	}
}