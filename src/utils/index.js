/**
 * 求和
 * @param  {...any} args
 * @returns
 */
function sum(...args) {
  let params = args;
  const _sum = (...newArgs) => {
    if (newArgs.length === 0) {
      return params.reduce((pre, cur) => pre + cur, 0);
    } else {
      params = [...params, ...newArgs];
      return _sum;
    }
  };
  return _sum;
}

sum(1)(2)(3)(4)();
sum(1, 2, 3)(4);

/**
 * 对象深合并
 * @param {*} arr
 * @returns
 */
function deepMerge(arr) {
  function merge(a, b) {
    return Object.keys(b).reduce(function (o, k) {
      var v = b[k];
      o[k] =
        v && typeof v === "object"
          ? merge((o[k] = o[k] || (Array.isArray(v) ? [] : {})), v)
          : v;
      return o;
    }, a);
  }

  return arr.reduce(merge);
}
var target = {
  cache: {
    curUser: {
      callingName: "ch sairam",
      dateOfBirth: undefined,
      isTempDob: true,
      knowMarketPrefChange: true,
      email: "sairamch3@gmail.com",
      gender: "",
      livingIn: "IN",
      uid: "CrzpFL2uboaeGvMxXi5WQKSQsCr1",
      timeZone: undefined,
    },
    names: [["aaa"]],
    minPrice: "2500",
    maxPrice: "50000",
    market: "CA",
    foundLovedOne: false,
  },
};
var source = {
  cache: {
    curUser: {
      isTempDob: true,
      knowMarketPrefChange: false,
      timeZone: "Asia/Kolkata",
    },
    names: [["bbb"]],
    prefLanguage: "en",
    market: "IN",
    minPrice: 2250,
    maxPrice: 45000,
    foundLovedOne: false,
    domainName: "roo-fire.appspot.com",
    prodQueryPageNumber: 0,
    welcomeIntentShown: true,
  },
  curContexts: [],
};

deepMerge([{}, target, source]);
