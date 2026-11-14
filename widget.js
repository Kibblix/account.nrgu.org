/*
  NRGU account button (top right corner).
  Hosted at https://account.nrgu.org/widget.js
  Add to any *.nrgu.org page, just before </body>:
      <script src="https://account.nrgu.org/widget.js"></script>
*/
(function () {
    var ACCOUNT = "https://account.nrgu.org";

    // The account site has its own button.
    if (location.origin === ACCOUNT) return;

    function start() {
        var css = document.createElement("style");
        css.textContent =
            "#nrgu-account-btn{position:fixed;top:14px;right:14px;z-index:9999;display:flex;align-items:center;gap:8px;" +
            "padding:7px 16px;border-radius:999px;border:1px solid #ddd;background:#fff;color:#222;" +
            "font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;" +
            "text-decoration:none;white-space:nowrap;max-width:60vw;opacity:0;transition:opacity .2s,background .15s}" +
            "#nrgu-account-btn.show{opacity:1}" +
            "#nrgu-account-btn:hover{background:#f6f6f6}" +
            "#nrgu-account-btn img{width:22px;height:22px;border-radius:50%;object-fit:cover}" +
            "#nrgu-account-btn span{overflow:hidden;text-overflow:ellipsis}" +
            "@media (prefers-color-scheme:dark){" +
            "#nrgu-account-btn{background:#2a2a2a;border-color:#444;color:#eee}" +
            "#nrgu-account-btn:hover{background:#333}}";
        document.head.appendChild(css);

        var btn = document.createElement("a");
        btn.id = "nrgu-account-btn";
        document.body.appendChild(btn);

        function showSignedOut() {
            btn.textContent = "Sign in";
            btn.href = ACCOUNT + "/?return=" + encodeURIComponent(location.href);
            btn.classList.add("show");
        }

        function showSignedIn(user) {
            btn.textContent = "";
            if (user.photoURL && /^https:\/\//.test(user.photoURL)) {
                var img = document.createElement("img");
                img.src = user.photoURL;
                img.alt = "";
                img.referrerPolicy = "no-referrer";
                btn.appendChild(img);
            }
            var label = document.createElement("span");
            label.textContent = String(user.name || "Account").split(" ")[0];
            btn.appendChild(label);
            btn.href = ACCOUNT;
            btn.classList.add("show");
        }

        // Make sure the button works even before the account site answers.
        btn.href = ACCOUNT + "/?return=" + encodeURIComponent(location.href);

        // Hidden iframe that tells us who is signed in on account.nrgu.org.
        var frame = document.createElement("iframe");
        frame.src = ACCOUNT + "/bridge.html";
        frame.title = "";
        frame.tabIndex = -1;
        frame.setAttribute("aria-hidden", "true");
        frame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
        document.body.appendChild(frame);

        window.addEventListener("message", function (e) {
            if (e.origin !== ACCOUNT || e.source !== frame.contentWindow) return;
            var d = e.data;
            if (!d || d.type !== "nrgu-auth") return;
            if (d.user) showSignedIn(d.user); else showSignedOut();
        });

        // If the account site never answers, fall back to a plain sign-in button.
        setTimeout(function () {
            if (!btn.classList.contains("show")) showSignedOut();
        }, 2500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
