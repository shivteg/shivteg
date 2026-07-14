// JavaScript Interactions for Shivteg Portfolio

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupContactForm();
  setupScrollEffects();
  setupCodeTerminalAnimation();
});

/**
 * Mobile navigation menu toggling
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const menuOpenIcon = document.querySelector('.menu-open-icon');
  const menuCloseIcon = document.querySelector('.menu-close-icon');

  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    menuOpenIcon.classList.toggle('hidden');
    menuCloseIcon.classList.toggle('hidden');
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Handle Contact Form submission
 */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    statusDiv.textContent = 'Sending message...';
    statusDiv.className = 'form-status';

    // Simulate standard frontend form submission delay
    setTimeout(() => {
      // Direct success prompt
      statusDiv.textContent = `Thank you, ${name}! Your message has been sent. I will get back to you at ${email} shortly.`;
      statusDiv.className = 'form-status success';
      
      // Reset the form fields
      form.reset();

      // Clear success status after 6 seconds
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'form-status';
      }, 6000);
    }, 1200);
  });
}

/**
 * Highlight nav links on scroll & handle header background opacity
 */
function setupScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-md)';
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }

    // Active Section Link Highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        // Find CSS rules in main.css that style .nav-link.active or similar
        // Let's add color class
        link.style.color = 'var(--color-primary-light)';
      } else {
        link.style.color = '';
      }
    });
  });
}

/**
 * Code Terminal Hover Interaction (3D rotation tilt)
 */
function setupCodeTerminalAnimation() {
  const terminal = document.querySelector('.code-terminal');
  if (!terminal) return;

  terminal.addEventListener('mousemove', (e) => {
    const rect = terminal.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within the element
    const y = e.clientY - rect.top;  // y coordinate within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angle (max 5 degrees)
    const rotateX = ((centerY - y) / centerY) * 4;
    const rotateY = ((x - centerX) / centerX) * 4;

    terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  terminal.addEventListener('mouseleave', () => {
    terminal.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    terminal.style.transition = 'transform 0.5s ease';
  });

  terminal.addEventListener('mouseenter', () => {
    terminal.style.transition = 'none';
  });
}
