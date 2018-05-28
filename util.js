function deepcopy(a) {
  return JSON.parse(JSON.stringify(a));
}

function arrayComp(a, b) {
  if(a.length != b.length) {
    return false;
  }
  
  for(var i = 0; i < a.length; i++) {
    if(a[i] != b[i]) {
      return false;
    }
  }
  
  return true;
}

function randint(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}
