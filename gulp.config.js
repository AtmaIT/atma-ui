const config = () => {
  return {
    paths: {
      src: {
        scss: "./src/scss"
      },
      dest: {
        scss: "./dist/css"
      },
      localServer: "./dist"
    }
  };
};

module.exports = config();
