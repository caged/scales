export const delay = (duration, value) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, duration);
  });
};
