#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
// #include <vector>

extern "C" {
  int EMSCRIPTEN_KEEPALIVE add(int a, int b) {
    return a + b;
  }
  
  int EMSCRIPTEN_KEEPALIVE myRandom() {
    return rand();
  }

	void EMSCRIPTEN_KEEPALIVE mulBy2(int* a, int len) {
		for (int i = 0; i < len; i++) {
			a[i] *= 2;
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomArray(int* a, int len) {
		for (int i = 0; i < len; i++) {
			a[i] = myRandom();
		}
	}
	
	// std::vector<int> get_vertor() {
	// 	return {1,2,3,4,5};
	// }
}



// #include <iostream>

// int main() {

//     for (auto it = vec.begin(); it != vec.end(); ++it) {
//         std::cout << *it << " ";
//     }
//     std::cout << std::endl;

//     return 0;
// }