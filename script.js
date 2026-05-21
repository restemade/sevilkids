const state = {
  selectedCaseCategory: "Все"
};

const els = {
  burgerBtn: document.getElementById("burgerBtn"),
  mobileMenu: document.getElementById("mobileMenu"),
  bookingModal: document.getElementById("bookingModal"),
  bookingForm: document.getElementById("bookingForm"),
  successBox: document.getElementById("successBox"),
  serviceSelect: document.getElementById("serviceSelect"),
  hygieneTypeWrap: document.getElementById("hygieneTypeWrap"),
  hygieneTypeSelect: document.getElementById("hygieneTypeSelect"),
  doctorSelect: document.getElementById("doctorSelect"),
  dateInput: document.getElementById("dateInput"),
  timeSelect: document.getElementById("timeSelect"),
  childAgeInput: document.getElementById("childAgeInput"),
  priceValue: document.getElementById("priceValue"),
  paymentHint: document.getElementById("paymentHint"),
  doctorsGrid: document.getElementById("doctorsGrid"),
  servicesGrid: document.getElementById("servicesGrid"),
  casesGrid: document.getElementById("casesGrid"),
  casesFilters: document.getElementById("casesFilters"),
  caseModal: document.getElementById("caseModal"),
  caseModalTitle: document.getElementById("caseModalTitle"),
  caseModalDescription: document.getElementById("caseModalDescription"),
  caseModalCompare: document.getElementById("caseModalCompare"),
  tourContent: document.getElementById("tourContent"),
  reviewsGrid: document.getElementById("reviewsGrid"),
  faqList: document.getElementById("faqList"),
  contactsMap: document.getElementById("contactsMap"),
  schemaData: document.getElementById("schemaData"),
  heroMedia: document.getElementById("heroMedia")
  ,
  doctorsPrev: document.getElementById("doctorsPrev"),
  doctorsNext: document.getElementById("doctorsNext")
};

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;
}

function hasImage(src) {
  return Boolean(src);
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function setHeaderAndContacts() {
  const phoneHref = `tel:${clinicConfig.phone.replace(/\s+/g, "")}`;
  const waHref = `https://wa.me/${clinicConfig.whatsapp.replace(/\D/g, "")}`;
  const routeLink = clinicConfig.mapUrl || "https://2gis.kz/aktau";

  document.getElementById("headerInstagram").href = clinicConfig.instagram;
  document.getElementById("headerWhatsApp").href = waHref;
  const headerPhone = document.getElementById("headerPhone");
  headerPhone.href = phoneHref;
  headerPhone.textContent = clinicConfig.phone;

  document.getElementById("casesInstagramLink").href = clinicConfig.instagram;

  document.getElementById("tourRouteLink").href = routeLink;

  document.getElementById("contactsAddress").textContent = clinicConfig.address;
  document.getElementById("contactsWorkTime").textContent = clinicConfig.workTime;
  const contactsPhone = document.getElementById("contactsPhone");
  contactsPhone.href = phoneHref;
  contactsPhone.textContent = clinicConfig.phone;
  const contactsWa = document.getElementById("contactsWhatsApp");
  contactsWa.href = waHref;
  const contactsInsta = document.getElementById("contactsInstagram");
  contactsInsta.href = clinicConfig.instagram;
  document.getElementById("contactsRouteLink").href = routeLink;

  document.getElementById("footerText").textContent = `${clinicConfig.name}, ${clinicConfig.city}. ${clinicConfig.address}. ${clinicConfig.workTime}.`;
}

function renderHeroMedia() {
  const imgPath = "assets/hero/hero-clinic.jpg";
  if (hasImage(imgPath)) {
    els.heroMedia.innerHTML = `<img src="${imgPath}" alt="Интерьер детской стоматологии ${clinicConfig.name}" loading="lazy" data-fallback-text="${clinicConfig.name} · ${clinicConfig.city}" />`;
  } else {
    els.heroMedia.innerHTML = `<div class="hero-fallback">${clinicConfig.name} · ${clinicConfig.city}</div>`;
  }
  setupImageFallbacks();
}

function renderServices() {
  els.servicesGrid.innerHTML = serviceCatalog.map((service) => {
    const variantsHtml = Array.isArray(service.variants)
      ? `<ul class="service-variants">${service.variants.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : "";
    const priceHtml = service.priceLabel ? `<div class="price">${service.priceLabel}</div>` : "";

    return `
      <article class="service-card reveal">
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        ${priceHtml}
        ${variantsHtml}
        <button class="btn btn--ghost" data-open-booking data-service="${service.name}">${service.bookingLabel}</button>
      </article>
    `;
  }).join("");
}

function renderDoctors() {
  els.doctorsGrid.innerHTML = doctorsData.map((doctor) => {
    const photoHtml = hasImage(doctor.photo)
      ? `<div class="doctor-photo"><img src="${doctor.photo}" alt="${doctor.name}" loading="lazy" data-fallback-text="${getInitials(doctor.name)}" /></div>`
      : `<div class="doctor-fallback">${getInitials(doctor.name)}</div>`;

    return `
      <article class="doctor-card reveal">
        ${photoHtml}
        <h3>${doctor.name}</h3>
        <p>${doctor.position}</p>
        <p class="doctor-services">${doctor.services.join(", ")}</p>
        <div class="doctor-duration">${doctor.duration}</div>
        <button class="btn btn--ghost" data-open-booking data-doctor-id="${doctor.id}">Записаться к врачу</button>
      </article>
    `;
  }).join("");
  setupImageFallbacks();
}

function setupDoctorsCarousel() {
  const track = els.doctorsGrid;
  if (!track || !els.doctorsPrev || !els.doctorsNext) return;

  const smoothScrollBy = (distance, duration = 520) => {
    const start = track.scrollLeft;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      track.scrollLeft = start + distance * easeOutCubic(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const getStep = () => {
    const firstCard = track.querySelector(".doctor-card");
    if (!firstCard) return 300;
    return firstCard.getBoundingClientRect().width + 16;
  };

  els.doctorsPrev.addEventListener("click", () => {
    smoothScrollBy(-getStep());
  });

  els.doctorsNext.addEventListener("click", () => {
    smoothScrollBy(getStep());
  });
}

function renderCasesFilters() {
  const categories = ["Все", ...new Set(casesData.map((item) => item.category))];
  els.casesFilters.innerHTML = categories.map((category) => `
    <button class="filter-btn ${category === state.selectedCaseCategory ? "active" : ""}" data-category="${category}">${category}</button>
  `).join("");

  els.casesFilters.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedCaseCategory = btn.dataset.category;
      renderCasesFilters();
      renderCases();
    });
  });
}

function caseComparePart(src, label, title) {
  if (hasImage(src)) {
    return `<div class="compare-part"><img src="${src}" alt="${label}: ${title}" loading="lazy" data-fallback-text="${label}<br />${title}" /></div>`;
  }
  return `<div class="compare-part"><div class="compare-fallback">${label}<br />${title}</div></div>`;
}

function openCaseModal(caseItem) {
  els.caseModalTitle.textContent = caseItem.title;
  els.caseModalDescription.textContent = caseItem.description;
  els.caseModalCompare.innerHTML = `
    ${caseComparePart(caseItem.before, "До", caseItem.title)}
    ${caseComparePart(caseItem.after, "После", caseItem.title)}
  `;
  els.caseModal.classList.add("open");
  els.caseModal.setAttribute("aria-hidden", "false");
  setupImageFallbacks();
}

function renderCases() {
  const list = state.selectedCaseCategory === "Все"
    ? casesData
    : casesData.filter((item) => item.category === state.selectedCaseCategory);

  els.casesGrid.innerHTML = list.map((item, index) => `
    <article class="case-card reveal" data-case-index="${index}">
      <div class="case-card__top">
        <strong>${item.title}</strong>
        <span>${item.category}</span>
      </div>
      <div class="case-card__compare">
        ${caseComparePart(item.before, "До", item.title)}
        ${caseComparePart(item.after, "После", item.title)}
      </div>
      <div class="case-card__body">
        <p>${item.description}</p>
      </div>
    </article>
  `).join("");

  const filtered = state.selectedCaseCategory === "Все"
    ? casesData
    : casesData.filter((item) => item.category === state.selectedCaseCategory);

  els.casesGrid.querySelectorAll(".case-card").forEach((card, idx) => {
    card.addEventListener("click", () => openCaseModal(filtered[idx]));
  });
  setupImageFallbacks();
}

function renderTour() {
  const routeLink = clinicConfig.mapUrl || "https://2gis.kz/aktau";
  const openLink = document.getElementById("tourOpenLink");

  if (clinicConfig.tourUrl) {
    openLink.href = clinicConfig.tourUrl;
    els.tourContent.innerHTML = `<iframe src="${clinicConfig.tourUrl}" title="3D-тур клиники Sevil Kids" loading="lazy"></iframe>`;
  } else {
    openLink.href = routeLink;
    els.tourContent.innerHTML = `
      <div class="interior-grid">
        ${interiorImages.map((image) => `
          <div class="interior-item">
            ${hasImage(image.src)
              ? `<img src="${image.src}" alt="${image.alt}" loading="lazy" data-fallback-text="${image.alt}" />`
              : `<div class="compare-fallback">${image.alt}</div>`}
          </div>
        `).join("")}
      </div>
    `;
  }
  setupImageFallbacks();
}

function renderReviews() {
  els.reviewsGrid.innerHTML = reviewsData.map((review) => `
    <article class="review-card reveal">
      <h3>${review.parentName}</h3>
      <div class="review-rating">${"★".repeat(review.rating)}</div>
      <p>${review.text}</p>
      <div class="review-source">Источник: ${review.source}</div>
    </article>
  `).join("");
}

function renderFaq() {
  els.faqList.innerHTML = faqData.map((item, idx) => `
    <details class="faq-item reveal" ${idx === 0 ? "open" : ""}>
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    </details>
  `).join("");
}

function renderMap() {
  if (clinicConfig.mapUrl) {
    els.contactsMap.innerHTML = `<iframe src="${clinicConfig.mapUrl}" title="Карта Sevil Kids" loading="lazy"></iframe>`;
  } else {
    els.contactsMap.innerHTML = `<div class="map-fallback">Маршрут до клиники доступен по кнопке «Построить маршрут»</div>`;
  }
}

function setSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinicConfig.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: clinicConfig.city,
      streetAddress: clinicConfig.address
    },
    telephone: clinicConfig.phone,
    openingHours: clinicConfig.workTime,
    url: window.location.href,
    sameAs: [clinicConfig.instagram]
  };

  els.schemaData.textContent = JSON.stringify(schema);
}

function setupBookingForm() {
  const today = new Date();
  els.dateInput.min = today.toISOString().slice(0, 10);

  els.serviceSelect.innerHTML = `
    <option value="">Выберите услугу</option>
    <option value="Консультация">Консультация</option>
    <option value="Профессиональная гигиена">Профессиональная гигиена</option>
  `;

  els.hygieneTypeSelect.innerHTML = `
    <option value="Лёгкая чистка">Лёгкая чистка</option>
    <option value="Средняя чистка">Средняя чистка</option>
    <option value="Air Flow">Air Flow</option>
    <option value="Prophylaxis Master">Prophylaxis Master</option>
  `;

  els.timeSelect.innerHTML = `<option value="">Выберите время</option>${availableSlots.map((slot) => `<option value="${slot}">${slot}</option>`).join("")}`;

  updateDoctorsByService();
  updatePrice();

  els.serviceSelect.addEventListener("change", () => {
    updateDoctorsByService();
    toggleHygieneSelect();
    updatePrice();
  });

  els.doctorSelect.addEventListener("change", () => {
    updateDurationHint();
  });

  els.hygieneTypeSelect.addEventListener("change", updatePrice);
  els.childAgeInput.addEventListener("input", updatePrice);
}

function toggleHygieneSelect() {
  const selectedService = els.serviceSelect.value;
  const isHygiene = selectedService === "Профессиональная гигиена";
  els.hygieneTypeWrap.hidden = !isHygiene;
}

function updateDoctorsByService() {
  const service = els.serviceSelect.value;
  const filtered = !service
    ? doctorsData
    : doctorsData.filter((doctor) => doctor.services.includes(service));

  els.doctorSelect.innerHTML = `<option value="">Выберите врача</option>${filtered.map((doctor) => `<option value="${doctor.id}">${doctor.name}</option>`).join("")}`;
  updateDurationHint();
}

function updateDurationHint() {
  const doctorId = els.doctorSelect.value;
  const service = els.serviceSelect.value;
  const doctor = doctorsData.find((item) => item.id === doctorId);
  if (!doctor || !service) {
    els.paymentHint.textContent = clinicConfig.paymentUrl
      ? "Для подтверждения нажмите «Перейти к оплате»."
      : "Администратор отправит ссылку на оплату после подтверждения записи.";
    return;
  }

  const duration = doctor.durations?.[service] || doctor.duration;
  els.paymentHint.textContent = `Длительность приёма: ${duration}. ${clinicConfig.paymentUrl
    ? "После отправки можно перейти к оплате."
    : "Администратор отправит ссылку на оплату после подтверждения записи."}`;
}

function getCalculatedPrice() {
  const service = els.serviceSelect.value;
  const age = Number(els.childAgeInput.value || 0);

  if (service === "Консультация") {
    return age >= 16 ? servicePrices.consultation.teenAndAdult : servicePrices.consultation.child;
  }

  if (service === "Профессиональная гигиена") {
    const hygieneType = els.hygieneTypeSelect.value;
    if (hygieneType === "Лёгкая чистка") return servicePrices.hygiene.light;
    if (hygieneType === "Средняя чистка") return servicePrices.hygiene.medium;
    if (hygieneType === "Prophylaxis Master") return servicePrices.hygiene.prophylaxisMaster;
    if (hygieneType === "Air Flow") return age <= 9 ? servicePrices.hygiene.airFlowUnder9 : servicePrices.hygiene.airFlow10to16;
  }

  return servicePrices.consultation.child;
}

function updatePrice() {
  const value = getCalculatedPrice();
  els.priceValue.textContent = formatPrice(value);
  updateDurationHint();
}

function openBookingModal(preset = {}) {
  els.bookingModal.classList.add("open");
  els.bookingModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (preset.service) {
    els.serviceSelect.value = preset.service;
    toggleHygieneSelect();
    updateDoctorsByService();
  }

  if (preset.doctorId) {
    els.doctorSelect.value = preset.doctorId;
  }

  updatePrice();
}

function closeBookingModal() {
  els.bookingModal.classList.remove("open");
  els.bookingModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  els.successBox.hidden = true;
  els.bookingForm.hidden = false;
}

function closeCaseModal() {
  els.caseModal.classList.remove("open");
  els.caseModal.setAttribute("aria-hidden", "true");
}

function sendBookingRequest(payload) {
  // TODO: Подключить отправку payload в backend/Bitrix/WhatsApp/Dentist Plus.
  console.log("bookingRequest", payload);
}

function submitBooking(event) {
  event.preventDefault();

  const formData = new FormData(els.bookingForm);
  const payload = {
    createdAt: new Date().toISOString(),
    service: formData.get("service"),
    hygieneType: formData.get("hygieneType") || "",
    doctorId: formData.get("doctor"),
    doctorName: doctorsData.find((doc) => doc.id === formData.get("doctor"))?.name || "",
    date: formData.get("date"),
    time: formData.get("time"),
    parentName: formData.get("parentName"),
    childName: formData.get("childName"),
    childAge: Number(formData.get("childAge")),
    phone: formData.get("phone"),
    comment: formData.get("comment"),
    consent: document.getElementById("consentInput").checked,
    amount: getCalculatedPrice()
  };

  if (!payload.service || !payload.doctorId || !payload.date || !payload.time || !payload.parentName || !payload.childName || !payload.phone || !payload.consent) {
    alert("Пожалуйста, заполните обязательные поля формы.");
    return;
  }

  const today = new Date();
  const selectedDate = new Date(payload.date + "T00:00:00");
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (selectedDate < todayDate) {
    alert("Выберите дату не раньше сегодняшнего дня.");
    return;
  }

  const requests = JSON.parse(localStorage.getItem("bookingRequests") || "[]");
  requests.push(payload);
  localStorage.setItem("bookingRequests", JSON.stringify(requests));

  sendBookingRequest(payload);

  els.bookingForm.hidden = true;
  els.successBox.hidden = false;

  if (clinicConfig.paymentUrl) {
    const paymentButton = document.createElement("a");
    paymentButton.href = clinicConfig.paymentUrl;
    paymentButton.target = "_blank";
    paymentButton.rel = "noreferrer";
    paymentButton.className = "btn btn--solid";
    paymentButton.textContent = "Перейти к оплате";
    paymentButton.setAttribute("aria-label", "Перейти к оплате");

    const existing = els.successBox.querySelector("a.btn");
    if (existing) existing.remove();
    els.successBox.appendChild(paymentButton);
  }
}

function setupInteractions() {
  els.burgerBtn?.addEventListener("click", () => {
    const expanded = els.burgerBtn.getAttribute("aria-expanded") === "true";
    els.burgerBtn.setAttribute("aria-expanded", String(!expanded));
    els.mobileMenu.classList.toggle("open");
  });

  els.mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      els.mobileMenu.classList.remove("open");
      els.burgerBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.closest("[data-open-booking]")) {
      const trigger = target.closest("[data-open-booking]");
      const preset = {
        service: trigger?.getAttribute("data-service") || "",
        doctorId: trigger?.getAttribute("data-doctor-id") || ""
      };
      openBookingModal(preset);
    }

    if (target.closest("[data-close-booking]")) closeBookingModal();
    if (target.closest("[data-close-case]")) closeCaseModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (els.bookingModal.classList.contains("open")) closeBookingModal();
      if (els.caseModal.classList.contains("open")) closeCaseModal();
    }
  });

  els.bookingForm.addEventListener("submit", submitBooking);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupImageFallbacks() {
  document.querySelectorAll("img[data-fallback-text]").forEach((img) => {
    img.addEventListener("error", () => {
      const fallbackText = img.getAttribute("data-fallback-text") || "";
      if (img.closest(".hero-media")) {
        img.closest(".hero-media").innerHTML = `<div class="hero-fallback">${fallbackText}</div>`;
        return;
      }

      if (img.closest(".doctor-photo")) {
        img.closest(".doctor-photo").outerHTML = `<div class="doctor-fallback">${fallbackText}</div>`;
        return;
      }

      const comparePart = img.closest(".compare-part");
      if (comparePart) {
        comparePart.innerHTML = `<div class="compare-fallback">${fallbackText}</div>`;
        return;
      }

      const interiorItem = img.closest(".interior-item");
      if (interiorItem) {
        interiorItem.innerHTML = `<div class="compare-fallback">${fallbackText}</div>`;
      }
    }, { once: true });
  });
}

function init() {
  setHeaderAndContacts();
  renderHeroMedia();
  renderServices();
  renderDoctors();
  setupDoctorsCarousel();
  renderCasesFilters();
  renderCases();
  renderTour();
  renderReviews();
  renderFaq();
  renderMap();
  setSchema();
  setupBookingForm();
  setupInteractions();
  setupImageFallbacks();
}

init();
