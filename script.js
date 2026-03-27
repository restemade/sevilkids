const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const modal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const successBox = document.getElementById('successBox');
const openButtons = document.querySelectorAll('[data-open-booking]');
const closeButtons = document.querySelectorAll('[data-close-booking]');
const reveals = document.querySelectorAll('.reveal');
const slotButtons = document.querySelectorAll('.slot');

burgerBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (successBox) successBox.hidden = true;
  if (bookingForm) bookingForm.hidden = false;
};

openButtons.forEach((button) => button.addEventListener('click', openModal));
closeButtons.forEach((button) => button.addEventListener('click', closeModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

slotButtons.forEach((button) => {
  button.addEventListener('click', () => {
    slotButtons.forEach((slot) => slot.classList.remove('active'));
    button.classList.add('active');
  });
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const selectedDate = formData.get('date');

  if (!selectedDate) {
    alert('Пожалуйста, выберите дату.');
    return;
  }

  bookingForm.hidden = true;
  successBox.hidden = false;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach((item) => observer.observe(item));

const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${year}-${month}-${day}`;
}
