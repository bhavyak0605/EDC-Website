/* ============================================================
   MOBILE NAV
============================================================ */
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

if (navToggle && primaryNav) {
  // Create backdrop overlay
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  backdrop.style.cssText = "position:fixed;top:72px;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:199;opacity:0;visibility:hidden;transition:opacity 0.3s ease, visibility 0.3s ease;";
  document.body.appendChild(backdrop);
  
  // Toggle nav on button click
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    // Show/hide backdrop
    if (isOpen) {
      backdrop.style.opacity = "1";
      backdrop.style.visibility = "visible";
    } else {
      backdrop.style.opacity = "0";
      backdrop.style.visibility = "hidden";
    }
    // Prevent body scroll when nav is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  
  // Close nav when clicking backdrop
  backdrop.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    backdrop.style.opacity = "0";
    backdrop.style.visibility = "hidden";
    document.body.style.overflow = "";
  });

  // Close nav when clicking on a link
  const navLinks = primaryNav.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      backdrop.style.opacity = "0";
      backdrop.style.visibility = "hidden";
      document.body.style.overflow = "";
    });
  });

  // Close nav when clicking outside (backdrop handles this now, but keep for safety)
  document.addEventListener("click", (e) => {
    if (primaryNav.classList.contains("open")) {
      if (!primaryNav.contains(e.target) && !navToggle.contains(e.target) && !backdrop.contains(e.target)) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        backdrop.style.opacity = "0";
        backdrop.style.visibility = "hidden";
        document.body.style.overflow = "";
      }
    }
  });

  // Close nav on window resize if screen becomes larger
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      backdrop.style.opacity = "0";
      backdrop.style.visibility = "hidden";
      document.body.style.overflow = "";
    }
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
   MOUSE DRAG SCROLL FUNCTION (Reusable)
============================================================ */
function addMouseDragScroll(element) {
  if (!element) return;
  
  let isDown = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let rafId = null;

  // Mouse down - start dragging
  element.addEventListener("mousedown", (e) => {
    // Don't start drag if clicking on a link or button
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    
    // Prevent image dragging (which interferes with scroll dragging)
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
    
    isDown = true;
    element.style.cursor = "grabbing";
    element.style.userSelect = "none";
    
    // Prevent text selection on all children
    const children = element.querySelectorAll("*");
    children.forEach(child => {
      child.style.userSelect = "none";
      child.style.pointerEvents = "none";
    });
    
    // Use pageX directly for consistent calculation
    startX = e.pageX;
    scrollLeft = element.scrollLeft;
    lastX = e.pageX;
    lastTime = Date.now();
    velocity = 0;
    
    // Cancel any ongoing momentum scroll
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  // Mouse leave - stop dragging
  element.addEventListener("mouseleave", () => {
    if (isDown) {
      isDown = false;
      element.style.cursor = "grab";
      element.style.userSelect = "";
      
      // Restore pointer events on children
      const children = element.querySelectorAll("*");
      children.forEach(child => {
        child.style.userSelect = "";
        child.style.pointerEvents = "";
      });
      
      // Apply momentum scrolling
      applyMomentum();
    }
  });

  // Mouse up - stop dragging
  element.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      element.style.cursor = "grab";
      element.style.userSelect = "";
      
      // Restore pointer events on children
      const children = element.querySelectorAll("*");
      children.forEach(child => {
        child.style.userSelect = "";
        child.style.pointerEvents = "";
      });
      
      // Apply momentum scrolling
      applyMomentum();
    }
  });

  // Apply momentum scrolling
  function applyMomentum() {
    if (Math.abs(velocity) < 0.1) return;
    
    const friction = 0.95;
    const minVelocity = 0.1;
    
    function animate() {
      if (Math.abs(velocity) < minVelocity) return;
      
      element.scrollLeft -= velocity;
      velocity *= friction;
      
      rafId = requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Mouse move - drag scrolling
  element.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Use pageX directly for more accurate tracking (works better with images)
    const x = e.pageX;
    const walk = (x - startX) * 1.2; // Scroll speed multiplier
    element.scrollLeft = scrollLeft - walk;
    
    // Calculate velocity for momentum
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    if (timeDelta > 0) {
      const xDelta = e.pageX - lastX;
      velocity = (xDelta / timeDelta) * 8; // Scale velocity
    }
    lastX = e.pageX;
    lastTime = currentTime;
  });
  
  // Global mouse up handler (in case mouse leaves element while dragging)
  const handleGlobalMouseUp = () => {
    if (isDown) {
      isDown = false;
      element.style.cursor = "grab";
      element.style.userSelect = "";
      
      // Restore pointer events on children
      const children = element.querySelectorAll("*");
      children.forEach(child => {
        child.style.userSelect = "";
        child.style.pointerEvents = "";
      });
      
      // Apply momentum scrolling
      applyMomentum();
    }
  };
  
  // Add global mouse up listener when dragging starts
  element.addEventListener("mousedown", () => {
    document.addEventListener("mouseup", handleGlobalMouseUp, { once: true });
  });
}

/* ============================================================
   SPEAKER SLIDER WITH SCROLL SUPPORT + MOUSE DRAG
============================================================ */
(function () {
  const track = document.querySelector(".speakers-track");
  if (!track) return;

  const prev = document.getElementById("speakerPrev");
  const next = document.getElementById("speakerNext");

  // Add mouse drag scrolling
  addMouseDragScroll(track);

  // Calculate card width dynamically
  const getCardWidth = () => {
    const firstCard = track.querySelector(".speaker-card");
    if (!firstCard) return 214; // fallback: 198px card + 16px gap
    return firstCard.offsetWidth + 16; // card width + gap
  };

  // Update arrow states based on scroll position
  const updateArrows = () => {
    if (!prev || !next) return;
    
    const cardWidth = getCardWidth();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;
    
    // Enable/disable arrows based on scroll position
    prev.disabled = currentScroll <= 5; // 5px tolerance
    next.disabled = currentScroll >= maxScroll - 5; // 5px tolerance
  };

  // Scroll to next/previous card
  const scrollToNext = () => {
    const cardWidth = getCardWidth();
    const currentScroll = track.scrollLeft;
    const nextScroll = currentScroll + cardWidth;
    track.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  const scrollToPrev = () => {
    const cardWidth = getCardWidth();
    const currentScroll = track.scrollLeft;
    const prevScroll = Math.max(0, currentScroll - cardWidth);
    track.scrollTo({ left: prevScroll, behavior: "smooth" });
  };

  // Arrow button handlers
  if (next) {
    next.addEventListener("click", scrollToNext);
  }

  if (prev) {
    prev.addEventListener("click", scrollToPrev);
  }

  // Update arrows on scroll (for both manual scrolling and button clicks)
  track.addEventListener("scroll", () => {
    updateArrows();
  }, { passive: true });

  // Initial arrow state
  updateArrows();

  // Update on window resize
  window.addEventListener("resize", () => {
    updateArrows();
  }, { passive: true });
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

document.querySelectorAll(".member").forEach(card => {
  const img = card.querySelector("img");
  if (img) {
    card.style.setProperty("--bg-image", `url(${img.src})`);
  }
});

/* ============================================================
   EVENT IMAGE SLIDER Gallery page
============================================================ */

/* ============================================================
   EVENT PHOTO SLIDERS WITH MOUSE DRAG (Continuous Scroll like Speakers)
============================================================ */

document.querySelectorAll(".event-slider").forEach(slider => {

  const track = slider.querySelector(".event-track");
  const prev = slider.querySelector(".event-arrow.left");
  const next = slider.querySelector(".event-arrow.right");

  if (!track) return;

  // Add mouse drag scrolling to gallery tracks
  addMouseDragScroll(track);

  // Calculate image width dynamically (including gap)
  const getImageWidth = () => {
    const firstImg = track.querySelector("img");
    if (!firstImg) return 250; // fallback
    const gap = 10; // gap from CSS
    return firstImg.offsetWidth + gap;
  };

  // Update arrow states based on scroll position (like speaker section)
  const updateArrows = () => {
    if (!prev || !next) return;
    
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;
    
    // Enable/disable arrows based on scroll position
    prev.disabled = currentScroll <= 5; // 5px tolerance
    next.disabled = currentScroll >= maxScroll - 5; // 5px tolerance
  };

  // Scroll to next/previous (continuous scroll like speaker section)
  const scrollToNext = () => {
    const imageWidth = getImageWidth();
    const currentScroll = track.scrollLeft;
    const nextScroll = currentScroll + imageWidth;
    track.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  const scrollToPrev = () => {
    const imageWidth = getImageWidth();
    const currentScroll = track.scrollLeft;
    const prevScroll = Math.max(0, currentScroll - imageWidth);
    track.scrollTo({ left: prevScroll, behavior: "smooth" });
  };

  // Arrow button handlers
  if (next) {
    next.addEventListener("click", scrollToNext);
  }

  if (prev) {
    prev.addEventListener("click", scrollToPrev);
  }

  // Update arrows on scroll (for both manual scrolling, mouse drag, and button clicks)
  track.addEventListener("scroll", () => {
    updateArrows();
  }, { passive: true });

  // Initial arrow state
  updateArrows();

  // Update on window resize
  window.addEventListener("resize", () => {
    updateArrows();
  }, { passive: true });
});
