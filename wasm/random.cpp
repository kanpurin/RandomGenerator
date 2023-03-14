#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <random>
#include <time.h>
#include <vector>
#include <stdio.h>
#include <numeric>
#include <unordered_set>
#include <queue>

std::random_device rd;
std::mt19937 gen(rd());

extern "C" {
	void EMSCRIPTEN_KEEPALIVE randomArray(int* a, int n, int l, int r) {
		std::uniform_int_distribution<> dist(l,r);
		for (int i = 0; i < n; i++) {
			a[i] = dist(gen);
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomPermutation(int* a, int n, int l, int r) {
		r -= l-1;
		if (r<10*n) {
			int *b;
			b = (int*)malloc(sizeof(int)*r);
			std::iota(b, b + r, 1);
			for (int i = 0; i < r-1; i++) {
				std::uniform_int_distribution<> dist(0,r-i-1);
				int t = dist(gen);
				if (t == 0) continue;
				std::swap(b[i],b[t+i]);
			}
			for (int i = 0; i < n; i++) a[i] = b[i]+l-1;
			free(b);
		}
		else {
			std::uniform_int_distribution<> dist(1,r);
			std::unordered_set<int> st;
			for (int i = 0; i < n; i++) {
				int t = dist(gen);
				if (st.find(t) != st.end()) continue;
				a[i] = t+l-1;
				st.insert(t);
			}
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomBalancedBracketSequences(int* a, int n) {
		int _n = n, _m = n;
		for (int i = 0; i < 2*n; i++) {
			std::uniform_int_distribution<long long> dist(1,(long long)(_n-_m+1)*(_n+_m));
			long long t = dist(gen);
			if (t <= (long long)(_n-_m)*(_n+1)) {
				a[i] = 1;
				_n--;
			}
			else {
				a[i] = 0;
				_m--;
			}
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomLabeledTree(int *a, int n) {
		int *p;
		p = (int*)malloc(sizeof(int)*(n-2));
		randomArray(p,n-2,1,n);
		std::vector<int> cnt(n);
		for (int i = 0; i < n-2; i++) {
			cnt[p[i]-1]++;
		}
		std::priority_queue<int,std::vector<int>,std::greater<int>> pq;
		for (int i = 0; i < n; i++) {
			if (cnt[i] == 0) pq.push(i+1);
		}
		for (int i = 0; i < n-2; i++) {
			int q = pq.top(); pq.pop();
			a[2*i] = p[i];
			a[2*i+1] = q;
			cnt[p[i]-1]--;
			if (cnt[p[i]-1] == 0) pq.push(p[i]);
		}
		int x = pq.top(); pq.pop();
		int y = pq.top(); pq.pop();
		a[2*n-4] = x;
		a[2*n-3] = y;
		free(p);
	}
}