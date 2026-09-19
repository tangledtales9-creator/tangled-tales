(function () {
  "use strict";
  var cfg = window.TT_CONFIG || {};
  var CART_KEY = "tt_cart_v1";

  /* ---------- helpers ---------- */
  function money(n) { return (cfg.currency || "₹") + Number(n).toLocaleString("en-IN"); }
  function loadCart() {
    try { var c = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(c) ? c : []; }
    catch (e) { return []; }
  }
  function saveCart(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} }
  function count(c) { return c.reduce(function (n, i) { return n + i.qty; }, 0); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function waLink(text) {
    var num = String(cfg.whatsapp || "").replace(/\D/g, "");
    var valid = /^\d{10,15}$/.test(num) && String(cfg.whatsapp).indexOf("X") === -1;
    return "https://wa.me/" + (valid ? num : "") + "?text=" + encodeURIComponent(text);
  }
  function mailLink(subject, body) {
    return "mailto:" + (cfg.email || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function send(channel, subject, text) {
    if (channel === "email") { window.location.href = mailLink(subject, text); }
    else { window.open(waLink(text), "_blank", "noopener"); }
  }

  /* ---------- fill in your details from config.js ---------- */
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var k = el.getAttribute("data-bind");
    if (k === "email") { el.textContent = cfg.email; if (el.tagName === "A") el.href = "mailto:" + cfg.email; }
    if (k === "instagram") { el.textContent = "@" + cfg.instagram; if (el.tagName === "A") el.href = "https://instagram.com/" + cfg.instagram; }
    if (k === "whatsapp") {
      var digits = String(cfg.whatsapp).replace(/\D/g, "");
      if (/^\d{10,15}$/.test(digits) && String(cfg.whatsapp).indexOf("X") === -1) el.textContent = "+" + digits;
      if (el.tagName === "A") el.href = waLink("Hi! I have a question about Tangled Tales.");
    }
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- cart count + toast ---------- */
  function refreshCount() {
    var n = count(loadCart());
    document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = n; });
  }
  var toast, toastTimer;
  function showToast(html) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.innerHTML = html;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3500);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (!b) return;
    var cart = loadCart();
    var id = b.getAttribute("data-id");
    var found = cart.filter(function (i) { return i.id === id; })[0];
    if (found) { found.qty += 1; }
    else {
      cart.push({ id: id, name: b.getAttribute("data-name"), price: Number(b.getAttribute("data-price")), img: b.getAttribute("data-img"), tint: b.getAttribute("data-tint"), qty: 1 });
    }
    saveCart(cart);
    refreshCount();
    showToast("Added " + esc(b.getAttribute("data-name")) + ' to your cart <a href="cart.html">View cart</a>');
  });

  /* ---------- shop filters ---------- */
  var chips = document.querySelectorAll("[data-filter]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      document.querySelectorAll(".pcard[data-cat]").forEach(function (card) {
        card.hidden = !(f === "all" || card.getAttribute("data-cat") === f);
      });
    });
  });

  /* ---------- form validation ---------- */
  function validate(form) {
    var ok = true, first = null;
    form.querySelectorAll("[data-required]").forEach(function (input) {
      var err = input.parentNode.querySelector(".err");
      var bad = !input.value.trim();
      if (err) err.hidden = !bad;
      input.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) { ok = false; if (!first) first = input; }
    });
    if (first) first.focus();
    return ok;
  }
  function clearOnInput(form) {
    form.addEventListener("input", function (e) {
      var err = e.target.parentNode.querySelector(".err");
      if (err && e.target.value.trim()) { err.hidden = true; e.target.setAttribute("aria-invalid", "false"); }
    });
  }
  function val(form, name) { var el = form.elements[name]; return el ? el.value.trim() : ""; }

  /* ---------- custom order form ---------- */
  var custom = document.getElementById("custom-form");
  if (custom) {
    clearOnInput(custom);
    custom.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(custom)) return;
      var lines = [
        "Hi! I'd like to request a custom crochet piece.",
        "",
        "Name: " + val(custom, "name"),
        "What I'd like: " + val(custom, "idea"),
        "Colours: " + (val(custom, "colours") || "not sure yet"),
        "Size: " + (val(custom, "size") || "not sure yet"),
        "Needed by: " + (val(custom, "date") || "no fixed date"),
        "Budget: " + (val(custom, "budget") || "flexible")
      ];
      send(e.submitter ? e.submitter.getAttribute("data-channel") : "whatsapp", "Custom order request", lines.join("\n"));
    });
  }

  /* ---------- contact form ---------- */
  var contact = document.getElementById("contact-form");
  if (contact) {
    clearOnInput(contact);
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(contact)) return;
      var text = "Hi! " + val(contact, "message") + "\n\n- " + val(contact, "name");
      send(e.submitter ? e.submitter.getAttribute("data-channel") : "whatsapp", "Message from " + val(contact, "name"), text);
    });
  }

  /* ---------- newsletter (opens an email to you; swap for a mailing-list tool later) ---------- */
  document.querySelectorAll("[data-newsletter]").forEach(function (box) {
    var input = box.querySelector("input");
    var err = box.querySelector(".err");
    box.querySelector("button").addEventListener("click", function () {
      var v = input.value.trim();
      var ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
      err.hidden = ok;
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok) { input.focus(); return; }
      window.location.href = mailLink("Please add me to the Tangled Tales list", "Hi! Please add " + v + " to your list for new drops.");
    });
  });

  /* ---------- cart page ---------- */
  var root = document.getElementById("cart-root");
  function renderCart() {
    var cart = loadCart();
    if (!cart.length) {
      root.innerHTML = '<p class="muted">Your cart is empty.</p><p><a class="btn" href="shop.html">Browse the shop</a></p>';
      refreshCount();
      return;
    }
    var total = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    var items = cart.map(function (i) {
      return '<div class="cart-item" data-id="' + esc(i.id) + '">' +
        '<div class="pimg ' + esc(i.tint || "tint-a") + '"><img src="images/' + esc(i.img) + '" alt=""></div>' +
        '<div><h3>' + esc(i.name) + '</h3><span class="muted">' + money(i.price) + ' each</span>' +
        '<div class="qty"><button type="button" data-act="dec" aria-label="Decrease quantity of ' + esc(i.name) + '">-</button>' +
        '<span aria-live="polite">' + i.qty + '</span>' +
        '<button type="button" data-act="inc" aria-label="Increase quantity of ' + esc(i.name) + '">+</button>' +
        '<button type="button" class="linkbtn" data-act="del">Remove</button></div></div>' +
        '<div class="line price">' + money(i.price * i.qty) + '</div></div>';
    }).join("");
    root.innerHTML =
      '<div class="two top"><div>' + items +
      '<div class="total"><span>Total</span><span>' + money(total) + '</span></div>' +
      '<p class="muted">Delivery charges (if any) are confirmed with you before payment.</p></div>' +
      '<form class="panel" id="order-form" novalidate><h2>Place your order</h2>' +
      '<p class="muted">Send your order to us in one tap. We\'ll confirm the total, delivery time and payment details with you.</p>' +
      '<div class="field"><label for="o-name">Your name</label><input id="o-name" name="name" autocomplete="name" data-required><p class="err" hidden>Enter your name.</p></div>' +
      '<div class="field"><label for="o-addr">Delivery address</label><textarea id="o-addr" name="address" autocomplete="street-address" data-required></textarea><p class="err" hidden>Enter your delivery address.</p></div>' +
      '<div class="field"><label for="o-note">Notes (optional)</label><input id="o-note" name="note"><p class="hint">Gift message, colour request or delivery timing.</p></div>' +
      '<div class="form-actions"><button class="btn" type="submit" data-channel="whatsapp">Order on WhatsApp</button>' +
      '<button class="btn btn-2" type="submit" data-channel="email">Order by email</button></div>' +
      '<p><button type="button" class="linkbtn" data-act="clear" style="margin:12px 0 0">Empty cart</button></p></form></div>';
    var form = document.getElementById("order-form");
    clearOnInput(form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var c = loadCart();
      var lines = ["Hi! I'd like to place an order:", ""];
      c.forEach(function (i) { lines.push("- " + i.qty + " x " + i.name + " (" + money(i.price) + " each)"); });
      lines.push("", "Total: " + money(c.reduce(function (s, i) { return s + i.price * i.qty; }, 0)));
      lines.push("", "Name: " + val(form, "name"), "Delivery address: " + val(form, "address"));
      if (val(form, "note")) lines.push("Notes: " + val(form, "note"));
      send(e.submitter ? e.submitter.getAttribute("data-channel") : "whatsapp", "New order from " + val(form, "name"), lines.join("\n"));
    });
  }
  if (root) {
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");
      var cart = loadCart();
      if (act === "clear") { cart = []; }
      else {
        var row = b.closest(".cart-item");
        var id = row && row.getAttribute("data-id");
        var idx = -1;
        cart.forEach(function (i, n) { if (i.id === id) idx = n; });
        if (idx < 0) return;
        if (act === "inc") cart[idx].qty += 1;
        if (act === "dec") cart[idx].qty -= 1;
        if (act === "del" || cart[idx].qty < 1) cart.splice(idx, 1);
      }
      saveCart(cart);
      renderCart();
    });
    renderCart();
  }

  refreshCount();
})();
