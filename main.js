/* ============================================================
   MOBILE NAV
============================================================ */
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ============================================================
   SIMPLE LIGHTBOX
============================================================ */
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const url = item.getAttribute("href");

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:1000;cursor:zoom-out;";
    
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "95%";
    img.style.maxHeight = "90%";

    overlay.appendChild(img);
    overlay.addEventListener("click", () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

/* ============================================================
   FOOTER FORM
============================================================ */
const footerForm = document.getElementById("footerContact");
const footerStatus = document.getElementById("footerStatus");

if (footerForm) {
  footerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    footerStatus.textContent = "Sending...";
    await new Promise((r) => setTimeout(r, 900));

    footerStatus.textContent = "Thanks! We will reach out soon.";
    footerForm.reset();

    setTimeout(() => (footerStatus.textContent = ""), 3000);
  });
}

/* ============================================================
   FOOTER YEAR
============================================================ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   UNIVERSAL ANIMATION SYSTEM
============================================================ */

/* Generic reveal function */
function revealOnScroll(selector, delay = 150) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      elements.forEach((el, i) => {
        setTimeout(() => el.classList.add("in"), i * delay);
      });

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  obs.observe(elements[0].closest("section"));
}

/* HERO */
revealOnScroll(".hero-line", 450);
revealOnScroll(".hero-sub", 160);
revealOnScroll(".hero-buttons", 160);

/* ABOUT — only points rise */
revealOnScroll(".about-point", 150);

/* NUMBERS */
revealOnScroll(".num-card", 180);

/* TESTIMONIALS */
revealOnScroll(".testimonial", 180);

/* FLAGSHIP CARDS */
revealOnScroll(".flag-card", 150);


/* ============================================================
   HERO PANEL PARALLAX
============================================================ */
const heroPanel = document.querySelector(".hero-panel");

if (heroPanel) {
  window.addEventListener(
    "scroll",
    () => {
      const rect = heroPanel.getBoundingClientRect();
      const winH = window.innerHeight;

      if (rect.top < winH && rect.bottom > 0) {
        const pct = (winH - rect.top) / winH;
        heroPanel.style.transform =
          `translateY(${Math.min(20, (1 - pct) * 26)}px)`;
      }
    },
    { passive: true }
  );
}


/* ============================================================
   OUR VISION — Points Rise Animation
============================================================ */
const visionSection = document.querySelector("#vision");

if (visionSection) {
  const visionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const points = document.querySelectorAll(".rise-point");
      points.forEach((p, i) => {
        setTimeout(() => p.classList.add("in"), i * 150);
      });

      visionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  visionObserver.observe(visionSection);
}


/* ============================================================
   FUEL SECTION — SMOOTH COUNT + PLUS SIGN (★ NEW)
============================================================ */

(function () {

  const fuelSection = document.querySelector("#fuel");
  if (!fuelSection) return;

  const countUp = (num) => {
    const target = parseInt(num.getAttribute("data-target"));
    let current = 0;
    const increment = Math.ceil(target / 80);

    const update = () => {
      current += increment;

      if (current < target) {
        num.textContent = current.toLocaleString();
        requestAnimationFrame(update);
      } else {
        num.textContent = target.toLocaleString() + "+";   // ★ add +
      }
    };

    update();
  };

  const fuelObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const nums = entry.target.querySelectorAll(".count-num");
        nums.forEach((num) => countUp(num));

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  fuelObserver.observe(fuelSection);

})();


/* ============================================================
   SPEAKER SLIDER
============================================================ */
(function () {
  const track = document.querySelector(".speakers-track");
  if (!track) return;

  const cardWidth = 216; // 200px card + 16px gap
  let index = 0;

  const prev = document.getElementById("speakerPrev");
  const next = document.getElementById("speakerNext");

  next.addEventListener("click", () => {
    index++;
    track.scrollTo({ left: index * cardWidth, behavior: "smooth" });

    prev.disabled = index === 0;
    next.disabled = index >= 3;
  });

  prev.addEventListener("click", () => {
    index--;
    track.scrollTo({ left: index * cardWidth, behavior: "smooth" });

    prev.disabled = index === 0;
    next.disabled = index >= 3;
  });
})();


/* ============================================================
   FLAGSHIP AUTO-IMAGE ROTATION (every 5 seconds)
============================================================ */
const flagImages = document.querySelectorAll(".flag-img");

flagImages.forEach(img => {
  const imgList = JSON.parse(img.getAttribute("data-images"));
  let index = 0;

  setInterval(() => {
    index = (index + 1) % imgList.length;
    img.src = imgList[index];
  }, 2000);   // 5 seconds
});

/* ============================================================
   EVENT FILTERS (events.html)
============================================================ */

const filterButtons = document.querySelectorAll(".chip");
const eventCards = document.querySelectorAll(".event-card");

if (filterButtons.length && eventCards.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.getAttribute("data-filter");

      eventCards.forEach((card) => {
        const cardType = card.getAttribute("data-type");
        const matches = type === "all" || cardType === type;

        card.style.display = matches ? "" : "none";
      });
    });
  });
}
/* =====================
   PAST EVENT READ MORE
===================== */

const pastReadMoreButtons = document.querySelectorAll(".past-readmore");

pastReadMoreButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".past-event-card");

    card.classList.toggle("expanded");

    btn.textContent = card.classList.contains("expanded")
      ? "Read less "
      : "Read more ";
  });
});

/* ============================================================
   TEAM PAGE — MOBILE NAV + YEAR (safe minimal JS)
============================================================ */

revealOnScroll(".rise-team", 150);
/* ============================================================
   EVENT IMAGE SLIDER Gallery page
============================================================ */

/* ============================================================
   EVENT PHOTO SLIDERS
============================================================ */

document.querySelectorAll(".event-slider").forEach(slider => {

  const track = slider.querySelector(".event-track");
  const prev = slider.querySelector(".event-arrow.left");
  const next = slider.querySelector(".event-arrow.right");

  if (!track || !prev || !next) return;

  let index = 0;
  const gap = 18;
  const cardWidth = track.querySelector("img").offsetWidth + gap;
  const maxIndex = track.children.length - 4;

  const update = () => {
    prev.disabled = index <= 0;
    next.disabled = index >= maxIndex;
  };

  next.addEventListener("click", () => {
    if (index < maxIndex) {
      index++;
      track.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      update();
    }
  });

  prev.addEventListener("click", () => {
    if (index > 0) {
      index--;
      track.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      update();
    }
  });

  update();
});
