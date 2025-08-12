document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.profile-card').forEach(card => {
        const toggleBtn = card.querySelector('.toggle-btn');
        const closeBtn = card.querySelector('.close-btn');
        const nameTitle = card.querySelector('.name-title');
        const footer = card.querySelector('.footer-section');
        const contentArea = card.querySelector('.content-area');
        const description = card.dataset.description;
        const originalImage = contentArea.innerHTML; // Save original image HTML

        toggleBtn.addEventListener('click', () => {
            nameTitle.classList.remove('hidden');
            closeBtn.classList.remove('hidden');
            footer.style.display = 'none';
            contentArea.innerHTML = `<p class="text-[14px] font-instrument-sans leading-[18px] tracking-[1px] text-[#424245] p-[16px]">${description}</p>`;
        });

        closeBtn.addEventListener('click', () => {
            nameTitle.classList.add('hidden');
            closeBtn.classList.add('hidden');
            footer.style.display = 'flex';
            contentArea.innerHTML = originalImage;
        });
    });
});

// card for the peragraph



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