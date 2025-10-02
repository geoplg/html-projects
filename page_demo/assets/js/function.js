// flight-panel.js
document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // 1. MAIN PAGE FUNCTIONALITY (outside flight panel)
  // =============================================
  
  // Tab switching functionality
  function switchTab(button, tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.tab-content-box').forEach(tab => tab.classList.add('d-none'));
    document.getElementById(tabId).classList.remove('d-none');
  }

  // Contact dropdown toggle
  function toggleDropdown() {
    const dropdown = document.getElementById("contactDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }

  // Toast notification
  const toastCloseBtn = document.getElementById('toastCloseBtn');
  const toastEl = document.getElementById('myToast');
  if (toastCloseBtn && toastEl) {
    toastCloseBtn.addEventListener('click', function() {
      const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
      toast.hide();
    });
  }

  // Sliders in main content
  const sliderMin = document.getElementById('sliderMin');
  const sliderMax = document.getElementById('sliderMax');
  if (sliderMin && sliderMax) {
    function updateSlider() {
      if (parseFloat(sliderMin.value) > parseFloat(sliderMax.value)) {
        sliderMin.value = sliderMax.value;
      }
      if (parseFloat(sliderMax.value) < parseFloat(sliderMin.value)) {
        sliderMax.value = sliderMin.value;
      }
      
      document.getElementById('minValue').textContent = parseFloat(sliderMin.value).toFixed(1);
      document.getElementById('maxValue').textContent = parseFloat(sliderMax.value).toFixed(1);
      
      const minPercent = (sliderMin.value / sliderMin.max) * 100;
      const maxPercent = (sliderMax.value / sliderMax.max) * 100;
      document.getElementById('sliderProgress').style.left = minPercent + '%';
      document.getElementById('sliderProgress').style.width = (maxPercent - minPercent) + '%';
    }

    sliderMin.addEventListener('input', updateSlider);
    sliderMax.addEventListener('input', updateSlider);
    updateSlider();
  }

  // Popovers initialization
  const popoverButtons = document.querySelectorAll('[data-bs-toggle="popover"]');
  let currentPopover = null;
  let currentButton = null;

  popoverButtons.forEach(button => {
    const popover = new bootstrap.Popover(button, {
      html: true,
      trigger: 'manual'
    });

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentPopover && currentButton === button) {
        currentPopover.hide();
        currentPopover = null;
        currentButton = null;
      } else {
        if (currentPopover) currentPopover.hide();
        popover.show();
        currentPopover = popover;
        currentButton = button;
      }
    });
  });

  document.addEventListener('click', () => {
    if (currentPopover) {
      currentPopover.hide();
      currentPopover = null;
      currentButton = null;
    }
  });

  // Carousel progress indicator
  const carousel = document.querySelector('#hotelCarousel1');
  if (carousel) {
    const circle = carousel.querySelector('.circle');
    if (circle) {
      const totalSlides = carousel.querySelectorAll('.carousel-item').length;
      
      carousel.addEventListener('slid.bs.carousel', (e) => {
        const index = e.to;
        const percent = ((index + 1) / totalSlides) * 100;
        circle.style.strokeDasharray = `${percent}, 100`;
      });

      const activeIndex = [...carousel.querySelectorAll('.carousel-item')]
        .findIndex(item => item.classList.contains('active'));
      const initialPercent = ((activeIndex + 1) / totalSlides) * 100;
      circle.style.strokeDasharray = `${initialPercent}, 100`;
    }
  }
  
  //  toggle all checkboxes
const selectAllBtn = document.getElementById('selectAllBtn');

selectAllBtn.addEventListener('click', () => {
  // Get the parent container of the button, here the div with class 'single-accordion-body'
  const container = selectAllBtn.closest('.single-accordion-body');

  // Find checkboxes only inside that container
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');

  // Check if all are already checked
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);

  // Toggle all checkboxes in this container only
  checkboxes.forEach(cb => cb.checked = !allChecked);
});

// RIGHT-SLIDE PANEL SYSTEM 
  const PanelSystem = {
    initPanel: function(panelId, overlayId, triggerId, initCallback) {
      const panel = document.getElementById(panelId);
      const overlay = document.getElementById(overlayId);
      const trigger = triggerId ? document.getElementById(triggerId) : null;
      
      if (!panel || !overlay) return;
      
      const closeBtn = panel.querySelector('.panel-close-btn');
      const backBtn = panel.querySelector('.panel-back-btn');
      
      // Open panel
      const openPanel = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        document.body.classList.add('panel-open');
        panel.classList.add('open');
        overlay.classList.add('open');
        
        // Initialize panel content if callback provided
        if (initCallback) initCallback(panel);
      };
      
      // Close panel
      const closePanel = () => {
        document.body.classList.remove('panel-open');
        panel.classList.remove('open');
        overlay.classList.remove('open');
      };
      
      // Event listeners
      if (trigger) trigger.addEventListener('click', openPanel);
      if (closeBtn) closeBtn.addEventListener('click', closePanel);
      if (backBtn) backBtn.addEventListener('click', closePanel);
      overlay.addEventListener('click', closePanel);
      
      // Stop propagation when clicking inside panel
      panel.addEventListener('click', (e) => e.stopPropagation());
    }
  };

// FLIGHT PANEL 1 
  function initFlightPanelContent(panel) {
    // Accordion functionality
    const accordionButtons = panel.querySelectorAll('[data-bs-toggle="collapse"]');
    
    accordionButtons.forEach(button => {
      const target = button.getAttribute('data-bs-target');
      const targetElement = panel.querySelector(target);
      const icon = button.querySelector('.chevron-icon');
      
      if (icon && targetElement) {
        // Set initial state
        if (targetElement.classList.contains('show')) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        }
        
        // Toggle on click
        button.addEventListener('click', function() {
          setTimeout(() => {
            if (targetElement.classList.contains('show')) {
              icon.classList.remove('fa-chevron-down');
              icon.classList.add('fa-chevron-up');
            } else {
              icon.classList.remove('fa-chevron-up');
              icon.classList.add('fa-chevron-down');
            }
          }, 50);
        });
      }
    });

    // "Select All" functionality
    const selectAllBtn = panel.querySelector('#selectAllBtn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', function() {
        const container = this.closest('.single-accordion-body');
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
          cb.checked = !allChecked;
          const event = new Event('change');
          cb.dispatchEvent(event);
        });
      });
    }

    // Initialize sliders in flight panel
    function initSliders() {
      function formatGreekTime(hourFloat) {
        if (hourFloat < 0) hourFloat = 0;
        if (hourFloat >= 24) hourFloat = 23.9833;

        let hour = Math.floor(hourFloat);
        let minutes = Math.round((hourFloat - hour) * 60);
        if (minutes === 60) { minutes = 0; hour = (hour + 1) % 24; }

        const period = hour < 12 ? "πμ" : "μμ";
        const hourStr = hour === 0 ? "00" : hour < 10 ? "0" + hour : hour.toString();
        const minStr = minutes < 10 ? "0" + minutes : minutes.toString();

        return `${hourStr}:${minStr} ${period}`;
      }

      panel.querySelectorAll('.distance-slider-container').forEach(container => {
        const sliderMin = container.querySelector('.slider-min');
        const sliderMax = container.querySelector('.slider-max');
        const minValue = container.querySelector('.minValue');
        const maxValue = container.querySelector('.maxValue');
        const sliderProgress = container.querySelector('.slider-progress');

        function updateSlider() {
          if (parseFloat(sliderMin.value) > parseFloat(sliderMax.value)) {
            sliderMin.value = sliderMax.value;
          }
          if (parseFloat(sliderMax.value) < parseFloat(sliderMin.value)) {
            sliderMax.value = sliderMin.value;
          }

          if (container.classList.contains('time-slider')) {
            minValue.textContent = formatGreekTime(parseFloat(sliderMin.value));
            maxValue.textContent = formatGreekTime(parseFloat(sliderMax.value));
          } else if (container.classList.contains('duration-slider')) {
            minValue.textContent = `${parseFloat(sliderMin.value).toFixed(1)} ώρες`;
            maxValue.textContent = `${parseFloat(sliderMax.value).toFixed(1)} ώρες`;
          } else {
            minValue.textContent = parseFloat(sliderMin.value).toFixed(1);
            maxValue.textContent = parseFloat(sliderMax.value).toFixed(1);
          }

          const minPercent = (sliderMin.value / sliderMin.max) * 100;
          const maxPercent = (sliderMax.value / sliderMax.max) * 100;
          sliderProgress.style.left = `${minPercent}%`;
          sliderProgress.style.width = `${maxPercent - minPercent}%`;
        }

        sliderMin.addEventListener('input', updateSlider);
        sliderMax.addEventListener('input', updateSlider);
        updateSlider();
      });
    }
    initSliders();

    // Flight selection functionality
    function initFlightSelection() {
      const flightBoxes = panel.querySelectorAll('.selectable-plane-details');
      
      flightBoxes.forEach((box, index) => {
        if (index === 0) {
          // First box - click anywhere to select
          box.addEventListener('click', function() {
            flightBoxes.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
          });
        } else {
          // Other boxes - only select via button click
          const selectButtons = box.querySelectorAll('.price-info-btn');
          selectButtons.forEach(button => {
            button.addEventListener('click', function(e) {
              e.stopPropagation();
              flightBoxes.forEach(b => b.classList.remove('selected'));
              box.classList.add('selected');
            });
          });
        }
      });
    }
    initFlightSelection();
  }
  
PanelSystem.initPanel('flightPanel', 'flightPanelOverlay', 'openFlightPanelBtn', initFlightPanelContent);

  
// FLIGHT PANEL 2
	PanelSystem.initPanel('flightPanel2', 'flightPanelOverlay2', 'openFlightPanel2Btn', function(panel) {
	  panel.querySelectorAll('.accordion-toggle').forEach(toggle => {
		toggle.addEventListener('click', function() {
		  // Panel-specific accordion logic
		  const accordion = this.closest('.flight-accordion');
		  const isOpening = !accordion.classList.contains('active');
		  
		  // Close others in this panel first
		  panel.querySelectorAll('.flight-accordion').forEach(acc => {
			acc.classList.remove('active');
		  });
		  
		  // Open current if clicking to open
		  if (isOpening) {
			accordion.classList.add('active');
		  }
		  
		  // Toggle chevron icon
		  const icon = this.querySelector('i');
		  if (icon) {
			icon.classList.toggle('fa-chevron-down', !isOpening);
			icon.classList.toggle('fa-chevron-up', isOpening);
		  }
		});
	  });
	});

// HOTEL PANEL
PanelSystem.initPanel('hotelPanel', 'hotelPanelOverlay', 'openHotelPanelBtn');
 
// GLOBAL EVENT LISTENERS
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.panel-container.open').forEach(panel => {
        const overlayId = panel.id.replace('Panel', 'PanelOverlay');
        const overlay = document.getElementById(overlayId);
        if (overlay) {
          panel.classList.remove('open');
          overlay.classList.remove('open');
          document.body.classList.remove('panel-open');
        }
      });
    }
  });
});