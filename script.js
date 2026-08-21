(function () {
  "use strict";

  var btn = document.getElementById("copyEmailBtn");
  var hint = document.getElementById("copyHint");
  if (!btn || !hint) return;

  btn.addEventListener("click", function () {
    var email = btn.getAttribute("data-email") || "";

    function showConfirmation() {
      hint.textContent = "Copied " + email + " to your clipboard.";
      window.setTimeout(function () {
        hint.textContent = "\u00A0";
      }, 3000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showConfirmation, function () {
        hint.textContent = "Copy failed — the address is " + email;
      });
    } else {
      hint.textContent = "The address is " + email;
    }
  });
})();
