const socket = io();
document.getElementById("githubButton").addEventListener("click", function () {
  window.location.href = "/api/sessions/github";
});
