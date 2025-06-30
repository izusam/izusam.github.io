document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Theme Toggle
  const themeToggle = document.querySelector(".theme-color-toggle");
  const body = document.body;

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-theme");
      localStorage.setItem(
        "theme",
        body.classList.contains("dark-theme") ? "dark" : "light"
      );
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-theme");
    }
  }

  // Smooth Scrolling for Navigation Links
  const navLinksItems = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinksItems.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // Close mobile menu if open
        navLinks.classList.remove("active");
      }
    });
  });

  // Active Navigation Link on Scroll
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links li");

  function setActiveNavItem() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navItems.forEach((item) => item.classList.remove("active"));
        const activeNavItem = document.querySelector(
          `.nav-links li a[href="#${sectionId}"]`
        )?.parentElement;
        if (activeNavItem) {
          activeNavItem.classList.add("active");
        }
      }
    });
  }

  window.addEventListener("scroll", setActiveNavItem);

  // Experience Tab Switching
  const tabButtons = document.querySelectorAll(".companies-list li");
  const tabContents = document.querySelectorAll(".experience-section .content");
  const selector = document.querySelector(".selector");

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      this.classList.add("active");
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // Move selector
      if (selector) {
        const buttonRect = this.getBoundingClientRect();
        const containerRect = this.parentElement.getBoundingClientRect();
        const relativeTop = buttonRect.top - containerRect.top;
        selector.style.transform = `translateY(${relativeTop}px)`;
      }
    });
  });

  // Portfolio Slider Navigation
  const prevBtn = document.querySelector(".slider-navigation .prev");
  const nextBtn = document.querySelector(".slider-navigation .next");
  const slides = document.querySelectorAll(".swiper-slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  }

  if (prevBtn && nextBtn && slides.length > 0) {
    showSlide(0);

    nextBtn.addEventListener("click", function () {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    prevBtn.addEventListener("click", function () {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  }

  // Skills Progress Bar Animation
  const progressBars = document.querySelectorAll(".progress-bar .fill");

  function animateProgressBars() {
    progressBars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      if (width) {
        bar.style.width = width + "%";
      }
    });
  }

  // Trigger progress bar animation when skills section is in view
  const skillsSection = document.querySelector(".education-skill-section");
  if (skillsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateProgressBars();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(skillsSection);
  }

  // Form Submission
  const contactForm = document.querySelector(".contact-form form");
  const submitBtn = document.querySelector(".submit-btn");
  const successMessage = document.querySelector(".success-submit-message");
  const failMessage = document.querySelector(".fail-submit-message");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <span class="loading"></span>';
      }

      // Get form data
      const formData = new FormData(this);

      // Submit form using fetch
      fetch(this.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            if (successMessage) {
              successMessage.style.display = "block";
            }
            contactForm.reset();
          } else {
            throw new Error("Form submission failed");
          }
        })
        .catch((error) => {
          if (failMessage) {
            failMessage.style.display = "block";
          }
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit <span class="loading"></span>';
          }
        });
    });
  }

  // Form Validation
  const formInputs = document.querySelectorAll(
    ".contact-form input, .contact-form textarea"
  );

  formInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      const formControl = this.closest(".form-control");
      const errorMessage = formControl?.querySelector(".validation-error");

      if (this.hasAttribute("required") && !this.value.trim()) {
        formControl?.classList.add("error");
        if (errorMessage) errorMessage.style.display = "block";
      } else {
        formControl?.classList.remove("error");
        if (errorMessage) errorMessage.style.display = "none";
      }

      // Email validation
      if (this.type === "email" && this.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
          formControl?.classList.add("error");
          if (errorMessage) errorMessage.style.display = "block";
        } else {
          formControl?.classList.remove("error");
          if (errorMessage) errorMessage.style.display = "none";
        }
      }
    });
  });

  // Update year in footer
  const yearSpan = document.querySelector(".footer .year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Initialize AOS if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  // Initialize Swiper if available
  if (typeof Swiper !== "undefined") {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: ".slider-navigation .next",
        prevEl: ".slider-navigation .prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }
});

// Additional utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth reveal animations for elements
function revealOnScroll() {
  const reveals = document.querySelectorAll("[data-aos]");

  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add("aos-animate");
    }
  });
}

window.addEventListener("scroll", debounce(revealOnScroll, 10));
