const speedTest = require("speedtest-net");

(async () => {
  try {
    console.log(await speedTest({ acceptLicense: true }));
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit(0);
  }
})();
