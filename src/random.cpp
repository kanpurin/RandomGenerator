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
#include <set>
#include <algorithm>
#include <stack>

#define MAX_I_CONNECTED_GRAPH 40

std::random_device rd;
std::mt19937 gen(rd());

// FOR CONNECTED GRAPH
std::vector<double> func_i_connected_graph(MAX_I_CONNECTED_GRAPH+1,1); // i^(i-1)/i!
std::uniform_real_distribution<> realDist(0.0,1.0);
std::vector<double> prob_d_connected_graph(MAX_I_CONNECTED_GRAPH + 1);
std::vector<int> prob_idx_connected_graph(MAX_I_CONNECTED_GRAPH + 1);

long long i2ll(int n1,int n2) {
	return (long long)n1 * 1000000000 + n2;
}

std::pair<int,int> ll2i(long long n) {
	int n1 = n / 1000000000;
	int n2 = n % 1000000000;
	return {n1,n2};
}

bool isprime(long long N) {
    if (N <= 1) return false;
    if (N == 2) return true;
    if (N % 2 == 0) return false;

    auto modpow = [](__int128_t a, long long n, long long mo) {
        __int128_t r = 1;
        a %= mo;
        while (n) r = r * ((n % 2) ? a : 1) % mo, a = a * a % mo, n >>= 1;
        return r;
    };

    std::vector<long long> A = {2, 325, 9375, 28178, 450775,
                           9780504, 1795265022};
    long long s = 0, d = N - 1;
    while (d % 2 == 0) d >>= 1, s++;

    for (long long a : A) {
        if (a % N == 0) return true;
        long long j, r = modpow(a, d, N);
        if (r == 1) continue;
        for (j = 0; j < s; j++) {
            if (r == N - 1) break;
            r = __int128_t(r) * r % N;
        }
        if (j == s) return false;
    }
    return true;
}

template<typename T>
std::vector<T> __randomArray(int n,T l,T r) {
	std::vector<T> v(n);
	std::uniform_int_distribution<T> dist(l,r);
	for (int i = 0; i < n; i++) {
		v[i] = dist(gen);
	}
	return v;
}

template<typename T>
std::vector<T> __randomPermutation(int n, T l, T r) {
	std::vector<T> v(n);
	r -= l-1;
	if (r<10*n) {
		std::vector<T> b(r);
		std::iota(b.begin(), b.end(), 1);
		for (int i = 0; i < r-1; i++) {
			std::uniform_int_distribution<T> dist(0,r-i-1);
			T t = dist(gen);
			if (t == 0) continue;
			std::swap(b[i],b[t+i]);
		}
		for (int i = 0; i < n; i++) v[i] = b[i]+l-1;
	}
	else {
		std::uniform_int_distribution<T> dist(1,r);
		std::unordered_set<T> st;
		int cnt = 0;
		while(cnt < n) {
			long long t = dist(gen);
			if (st.find(t) != st.end()) continue;
			v[cnt] = t+l-1;
			st.insert(t);
			cnt++;
		}
	}
	return v;
}

long long __edge2idForConnectedGraph(int u,int v, int n) {
    if (u > v) std::swap(u,v);
    return (long long)u*n+v;
}

template< typename T >
struct BinaryIndexedTree {
    std::vector< T > data;

    BinaryIndexedTree() {}

    BinaryIndexedTree(int sz) {
        data.assign(++sz, 0);
    }

    BinaryIndexedTree(std::vector< T > &vec) {
        data.assign(vec.size()+1,0);
        copy(vec.begin(), vec.end(), data.begin()+1);
        for (int i = 1; i < data.size(); i++) {
            if (i + (i & -i) < data.size()) data[i + (i & -i)] += data[i];
        }
    }

    // [0,k)
    inline T sum(int k) const {
        T ret = 0;
        for (k; k > 0; k -= k & -k) ret += data[k];
        return (ret);
    }

    // [left,right)
    inline T sum(int left, int right) const {
        return sum(right) - sum(left);
    }

    // k番目にxを加算
    // 負の数も可
    inline void add(int k, T x) {
        for (++k; k < data.size(); k += k & -k) data[k] += x;
    }

    // [0,x]の和がk以上となる最小のx(0-indexed)
    int lower_bound(T k) const {
        if (k <= 0) return 0;
        int res = 0;
        int N = 1; while (N < (int)data.size()) N *= 2;
        for (int i = N / 2; i > 0; i /= 2) {
            if (res + i < (int)data.size() && data[res + i] < k) {
                k -= data[res + i];
                res += i;
            }
        }
        return res;
    }
};

double __funcIConnectedGraph(int n,int m,int i) {
    double rho = (double)m / n;
    double ans = 1/(2*rho)*exp(-(3*rho-1)/2*i)*func_i_connected_graph[i];
    return ans;
}

// dは昇順で和が1の数列
// 和が1でないときの動作は未定義
int __randomDistribution(const std::vector<double> &d, int n) {
    double t = realDist(gen);
    double sum = 0;
    for (int i = 0; i < n; i++) {
        sum += d[i];
        if (t <= sum) {
            return i;
        }
    }
    assert(false);
    return -1; // error
}

// (n,m)グラフの次の手
int prob(int n, int m) {
    double sum = 0;
    int dsz = 0;
    // 情報落ち回避のために小さい順に足す
    for (int i = std::min(MAX_I_CONNECTED_GRAPH,n-1); i >= 1; i--) {
        double ans = __funcIConnectedGraph(n,m,i);
        if (ans < 1e-10) continue;
        if (2*(m-i) > (long long)(n-i)*(n-i-1)) break;
        prob_d_connected_graph[dsz] = 2*ans;
        prob_idx_connected_graph[dsz] = i;
        sum += 2*ans;
        dsz++;
    }
    prob_d_connected_graph[dsz] = 1-sum;
    prob_idx_connected_graph[dsz] = 0;
    dsz++;
    for (int i = dsz-1; i >= 1; i--) {
        if (prob_d_connected_graph[i-1] 
					> prob_d_connected_graph[i]) {
            std::swap(prob_d_connected_graph[i-1],
					  prob_d_connected_graph[i]);
            std::swap(prob_idx_connected_graph[i-1],
					  prob_idx_connected_graph[i]);
        }
        else break;
    }
    int t = __randomDistribution(prob_d_connected_graph, dsz);
    return prob_idx_connected_graph[t];
}

// まだ追加していない頂点のからadd_edge_cnt本選んで追加
void addEdge(const std::vector<int> &a, 
			 int l, 
			 int r, 
			 int add_edge_cnt, 
			 std::unordered_set<long long> &st) {
    int asz = a.size();
    std::uniform_int_distribution<> dist(l,r-1);
    for (int i = 0; i < add_edge_cnt; i++) {
        while(true) {
            int u = dist(gen);
            int v = dist(gen);
            if (u == v) continue;
            if (a[u] > a[v]) std::swap(u,v);
            long long id = __edge2idForConnectedGraph(a[u],a[v],asz);
            if (st.find(id) != st.end()) continue;
            st.insert(id);
            break;
        }
    }
}


void __treeForConnectedGraph(const std::vector<int> &a, 
							 int l,
							 int r, 
							 std::unordered_set<long long> &st) {
    const int asz = a.size();
    int n = r-l;
    if (n == 1) return;
    if (n == 2) {
        st.insert(__edge2idForConnectedGraph(a[l],a[l+1],asz));
        return;
    }
    std::vector<int> p = __randomArray(n-2,0,n-1); // l~r-1
    std::vector<int> cnt(n);
    for (int i = 0; i < n-2; i++) {
        cnt[p[i]]++;
    }
    std::vector<int> _bit(n);
    for (int i = 0; i < n; i++) {
        if (cnt[i] == 0) _bit[i] = 1;
    }
    BinaryIndexedTree<int> bit(_bit);
    for (int i = 0; i < n-2; i++) {
        int q = bit.lower_bound(1);
        bit.add(q,-1);
        if (p[i] < q) st.insert(__edge2idForConnectedGraph(a[p[i]+l],a[q+l],asz));
        else st.insert(__edge2idForConnectedGraph(a[q+l],a[p[i]+l],asz));
        cnt[p[i]]--;
        if (cnt[p[i]] == 0) bit.add(p[i],1);
    }
    int x = bit.lower_bound(1); bit.add(x,-1);
    int y = bit.lower_bound(1); bit.add(y,-1);
    st.insert(__edge2idForConnectedGraph(a[x+l],a[y+l],asz));
}

class UnionFind {
private:
    std::vector<int> par;
public:
    UnionFind(int n) {
        par.resize(n, -1);
    }

    int root(int x) {
        if (par[x] < 0) return x;
        return par[x] = root(par[x]);
    }

    bool unite(int x, int y) {
        int rx = root(x);
        int ry = root(y);
        if (rx == ry) return false;
        if (size(rx) < size(ry)) std::swap(rx, ry);
        par[rx] += par[ry];
        par[ry] = rx;
        return true;
    }

    bool same(int x, int y) {
        int rx = root(x);
        int ry = root(y);
        return rx == ry;
    }

    int size(int x) {
        return -par[root(x)];
    }
};

void __randomGraph(const std::vector<int> &a, 
				   int l,
				   int r, 
				   int m, 
				   std::unordered_set<long long> &st) {
    int asz = a.size();
    int n = r-l;
    while(true) {
        std::vector<long long> v = __randomPermutation<long long>(m, 0, (long long)n*(n-1)/2-1);
        std::sort(v.begin(), v.end());
        int cnt = 0;
        long long now_cost = 0;
        UnionFind uf(n);
        std::vector<long long> e(m);
        for (int i = 1; i <= n; i++) {
            while(cnt < m && v[cnt] + i + 1 - now_cost <= n) {
                int _u = i-1;
                int _v = (int)(v[cnt] + i + 1 - now_cost)-1;
                if (_u > _v) std::swap(_u,_v);
                e[cnt] = __edge2idForConnectedGraph(a[_u+l],a[_v+l],asz);
                uf.unite(_u,_v);
                cnt++;
            }
            now_cost += n-i;
        }
        if (uf.size(0) != n) continue;
        for (int i = 0; i < m; i++) {
            st.insert(e[i]);
        }
        break;
    }
}

void __randomConnectedGraph(const std::vector<int> &a, 
							int m, 
							std::unordered_set<long long> &st) {
    const int asz = a.size();
    struct RandCG{ int l,r,m,t,add_edge_cnt; };
    std::stack<RandCG> sta;
    sta.push({0,asz,m,0});
    while(!sta.empty()) {
        RandCG rcg = sta.top(); sta.pop();
        int _l = rcg.l;
        int _r = rcg.r;
        int _m = rcg.m;
        int _n = _r - _l;
        int _t = rcg.t;
        int _add_edge_cnt = rcg.add_edge_cnt;
        if (_t == 0) {
            if (_n == 1) continue;
            if (_m == _n - 1) {
                __treeForConnectedGraph(a,_l,_r,st);
                continue;
            }
            if (_n <= 10 || 2*_m>=_n*log(_n)) {
                __randomGraph(a,_l,_r,_m,st);
                continue;
            }
            
            int t = prob(_n,_m);
            int add_edge_cnt = 0;
            while (_n-1 < _m && t == 0) {
                // connected graph[l,r) + one edge[l,r)
                add_edge_cnt++;
                _m--;
                if (_n-1 == _m) break;
                t = prob(_n,_m);
            }
            if (_m == _n-1) {
                __treeForConnectedGraph(a,_l,_r,st);
                addEdge(a,_l,_r,add_edge_cnt,st);
            }
            else if (t == 1) {
                rcg.t = t;
                rcg.add_edge_cnt = add_edge_cnt;
                sta.push(rcg); 
                sta.push({_l + t, _r, _m - t, 0, -1});
            }
            else {
                rcg.t = t;
                rcg.add_edge_cnt = add_edge_cnt;
                sta.push(rcg); 
                sta.push({_l, _l + t, t - 1, 0, -1});
                sta.push({_l + t, _r, _m - t, 0, -1});
            }
        }
        else if (_t == 1) {
            std::uniform_int_distribution<> dist2(_l + _t,_r-1);
            st.insert(__edge2idForConnectedGraph(a[_l],a[dist2(gen)],asz));
        }
        else {
            std::uniform_int_distribution<> dist1(_l,_l+_t-1);
            std::uniform_int_distribution<> dist2(_l+_t,_r-1);
            st.insert(__edge2idForConnectedGraph(a[dist1(gen)],a[dist2(gen)],asz));
        }

        if (_t > 0) addEdge(a,_l,_r,_add_edge_cnt,st);
    }
}

extern "C" {
	void EMSCRIPTEN_KEEPALIVE setSeed(int seed) {
		gen = std::mt19937(seed);
	}

	void EMSCRIPTEN_KEEPALIVE randomArray(int* a, int n, int l, int r) {
		std::vector<int> v = __randomArray<int>(n,l,r);
		for (int i = 0; i < n; i++) {
			a[i] = v[i];
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomPermutation(int* a, int n, int l, int r) {
		std::vector<int> v = __randomPermutation(n,l,r);
		for (int i = 0; i < n; i++) {
			a[i] = v[i];
		}
	}
	
	// |a|:2*n
	void EMSCRIPTEN_KEEPALIVE randomArrayLL(int* a, int n, int l1, int l2, int r1, int r2) {
		long long lower = i2ll(l1,l2);
		long long upper = i2ll(r1,r2);
		std::vector<long long> v = __randomArray<long long>(n, lower, upper);
		for (int i = 0; i < n; i++) {
			auto t = ll2i(v[i]);
			a[i*2] = t.first;
			a[i*2+1] = t.second;
		}
	}
	
	// |a|:2*n
	void EMSCRIPTEN_KEEPALIVE randomPermutationLL(int* a, int n, int l1, int l2, int r1, int r2) {
		long long lower = i2ll(l1,l2);
		long long upper = i2ll(r1,r2);
		std::vector<long long> v = __randomPermutation<long long>(n, lower, upper);
		for (int i = 0; i < n; i++) {
			auto t = ll2i(v[i]);
			a[i*2] = t.first;
			a[i*2+1] = t.second;
		}
	}

    // |a|:2*n, l <= a_{i} < a_{i+1} <= r
	void EMSCRIPTEN_KEEPALIVE randomStrictlyIncreasingArrayLL(int* a, int n, int l1, int l2, int r1, int r2) {
		long long lower = i2ll(l1,l2);
		long long upper = i2ll(r1,r2);
		std::vector<long long> v = __randomPermutation<long long>(n, lower, upper);
        sort(v.begin(), v.end());
		for (int i = 0; i < n; i++) {
			auto t = ll2i(v[i]);
			a[i*2] = t.first;
			a[i*2+1] = t.second;
		}
	}
    
    // |a|:2*n, l <= a_{i} <= a_{i+1} <= r
	void EMSCRIPTEN_KEEPALIVE randomIncreasingArrayLL(int* a, int n, int l1, int l2, int r1, int r2) {
		long long lower = i2ll(l1,l2);
		long long upper = i2ll(r1,r2);
		std::vector<long long> v = __randomPermutation<long long>(n, 0, upper-lower+n-1);
        sort(v.begin(), v.end());
        long long cur = lower;
		for (int i = 0; i < n; i++) {
            if (i == 0) cur += v[0];
            if (i > 0) cur += v[i]-v[i-1]-1;
			auto t = ll2i(cur);
            a[i*2] = t.first;
            a[i*2+1] = t.second;
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

	// priority_queueの代わりにBIT使った方がかなり早い
	void EMSCRIPTEN_KEEPALIVE randomLabeledTree(int *a, int n) {
		std::vector<int> p = __randomArray(n-2,1,n);
		std::vector<int> cnt(n);
		for (int i = 0; i < n-2; i++) {
			cnt[p[i]-1]++;
		}
		std::priority_queue<int,std::vector<int>,std::greater<int>> pq;
		for (int i = 0; i < n; i++) {
			if (cnt[i] == 0) pq.push(i+1);
		}
		std::vector<std::pair<int,int>> ans(n-1);
		for (int i = 0; i < n-2; i++) {
			int q = pq.top(); pq.pop();
			if (p[i] < q) ans[i] = {p[i],q};
			else ans[i] = {q,p[i]};
			cnt[p[i]-1]--;
			if (cnt[p[i]-1] == 0) pq.push(p[i]);
		}
		int x = pq.top(); pq.pop();
		int y = pq.top(); pq.pop();
		ans[n-2] = {x,y};
		// std::sort(ans.begin(), ans.end());
		for (int i = 0; i < n-1; i++) {
			a[2*i] = ans[i].first;
			a[2*i+1] = ans[i].second;
		}
	}
	
	void EMSCRIPTEN_KEEPALIVE randomPrimeLL(int *a, int l1, int l2, int r1, int r2) {
		long long lower = i2ll(l1,l2);
		long long upper = i2ll(r1,r2);
		if (upper-lower+1 <= 10000) {
			std::vector<long long> v;
			for (long long p = lower; p <= upper; p++) {
				if (isprime(p)) v.push_back(p);
			}
			if (v.size() == 0) {
				a[0] = 0;
				a[1] = -1;
			}
			else {
				std::uniform_int_distribution<> dist(0,(int)v.size()-1);
				int t1 = dist(gen);
				auto t2 = ll2i(v[t1]);
				a[0] = t2.first;
				a[1] = t2.second;
			}
		}
		else {
			std::uniform_int_distribution<long long> dist(lower,upper);
			while(true) {
				long long p = dist(gen);
				if (!isprime(p)) continue;
				auto t2 = ll2i(p);
				a[0] = t2.first;
				a[1] = t2.second;
				break;
			}
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomGraph(int *a, int n, int m) {
		std::vector<long long> v = __randomPermutation<long long>(m, 0, (long long)n*(n-1)/2-1);
		std::sort(v.begin(), v.end());
		int cnt = 0;
		long long now_cost = 0;
		for (int i = 1; i <= n; i++) {
			while(cnt < m && v[cnt] + i + 1 - now_cost <= n) {
				a[2*cnt] = i;
				a[2*cnt+1] = (int)(v[cnt] + i + 1 - now_cost);
				cnt++;
			}
			now_cost += n-i;
		}
	}

	void EMSCRIPTEN_KEEPALIVE randomConnectedGraph(int *a, int n, int m) {
		for (int i = 1; i <= MAX_I_CONNECTED_GRAPH; i++) {
			func_i_connected_graph[i] = 1;
			for (int j = 2; j <= i; j++) {
				func_i_connected_graph[i] *= (double)i/j;
			}
		}
		std::unordered_set<long long> st;
        std::vector<int> perm = __randomPermutation(n,0,n-1);
        __randomConnectedGraph(perm,m,st);
		int count = 0;
        for (auto val : st) {
			a[2*count] = val/n + 1;
			a[2*count+1] = val%n + 1;
			count++;
		}
	}
}