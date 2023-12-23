// n = n1 * 10^9 + n2
export function int2str(n1, n2) {
  if (n1 > 0) {
    return String(n1) + ('000000000'+n2).slice(-9);
  }
  else if (n1 < 0) {
    n1 = -n1;
    n2 = -n2;
    return '-' + String(n1) + ('000000000'+n2).slice(-9);
  }
  else {
    return String(n2);
  }
}

export function str2int1(str) {
  if (str.length === 0) return 0;
  if (str.length <= 10 && str[0] === '-') {
    return 0;
  }
  else if (str.length <= 9 && str[0] !== '-') {
    return 0;
  }
  else {
    return Number(str.slice(0,-9));
  }
}

export function str2int2(str) {
  if (str.length === 0) return 0;
  if (str.length <= 10 && str[0] === '-') {
    return Number(str);
  }
  else if (str.length <= 9 && str[0] !== '-') {
    return Number(str);
  }
  else if (str[0] === '-') {
    return -Number(str.slice(-9));
  }
  else {
    return Number(str.slice(-9));
  }
}

// n < m
export function isLtLL(n1, n2, m1, m2) {
  if (n1 < m1) return true;
  if (n1 > m1) return false;
  if (n2 < m2) return true;
  else return false;
}

// n > m
export function isGtLL(n1, n2, m1, m2) {
  if (n1 > m1) return true;
  if (n1 < m1) return false;
  if (n2 > m2) return true;
  else return false;
}