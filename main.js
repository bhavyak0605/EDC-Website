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
   SPEAKER SLIDER WITH TOUCH/SWIPE AND MOUSE DRAG
============================================================ */
(function () {
  const track = document.querySelector(".speakers-track");
  if (!track) return;

  const prev = document.getElementById("speakerPrev");
  const next = document.getElementById("speakerNext");

  // Calculate card width dynamically
  const getCardWidth = () => {
    const firstCard = track.querySelector(".speaker-card");
    if (!firstCard) return 216; // fallback
    const cardStyle = window.getComputedStyle(firstCard);
    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(cardStyle.marginRight) || 16;
    return cardWidth + gap;
  };

  // Update arrow states
  const updateArrows = () => {
    const cardWidth = getCardWidth();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;
    
    // Calculate approximate index
    const index = Math.round(currentScroll / cardWidth);
    const maxIndex = Math.floor(maxScroll / cardWidth);
    
    if (prev) {
      prev.disabled = currentScroll <= 0;
    }
    if (next) {
      next.disabled = currentScroll >= maxScroll - 5; // 5px tolerance
    }
  };

  // Scroll to specific index
  const scrollToIndex = (targetIndex, smooth = true) => {
    const cardWidth = getCardWidth();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const maxIndex = Math.floor(maxScroll / cardWidth);
    
    const index = Math.max(0, Math.min(targetIndex, maxIndex));
    track.scrollTo({ 
      left: index * cardWidth, 
      behavior: smooth ? "smooth" : "auto" 
    });
  };

  // Arrow button handlers
  let currentIndex = 0;
  
  if (next) {
    next.addEventListener("click", () => {
      const cardWidth = getCardWidth();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const maxIndex = Math.floor(maxScroll / cardWidth);
      
      currentIndex = Math.min(currentIndex + 1, maxIndex);
      scrollToIndex(currentIndex);
    });
  }

  if (prev) {
    prev.addEventListener("click", () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      scrollToIndex(currentIndex);
    });
  }

  // ========== TOUCH/SWIPE SUPPORT FOR MOBILE ==========
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    // Allow native scrolling
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Only handle swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const cardWidth = getCardWidth();
      
      if (deltaX > 0) {
        // Swipe left - go to next
        const currentScroll = track.scrollLeft;
        const newIndex = Math.ceil((currentScroll + cardWidth) / cardWidth);
        scrollToIndex(newIndex);
        currentIndex = newIndex;
      } else {
        // Swipe right - go to previous
        const currentScroll = track.scrollLeft;
        const newIndex = Math.max(0, Math.floor((currentScroll - cardWidth) / cardWidth));
        scrollToIndex(newIndex);
        currentIndex = newIndex;
      }
    }
    
    isDragging = false;
  }, { passive: true });

  // ========== MOUSE DRAG SUPPORT FOR DESKTOP ==========
  let mouseDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener("mousedown", (e) => {
    mouseDown = true;
    track.style.cursor = "grabbing";
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    e.preventDefault();
  });

  track.addEventListener("mouseleave", () => {
    mouseDown = false;
    track.style.cursor = "grab";
  });

  track.addEventListener("mouseup", () => {
    mouseDown = false;
    track.style.cursor = "grab";
  });

  track.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    track.scrollLeft = scrollLeft - walk;
  });

  // Set initial cursor style
  track.style.cursor = "grab";
  track.style.userSelect = "none";

  // Update arrows on scroll
  track.addEventListener("scroll", () => {
    updateArrows();
    // Update current index based on scroll position
    const cardWidth = getCardWidth();
    currentIndex = Math.round(track.scrollLeft / cardWidth);
  }, { passive: true });

  // Initial arrow state
  updateArrows();

  // Update on window resize
  window.addEventListener("resize", () => {
    updateArrows();
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
   EVENT PHOTO SLIDERS WITH TOUCH/SWIPE AND MOUSE DRAG
============================================================ */

document.querySelectorAll(".event-slider").forEach(slider => {

  const track = slider.querySelector(".event-track");
  const prev = slider.querySelector(".event-arrow.left");
  const next = slider.querySelector(".event-arrow.right");

  if (!track) return;

  // Calculate image width dynamically
  const getImageWidth = () => {
    const firstImg = track.querySelector("img");
    if (!firstImg) return 200; // fallback
    const imgStyle = window.getComputedStyle(firstImg);
    const imgWidth = firstImg.offsetWidth;
    const gap = parseInt(imgStyle.marginRight) || 16;
    return imgWidth + gap;
  };

  // Update arrow states
  const updateArrows = () => {
    if (!prev || !next) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;
    
    prev.disabled = currentScroll <= 0;
    next.disabled = currentScroll >= maxScroll - 5; // 5px tolerance
  };

  // Scroll to specific index
  const scrollToIndex = (targetIndex, smooth = true) => {
    const imageWidth = getImageWidth();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const maxIndex = Math.floor(maxScroll / imageWidth);
    
    const index = Math.max(0, Math.min(targetIndex, maxIndex));
    track.scrollTo({ 
      left: index * imageWidth, 
      behavior: smooth ? "smooth" : "auto" 
    });
  };

  // Arrow button handlers
  let currentIndex = 0;
  
  if (next) {
    next.addEventListener("click", () => {
      const imageWidth = getImageWidth();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const maxIndex = Math.floor(maxScroll / imageWidth);
      
      currentIndex = Math.min(currentIndex + 1, maxIndex);
      scrollToIndex(currentIndex);
    });
  }

  if (prev) {
    prev.addEventListener("click", () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      scrollToIndex(currentIndex);
    });
  }

  // ========== TOUCH/SWIPE SUPPORT FOR MOBILE ==========
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    // Allow native scrolling
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Only handle swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const imageWidth = getImageWidth();
      
      if (deltaX > 0) {
        // Swipe left - go to next
        const currentScroll = track.scrollLeft;
        const newIndex = Math.ceil((currentScroll + imageWidth) / imageWidth);
        scrollToIndex(newIndex);
        currentIndex = newIndex;
      } else {
        // Swipe right - go to previous
        const currentScroll = track.scrollLeft;
        const newIndex = Math.max(0, Math.floor((currentScroll - imageWidth) / imageWidth));
        scrollToIndex(newIndex);
        currentIndex = newIndex;
      }
    }
    
    isDragging = false;
  }, { passive: true });

  // ========== MOUSE DRAG SUPPORT FOR DESKTOP ==========
  let mouseDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener("mousedown", (e) => {
    mouseDown = true;
    track.style.cursor = "grabbing";
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    e.preventDefault();
  });

  track.addEventListener("mouseleave", () => {
    mouseDown = false;
    track.style.cursor = "grab";
  });

  track.addEventListener("mouseup", () => {
    mouseDown = false;
    track.style.cursor = "grab";
  });

  track.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    track.scrollLeft = scrollLeft - walk;
  });

  // Set initial cursor style
  track.style.cursor = "grab";
  track.style.userSelect = "none";

  // Update arrows on scroll
  track.addEventListener("scroll", () => {
    updateArrows();
    // Update current index based on scroll position
    const imageWidth = getImageWidth();
    currentIndex = Math.round(track.scrollLeft / imageWidth);
  }, { passive: true });

  // Initial arrow state
  updateArrows();

  // Update on window resize
  window.addEventListener("resize", () => {
    updateArrows();
  });
});
