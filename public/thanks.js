// var ip = require("ip");
// const localhost = ip.address();
var btn = document.getElementsByClassName("btn")[0];
btn.addEventListener("click", (e) => {
  console.log("XXXXX");
  window.open("http://localhost:3000/");
});
