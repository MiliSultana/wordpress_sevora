gsap.registerPlugin(ScrollTrigger);

const scroller = document.querySelector(".scroller");

// Initialize smooth scrollbar only for large screens
let bodyScrollBar;
if (window.innerWidth > 768) {
  bodyScrollBar = Scrollbar.init(scroller, {
    damping: 0.1,
  });

  // Proxy for GSAP ScrollTrigger
  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value;
      }
      return bodyScrollBar.scrollTop;
    }
  });

  // Sync ScrollTrigger with scrollbar
  bodyScrollBar.addListener(ScrollTrigger.update);

  // Set default scroller for ScrollTrigger
  ScrollTrigger.defaults({
    scroller: scroller
  });
}

// Set zIndex for panel elements
gsap.set(".panel", {
  zIndex: (i, target, targets) => targets.length - i
});

const images = gsap.utils.toArray('.panel:not(.purple)');
const texts = gsap.utils.toArray('.panel-text');

if (window.innerWidth > 768) {
  // Desktop Scroll Animations

  images.forEach((image, i) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".black",
        start: () => "top -" + (window.innerHeight * (i + 0.5)),
        end: () => "+=" + window.innerHeight,
        scrub: true,
        invalidateOnRefresh: true,
      }
    }).to(image, { height: 0 });
  });

  gsap.set(".panel-text", {
    zIndex: (i, target, targets) => targets.length - i,
    opacity: (i, targets) => (i === 0 || i === targets.length - 1) ? 1 : 0,
    y: "0%"
  });

  texts.forEach((text, i) => {
    if (i === texts.length) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: ".black",
        start: () => "top -" + (window.innerHeight * i),
        end: () => "+=" + window.innerHeight,
        scrub: true,
        invalidateOnRefresh: true,
      }
    })
    .to(text, { duration: 0.33, opacity: 1, y: "0%" })
    .to(text, { duration: 0.33, opacity: 0, y: "0%" }, 0.66);
  });

  // Pin the black section
  ScrollTrigger.create({
    trigger: ".black",
    pin: true,
    scrub: true,
    start: "top top",
    end: () => "+=" + ((images.length + 0.5) * window.innerHeight),
    invalidateOnRefresh: true,
  });

} else {
  // Mobile Layout: Show all images and texts vertically
  document.querySelectorAll(".panel, .panel-text").forEach(el => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.height = "auto";
    el.style.position = "static";
  });

  // Optional: destroy ScrollTrigger on small screens
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  if (bodyScrollBar) {
    bodyScrollBar.destroy();
  }

  // Reset scroller overflow
  if (scroller) {
    scroller.style.overflow = "visible";
  }
}


  const totalPages = 50;
let currentPage = 4;
const visiblePages = 5;

const pagination = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function createPageButton(page, isActive = false) {
  const btn = document.createElement("li");
  btn.textContent = page;
  btn.className = `min-w-[40px] h-[40px] flex items-center justify-center 
    rounded border text-sm cursor-pointer transition
    ${isActive ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-200 border-gray-300"}`;

  btn.addEventListener("click", () => {
    currentPage = page;
    renderPagination();
  });

  return btn;
}

function createDots() {
  const dots = document.createElement("li");
  dots.textContent = "...";
  dots.className = "text-gray-400 text-sm";
  return dots;
}

function renderPagination() {
  pagination.innerHTML = "";

  const range = Math.floor(visiblePages / 2);
  let start = currentPage - range;
  let end = currentPage + range;

  if (start < 2) {
    start = 2;
    end = start + visiblePages - 1;
  }

  if (end > totalPages - 1) {
    end = totalPages - 1;
    start = end - visiblePages + 1;
    if (start < 2) start = 2;
  }

  // Always show first page
  pagination.appendChild(createPageButton(1, currentPage === 1));

  if (start > 2) pagination.appendChild(createDots());

  // Middle range
  for (let i = start; i <= end; i++) {
    pagination.appendChild(createPageButton(i, currentPage === i));
  }

  if (end < totalPages - 1) pagination.appendChild(createDots());

  // Always show last page
  pagination.appendChild(createPageButton(totalPages, currentPage === totalPages));
}

// Arrow functionality
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPagination();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPagination();
  }
});

// Initial render
renderPagination();
