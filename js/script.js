// ============================
// TransportCo Website - script.js
// ============================

// ----------------------------
// DOM Content Loaded
// ----------------------------
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeStatsCounter();
    initializeSmoothScrolling();
    initializeFormHandlers();
    initializeHeroAnimations();
    initializeBookingProcess();
    initializeFleetFilters();
    initializeServiceNavigation();
    initializeDateRestrictions();
    initializeVehicleComparison();
    initializeTrackingSystem();
    initializeEnhancedValidation();
});

// ----------------------------
// Enhanced Validation System
// ----------------------------
function initializeEnhancedValidation() {
    // Phone number validation (12 digits max)
    document.addEventListener('input', function(e) {
        if (e.target.type === 'tel' || e.target.id.includes('phone')) {
            const input = e.target;
            const value = input.value.replace(/\D/g, ''); // Remove non-digits
            
            if (value.length > 12) {
                input.value = value.slice(0, 12);
            } else {
                input.value = value;
            }
        }
        
        // Name validation (letters and spaces only)
        if (e.target.id.includes('name') || e.target.name.includes('name')) {
            const input = e.target;
            const value = input.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letters and non-spaces
            
            // Capitalize first letter of each word
            input.value = value.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });
}

// ----------------------------
// Tracking System Enhancement
// ----------------------------
function initializeTrackingSystem() {
    const trackingForms = document.querySelectorAll('#shipmentTrackingForm, #vehicleTrackingForm, #bookingTrackingForm');
    
    trackingForms.forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleTrackingSubmission(this);
            });
        }
    });

    // Tracking tab functionality
    const trackingTabs = document.querySelectorAll('.tracking-tab');
    if (trackingTabs.length > 0) {
        trackingTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.getAttribute('data-tab');
                switchTrackingTab(tabType);
            });
        });
    }

    // Tracking result actions
    const refreshBtn = document.getElementById('refreshTracking');
    const shareBtn = document.getElementById('shareTracking');
    const supportBtn = document.getElementById('contactSupport');
    const printBtn = document.getElementById('printResult');
    const tryAgainBtn = document.getElementById('tryAgainButton');

    if (refreshBtn) refreshBtn.addEventListener('click', refreshTracking);
    if (shareBtn) shareBtn.addEventListener('click', shareTracking);
    if (supportBtn) supportBtn.addEventListener('click', contactSupport);
    if (printBtn) printBtn.addEventListener('click', printTrackingDetails);
    if (tryAgainBtn) tryAgainBtn.addEventListener('click', tryAnotherTracking);
}

function handleTrackingSubmission(form) {
    const trackingId = form.querySelector('input[type="text"]').value.trim();
    const resultBox = document.getElementById('trackingResult');
    const noResultsBox = document.getElementById('noTrackingResult');
    
    if (!trackingId) {
        showNotification('Please enter a tracking ID', 'error');
        return;
    }

    showLoadingState(form);
    
    // Simulated API call with realistic delay
    setTimeout(() => {
        hideLoadingState(form);
        
        // Enhanced tracking data with more realistic information
        const trackingData = generateEnhancedTrackingData(trackingId);
        
        if (trackingData.found) {
            displayTrackingResults(trackingData);
            resultBox.style.display = 'block';
            noResultsBox.style.display = 'none';
            resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            resultBox.style.display = 'none';
            noResultsBox.style.display = 'block';
            noResultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
    }, 1500);
}

function generateEnhancedTrackingData(trackingId) {
    // Enhanced tracking data with more realistic scenarios
    const trackingPatterns = {
        'shipment': /^TC-CRG-\d{4}-/,
        'vehicle': /^(KCA|KCB|KCC|KCD|KCE|KCF|KCG|KCH|KCI|KCJ|KCK|KCL|KCM|KCN|KCO|KCP|KCQ|KCR|KCS|KCT|KCU|KCV|KCW|KCX|KCY|KCZ)/i,
        'booking': /^TC-BKG-\d{4}-/
    };

    let trackingType = 'unknown';
    for (const [type, pattern] of Object.entries(trackingPatterns)) {
        if (pattern.test(trackingId)) {
            trackingType = type;
            break;
        }
    }

    // More realistic status scenarios based on tracking ID
    const scenarios = [
        {
            status: 'Package Received',
            class: 'received',
            location: 'Nairobi Sorting Facility',
            vehicle: 'Not assigned',
            speed: '0 km/h',
            updated: getRecentTimestamp(30), // 30 minutes ago
            estimated: getFutureTimestamp(2) // 2 days from now
        },
        {
            status: 'In Transit',
            class: 'transit',
            location: 'Nairobi - Mombasa Highway',
            vehicle: 'Toyota Hiace - KCA 123A',
            speed: '65 km/h',
            updated: getRecentTimestamp(5), // 5 minutes ago
            estimated: getFutureTimestamp(1) // 1 day from now
        },
        {
            status: 'Out for Delivery',
            class: 'delivery',
            location: 'Mombasa Delivery Center',
            vehicle: 'Suzuki Carry - KCB 456B',
            speed: '25 km/h',
            updated: getRecentTimestamp(2), // 2 minutes ago
            estimated: getFutureTimestamp(0.5) // 12 hours from now
        },
        {
            status: 'Delivered',
            class: 'delivered',
            location: 'Destination - Mombasa',
            vehicle: 'Suzuki Carry - KCB 456B',
            speed: '0 km/h',
            updated: getRecentTimestamp(60), // 1 hour ago
            estimated: 'Delivered'
        }
    ];

    // Generate consistent scenario based on tracking ID hash
    let hash = 0;
    for (let i = 0; i < trackingId.length; i++) {
        hash = trackingId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const scenarioIndex = Math.abs(hash) % scenarios.length;
    const selectedScenario = scenarios[scenarioIndex];

    return {
        found: true,
        id: trackingId,
        type: trackingType,
        ...selectedScenario
    };
}

function getRecentTimestamp(minutesAgo) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutesAgo);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getFutureTimestamp(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function displayTrackingResults(data) {
    // Update all tracking result elements
    const elements = {
        'resultTitle': `Tracking Information - ${data.id}`,
        'displayTrackingId': data.id,
        'statusText': data.status,
        'locationText': data.location,
        'updatedText': data.updated,
        'estimatedText': data.estimated,
        'vehicleText': data.vehicle,
        'mapLocationText': data.location,
        'speedText': data.speed,
        'mapUpdateText': 'Just now'
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
        statusBadge.className = `status-badge status-${data.class}`;
        
        // Update status icon based on status
        const statusIcon = statusBadge.querySelector('.status-icon');
        if (statusIcon) {
            const icons = {
                'received': '📦',
                'transit': '🚚',
                'delivery': '📤',
                'delivered': '✅'
            };
            statusIcon.textContent = icons[data.class] || '📦';
        }
    }

    // Update timeline based on status
    updateProgressTimeline(data.class);
}

function updateProgressTimeline(currentStatus) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const statusOrder = ['received', 'transit', 'delivery', 'delivered'];
    
    timelineItems.forEach((item, index) => {
        item.classList.remove('completed', 'active');
        
        const statusClass = statusOrder[index];
        if (statusOrder.indexOf(currentStatus) > index) {
            item.classList.add('completed');
        } else if (statusClass === currentStatus) {
            item.classList.add('active');
        }
    });
}

function switchTrackingTab(tabType) {
    // Update active tab
    document.querySelectorAll('.tracking-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tracking-tab[data-tab="${tabType}"]`).classList.add('active');

    // Update active content
    document.querySelectorAll('.tracking-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabType}-tracking`).classList.add('active');

    // Clear previous results
    document.getElementById('trackingResult').style.display = 'none';
    document.getElementById('noTrackingResult').style.display = 'none';
}

function refreshTracking() {
    const currentTrackingId = document.getElementById('displayTrackingId').textContent;
    if (currentTrackingId && currentTrackingId !== '-') {
        showNotification('Refreshing tracking information...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            const updatedData = generateEnhancedTrackingData(currentTrackingId);
            displayTrackingResults(updatedData);
            showNotification('Tracking information updated', 'success');
        }, 1000);
    }
}

function shareTracking() {
    const trackingId = document.getElementById('displayTrackingId').textContent;
    const status = document.getElementById('statusText').textContent;
    
    const shareText = `Track my TransportCo shipment: ${trackingId}\nCurrent Status: ${status}\nView details: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'TransportCo Tracking',
            text: shareText,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Tracking link copied to clipboard!', 'success');
        });
    } else {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = shareText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('Tracking link copied to clipboard!', 'success');
    }
}

function contactSupport() {
    const trackingId = document.getElementById('displayTrackingId').textContent;
    const subject = `Support for Tracking: ${trackingId}`;
    const body = `I need assistance with my tracking ID: ${trackingId}\n\nCurrent Status: ${document.getElementById('statusText').textContent}`;
    
    window.location.href = `mailto:support@transportco.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function printTrackingDetails() {
    const printContent = document.getElementById('trackingResult').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>TransportCo Tracking - ${document.getElementById('displayTrackingId').textContent}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .status-badge { background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
                .tracking-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .detail-card { border: 1px solid #ddd; padding: 10px; margin: 5px 0; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <h1>TransportCo Tracking Details</h1>
            ${printContent}
            <div class="no-print">
                <p><small>Printed on: ${new Date().toLocaleString()}</small></p>
            </div>
        </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
}

function tryAnotherTracking() {
    document.getElementById('noTrackingResult').style.display = 'none';
    document.querySelector('.tracking-tab.active').click();
}

// ----------------------------
// Enhanced Form Validation
// ----------------------------
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        // Remove previous error states
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate required fields
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        }
        
        // Enhanced email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Enhanced phone validation (exactly 12 digits)
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanNumber = input.value.replace(/[\s\-\(\)]/g, '');
            
            if (!phoneRegex.test(cleanNumber)) {
                showFieldError(input, 'Please enter a valid phone number');
                isValid = false;
            } else if (cleanNumber.length !== 12) {
                showFieldError(input, 'Phone number must be exactly 12 digits');
                isValid = false;
            }
        }
        
        // Name validation (letters and spaces only)
        if ((input.id.includes('name') || input.name.includes('name')) && input.value.trim()) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(input.value)) {
                showFieldError(input, 'Name can only contain letters and spaces');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// ----------------------------
// Mobile Menu Toggle
// ----------------------------
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            const isExpanded = navbar.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (isExpanded) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && !mobileToggle.contains(e.target)) {
                navbar.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ----------------------------
// Smooth Scrolling
// ----------------------------
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external links
            if (href === '#' || href.startsWith('#!')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
}

// ----------------------------
// Stats Counter Animation
// ----------------------------
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.floor(current).toLocaleString();
                }, 16);

                // Add animation class
                statNumber.classList.add('animated');
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// ----------------------------
// Hero Section Animations
// ----------------------------
function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Add fade-in animation
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ----------------------------
// Multi-Step Booking Process
// ----------------------------
function initializeBookingProcess() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.querySelector('.progress-fill');
    const stepIndicators = document.querySelectorAll('.booking-steps .step');
    let currentStep = 0;

    // Initialize date restrictions
    initializeDateRestrictions();

    // Trip type change handler
    const tripTypeSelect = document.getElementById('tripType');
    if (tripTypeSelect) {
        tripTypeSelect.addEventListener('change', function() {
            const returnDateGroup = document.getElementById('returnDateGroup');
            if (this.value === 'round-trip') {
                returnDateGroup.style.display = 'grid';
                document.getElementById('returnDate').required = true;
            } else {
                returnDateGroup.style.display = 'none';
                document.getElementById('returnDate').required = false;
            }
        });
    }

    // Next button handlers
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    // Previous button handlers
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', function() {
            goToStep(currentStep - 1);
        });
    });

    // Vehicle selection
    document.querySelectorAll('.btn-select-vehicle').forEach(button => {
        button.addEventListener('click', function() {
            const vehicleCard = this.closest('.vehicle-card');
            const vehicleType = vehicleCard.getAttribute('data-vehicle');
            
            // Remove selected class from all cards
            document.querySelectorAll('.vehicle-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to current card
            vehicleCard.classList.add('selected');
            
            // Update hidden input
            document.getElementById('selectedVehicle').value = vehicleType;
            
            // Enable next button
            document.querySelector('.btn-next').disabled = false;
            
            // Update quote summary
            updateQuoteSummary(vehicleType);
        });
    });

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep) && validateForm(this)) {
            showLoadingState(this);
            simulateApiCall(() => {
                hideLoadingState(this);
                showBookingConfirmation();
                showNotification('Booking submitted successfully! Our team will contact you within 2 hours.', 'success');
            });
        }
    });

    function goToStep(step) {
        // Hide current step
        steps[currentStep].classList.remove('active');
        stepIndicators[currentStep].classList.remove('active');
        
        // Show new step
        steps[step].classList.add('active');
        stepIndicators[step].classList.add('active');
        
        // Update progress bar
        const progressPercentage = ((step + 1) / steps.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        currentStep = step;
        
        // Update summary if we're on the confirmation step
        if (step === 2) {
            updateBookingSummary();
        }
    }

    function validateStep(step) {
        const currentStepElement = steps[step];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(input);
            }

            // Additional validation for specific fields
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showFieldError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });

        return isValid;
    }
}

// ----------------------------
// Fleet Filtering System
// ----------------------------
function initializeFleetFilters() {
    const fleetGrid = document.getElementById('fleetGrid');
    if (!fleetGrid) return;

    const categoryLinks = document.querySelectorAll('.fleet-nav-link');
    const capacityFilter = document.getElementById('capacity-filter');
    const typeFilter = document.getElementById('type-filter');
    const resetButton = document.getElementById('reset-filters');
    const fleetCards = fleetGrid.querySelectorAll('.fleet-card');

    // Category navigation
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterFleet(category, capacityFilter.value, typeFilter.value);
        });
    });

    // Capacity filter
    if (capacityFilter) {
        capacityFilter.addEventListener('change', function() {
            const activeCategory = document.querySelector('.fleet-nav-link.active').getAttribute('data-category');
            filterFleet(activeCategory, this.value, typeFilter.value);
        });
    }

    // Type filter
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            const activeCategory = document.querySelector('.fleet-nav-link.active').getAttribute('data-category');
            filterFleet(activeCategory, capacityFilter.value, this.value);
        });
    }

    // Reset filters
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            categoryLinks.forEach(link => link.classList.remove('active'));
            categoryLinks[0].classList.add('active');
            
            if (capacityFilter) capacityFilter.value = 'all';
            if (typeFilter) typeFilter.value = 'all';
            
            filterFleet('all', 'all', 'all');
        });
    }

    function filterFleet(category, capacity, type) {
        let visibleCount = 0;
        
        fleetCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardCapacity = card.getAttribute('data-capacity');
            const cardType = card.getAttribute('data-type');
            
            const categoryMatch = category === 'all' || cardCategory === category;
            const capacityMatch = capacity === 'all' || cardCapacity === capacity;
            const typeMatch = type === 'all' || cardType === type;
            
            if (categoryMatch && capacityMatch && typeMatch) {
                card.style.display = 'block';
                visibleCount++;
                
                // Add fade-in animation
                card.style.animation = 'fadeInUp 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Show message if no vehicles match filters
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (!noResultsMessage && visibleCount === 0) {
            const message = document.createElement('div');
            message.id = 'noResultsMessage';
            message.className = 'no-results-message';
            message.innerHTML = `
                <h3>No vehicles match your filters</h3>
                <p>Try adjusting your filters or <a href="#" id="resetFiltersLink">reset all filters</a> to see all available vehicles.</p>
            `;
            fleetGrid.parentNode.insertBefore(message, fleetGrid);
            
            document.getElementById('resetFiltersLink').addEventListener('click', function(e) {
                e.preventDefault();
                resetButton.click();
            });
        } else if (noResultsMessage && visibleCount > 0) {
            noResultsMessage.remove();
        }
    }
}

// ----------------------------
// Service Navigation
// ----------------------------
function initializeServiceNavigation() {
    const serviceLinks = document.querySelectorAll('.service-nav-link');
    const serviceSections = document.querySelectorAll('.service-detail-section');

    if (serviceLinks.length === 0 || serviceSections.length === 0) return;

    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            serviceLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            serviceSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Scroll to section
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle URL hash on page load
    const hash = window.location.hash;
    if (hash) {
        const targetLink = document.querySelector(`.service-nav-link[href="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// ----------------------------
// Vehicle Comparison System
// ----------------------------
function initializeVehicleComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    const comparisonModal = document.getElementById('comparisonModal');
    const modalClose = document.getElementById('modalClose');
    const clearComparison = document.getElementById('clearComparison');
    const closeModal = document.getElementById('closeModal');
    
    if (!comparisonModal) return;

    let comparedVehicles = [];

    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-vehicle');
            const vehicleCard = this.closest('.fleet-card');
            const vehicleName = vehicleCard.querySelector('h3').textContent;
            
            if (this.classList.contains('compared')) {
                // Remove from comparison
                comparedVehicles = comparedVehicles.filter(v => v.id !== vehicleId);
                this.classList.remove('compared');
                this.textContent = 'Add to Compare';
            } else {
                // Add to comparison (max 3 vehicles)
                if (comparedVehicles.length >= 3) {
                    showNotification('You can compare up to 3 vehicles at a time.', 'error');
                    return;
                }
                
                comparedVehicles.push({
                    id: vehicleId,
                    name: vehicleName,
                    card: vehicleCard
                });
                this.classList.add('compared');
                this.textContent = 'Remove from Compare';
            }
            
            updateComparisonButton();
        });
    });

    // Update comparison button in fleet navigation
    function updateComparisonButton() {
        const compareButton = document.querySelector('.compare-vehicles-btn');
        if (compareButton) {
            if (comparedVehicles.length > 0) {
                compareButton.style.display = 'inline-block';
                compareButton.innerHTML = `Compare Vehicles (${comparedVehicles.length})`;
            } else {
                compareButton.style.display = 'none';
            }
        }
    }

    // Show comparison modal
    if (document.querySelector('.compare-vehicles-btn')) {
        document.querySelector('.compare-vehicles-btn').addEventListener('click', function() {
            showComparisonModal();
        });
    }

    function showComparisonModal() {
        if (comparedVehicles.length === 0) return;
        
        const comparisonTable = document.getElementById('comparisonTable');
        comparisonTable.innerHTML = generateComparisonTable();
        
        comparisonModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function generateComparisonTable() {
        if (comparedVehicles.length === 0) {
            return '<p>Select vehicles to compare their features and specifications.</p>';
        }

        let tableHTML = `
            <div class="comparison-table-scroll">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            ${comparedVehicles.map(vehicle => `<th>${vehicle.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Add specifications
        const specs = ['Passenger Capacity', 'Luggage Space', 'Air Conditioning', 'WiFi', 'Entertainment'];
        
        specs.forEach(spec => {
            tableHTML += `
                <tr>
                    <td>${spec}</td>
                    ${comparedVehicles.map(vehicle => {
                        // This would normally come from vehicle data
                        const value = getVehicleSpec(vehicle.id, spec);
                        return `<td>${value}</td>`;
                    }).join('')}
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        return tableHTML;
    }

    function getVehicleSpec(vehicleId, spec) {
        // Mock data - in real implementation, this would come from a data object
        const specs = {
            'executive-bus': {
                'Passenger Capacity': '50 seats',
                'Luggage Space': 'Large compartment',
                'Air Conditioning': 'Yes',
                'WiFi': 'Yes',
                'Entertainment': 'LCD screens'
            },
            'shuttle-van': {
                'Passenger Capacity': '14 seats',
                'Luggage Space': 'Medium space',
                'Air Conditioning': 'Yes',
                'WiFi': 'No',
                'Entertainment': 'No'
            },
            'executive-sedan': {
                'Passenger Capacity': '4 seats',
                'Luggage Space': 'Trunk space',
                'Air Conditioning': 'Yes',
                'WiFi': 'Yes',
                'Entertainment': 'Premium audio'
            },
            'cargo-truck': {
                'Passenger Capacity': '3 seats',
                'Luggage Space': '5-ton capacity',
                'Air Conditioning': 'Yes',
                'WiFi': 'No',
                'Entertainment': 'No'
            }
        };

        return specs[vehicleId]?.[spec] || 'N/A';
    }

    // Modal event handlers
    if (modalClose) {
        modalClose.addEventListener('click', hideComparisonModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', hideComparisonModal);
    }
    
    if (clearComparison) {
        clearComparison.addEventListener('click', function() {
            comparedVehicles = [];
            compareButtons.forEach(btn => {
                btn.classList.remove('compared');
                btn.textContent = 'Add to Compare';
            });
            updateComparisonButton();
            hideComparisonModal();
        });
    }

    // Close modal when clicking outside
    comparisonModal.addEventListener('click', function(e) {
        if (e.target === comparisonModal) {
            hideComparisonModal();
        }
    });

    function hideComparisonModal() {
        comparisonModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ----------------------------
// Date Restrictions
// ----------------------------
function initializeDateRestrictions() {
    const departureDate = document.getElementById('departureDate');
    const returnDate = document.getElementById('returnDate');
    
    if (departureDate) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        departureDate.min = today;
        
        // Update return date min when departure date changes
        departureDate.addEventListener('change', function() {
            if (returnDate) {
                returnDate.min = this.value;
                
                // If return date is before departure date, clear it
                if (returnDate.value && returnDate.value < this.value) {
                    returnDate.value = '';
                }
            }
        });
    }
}

// ----------------------------
// Quote Summary Update
// ----------------------------
function updateQuoteSummary(vehicleType) {
    const quoteSummary = document.getElementById('quoteSummary');
    if (!quoteSummary) return;

    const baseFare = document.getElementById('baseFare');
    const distanceCharge = document.getElementById('distanceCharge');
    const totalEstimate = document.getElementById('totalEstimate');

    // Mock pricing data
    const pricing = {
        'sedan': { base: 3500, distance: 1500 },
        'van': { base: 7200, distance: 2500 },
        'minibus': { base: 12000, distance: 4500 },
        'bus': { base: 25000, distance: 8000 }
    };

    const vehiclePricing = pricing[vehicleType] || pricing.sedan;
    
    if (baseFare) baseFare.textContent = `KES ${vehiclePricing.base.toLocaleString()}`;
    if (distanceCharge) distanceCharge.textContent = `KES ${vehiclePricing.distance.toLocaleString()}`;
    
    const total = vehiclePricing.base + vehiclePricing.distance + 500; // base + distance + service fee
    if (totalEstimate) totalEstimate.textContent = `KES ${total.toLocaleString()}`;
    
    quoteSummary.style.display = 'block';
}

// ----------------------------
// Booking Summary Update
// ----------------------------
function updateBookingSummary() {
    // Get form values
    const formData = new FormData(document.getElementById('bookingForm'));
    
    // Update summary elements
    const summaryElements = {
        'summary-service': formData.get('serviceType'),
        'summary-route': `${formData.get('fromLocation')} → ${formData.get('toLocation')}`,
        'summary-datetime': `${formData.get('departureDate')} at ${formData.get('departureTime')}`,
        'summary-passengers': formData.get('passengers'),
        'summary-vehicle': document.querySelector('.vehicle-card.selected h3')?.textContent || '-',
        'summary-cost': document.getElementById('totalEstimate')?.textContent || '-',
        'summary-name': formData.get('fullName'),
        'summary-email': formData.get('email'),
        'summary-phone': formData.get('phone')
    };

    Object.entries(summaryElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || '-';
        }
    });
}

// ----------------------------
// Booking Confirmation
// ----------------------------
function showBookingConfirmation() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmation = document.getElementById('bookingConfirmation');
    
    if (bookingForm && confirmation) {
        bookingForm.style.display = 'none';
        confirmation.style.display = 'block';
        
        // Generate booking reference
        const referenceNumber = `TC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        document.getElementById('referenceNumber').textContent = referenceNumber;
        
        // Set confirmation email
        const email = document.getElementById('email')?.value;
        if (email) {
            document.getElementById('confirmation-email').textContent = email;
        }
        
        // Scroll to confirmation
        confirmation.scrollIntoView({ behavior: 'smooth' });
        
        // New booking button
        document.getElementById('newBooking').addEventListener('click', function() {
            confirmation.style.display = 'none';
            bookingForm.style.display = 'block';
            bookingForm.reset();
            
            // Reset to first step
            const steps = document.querySelectorAll('.form-step');
            const stepIndicators = document.querySelectorAll('.booking-steps .step');
            const progressFill = document.querySelector('.progress-fill');
            
            steps.forEach(step => step.classList.remove('active'));
            stepIndicators.forEach(step => step.classList.remove('active'));
            
            steps[0].classList.add('active');
            stepIndicators[0].classList.add('active');
            progressFill.style.width = '33%';
        });
    }
}

// ----------------------------
// Form Handlers (Existing - Enhanced)
// ----------------------------
function initializeFormHandlers() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showLoadingState(this);
                simulateApiCall(() => {
                    hideLoadingState(this);
                    document.getElementById('contactConfirmation').style.display = 'block';
                    this.style.display = 'none';
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                });
            }
        });

        // Send another message button
        const sendAnother = document.getElementById('sendAnother');
        if (sendAnother) {
            sendAnother.addEventListener('click', function() {
                document.getElementById('contactConfirmation').style.display = 'none';
                contactForm.style.display = 'block';
                contactForm.reset();
            });
        }
    }

    // Careers Form
    const careersForm = document.getElementById('careersForm');
    if (careersForm) {
        careersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showLoadingState(this);
                simulateApiCall(() => {
                    hideLoadingState(this);
                    showNotification('Application submitted! We will review your qualifications and get back to you soon.', 'success');
                    this.reset();
                });
            }
        });
    }
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 5px;';
    input.parentNode.appendChild(errorElement);
}

function clearFieldError(input) {
    input.classList.remove('error');
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// ----------------------------
// Loading States (Existing)
// ----------------------------
function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
    submitButton.setAttribute('data-original-text', originalText);
    
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.disabled = true;
    });
}

function hideLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.getAttribute('data-original-text');
    
    submitButton.disabled = false;
    submitButton.textContent = originalText;
    
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.disabled = false;
    });
}

// ----------------------------
// Notification System (Existing)
// ----------------------------
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ----------------------------
// Utility Functions (Existing)
// ----------------------------
function simulateApiCall(callback, delay = 1500) {
    setTimeout(callback, delay);
}

// ----------------------------
// Scroll to Top Button (Existing)
// ----------------------------
function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #0a3d62;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
    `;
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(scrollButton);
}

// Initialize scroll to top button
createScrollToTopButton();

// ----------------------------
// Additional CSS Animations (Existing - Enhanced)
// ----------------------------
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { 
            opacity: 0;
            transform: translateY(30px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    input.error, textarea.error, select.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1) !important;
    }
    
    .tracking-status.received { color: #3498db; }
    .tracking-status.transit { color: #f39c12; }
    .tracking-status.delivery { color: #9b59b6; }
    .tracking-status.delivered { color: #27ae60; }
    
    .no-results-message {
        text-align: center;
        padding: 60px 40px;
        background: #f8f9fa;
        border-radius: 12px;
        margin: 40px 0;
    }
    
    .no-results-message h3 {
        color: #0a3d62;
        margin-bottom: 15px;
    }
    
    .no-results-message p {
        color: #666;
        margin-bottom: 0;
    }
    
    .comparison-table-scroll {
        overflow-x: auto;
    }
    
    .comparison-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
    }
    
    .comparison-table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #0a3d62;
    }
    
    .comparison-table tr:hover {
        background: #f8f9fa;
    }
    
    /* Enhanced tracking status styles */
    .status-received .status-badge { background: #e3f2fd; color: #1976d2; }
    .status-transit .status-badge { background: #fff3e0; color: #f57c00; }
    .status-delivery .status-badge { background: #f3e5f5; color: #7b1fa2; }
    .status-delivered .status-badge { background: #e8f5e8; color: #388e3c; }
    
    /* Print styles for tracking */
    @media print {
        .no-print { display: none !important; }
        body { font-family: Arial, sans-serif; margin: 20px; }
        .tracking-result { box-shadow: none !important; border: 1px solid #ddd !important; }
    }
`;
document.head.appendChild(style);

// ============================
// Job Application Enhancement
// ============================

// Enhanced Job Application Form with Real Validation
function initializeJobApplication() {
    const jobModal = document.getElementById('jobModal');
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    
    if (!jobModal || !jobApplicationForm) return;

    // Enhanced file upload validation
    const resumeInput = document.getElementById('applicantResume');
    if (resumeInput) {
        resumeInput.addEventListener('change', function(e) {
            validateResumeFile(this);
        });
    }

    // Enhanced phone number formatting
    const phoneInput = document.getElementById('applicantPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            formatPhoneNumber(this);
        });
    }

    // Enhanced form submission with file validation
    jobApplicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateEnhancedJobForm()) {
            submitJobApplication();
        }
    });

    // Enhanced real-time validation
    const requiredFields = jobApplicationForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateEnhancedField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateEnhancedJobForm() {
    let isValid = true;
    const errors = {};
    
    // Enhanced name validation
    const name = document.getElementById('applicantName').value.trim();
    if (!name) {
        errors.name = 'Full name is required';
        isValid = false;
    } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        errors.name = 'Name can only contain letters and spaces';
        isValid = false;
    }
    
    // Enhanced email validation
    const email = document.getElementById('applicantEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email address is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Enhanced phone validation
    const phone = document.getElementById('applicantPhone').value.trim();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phone) {
        errors.phone = 'Phone number is required';
        isValid = false;
    } else if (!phoneRegex.test(cleanPhone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
    } else if (cleanPhone.length < 10) {
        errors.phone = 'Phone number must be at least 10 digits';
        isValid = false;
    }
    
    // Enhanced experience validation
    const experience = document.getElementById('applicantExperience').value;
    if (!experience) {
        errors.experience = 'Please select your experience level';
        isValid = false;
    }
    
    // Enhanced cover letter validation
    const message = document.getElementById('applicantMessage').value.trim();
    if (!message) {
        errors.message = 'Cover letter is required';
        isValid = false;
    } else if (message.length < 50) {
        errors.message = 'Cover letter should be at least 50 characters long';
        isValid = false;
    } else if (message.length > 2000) {
        errors.message = 'Cover letter should not exceed 2000 characters';
        isValid = false;
    }
    
    // Enhanced resume validation
    const resumeFile = document.getElementById('applicantResume').files[0];
    if (resumeFile) {
        const resumeError = validateResumeFile(document.getElementById('applicantResume'));
        if (resumeError) {
            errors.resume = resumeError;
            isValid = false;
        }
    } else {
        errors.resume = 'Please upload your resume';
        isValid = false;
    }
    
    // Privacy agreement validation
    const privacyAgreement = document.getElementById('privacyAgreement').checked;
    if (!privacyAgreement) {
        errors.privacy = 'You must agree to the privacy policy';
        isValid = false;
    }
    
    // Display enhanced errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.style.display = 'block';
        }
    });
    
    // Clear errors for fields that are now valid
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        if (!Object.keys(errors).includes(element.id.replace('-error', ''))) {
            element.textContent = '';
            element.style.display = 'none';
        }
    });
    
    return isValid;
}

function validateEnhancedField(field) {
    const fieldName = field.name || field.id.replace('applicant', '').toLowerCase();
    const value = field.value.trim();
    let error = '';
    
    switch(fieldName) {
        case 'applicantName':
        case 'name':
            if (!value) {
                error = 'Full name is required';
            } else if (value.length < 2) {
                error = 'Name must be at least 2 characters long';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                error = 'Name can only contain letters and spaces';
            }
            break;
            
        case 'applicantEmail':
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                error = 'Email address is required';
            } else if (!emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
            break;
            
        case 'applicantPhone':
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            
            if (!value) {
                error = 'Phone number is required';
            } else if (!phoneRegex.test(cleanPhone)) {
                error = 'Please enter a valid phone number';
            } else if (cleanPhone.length < 10) {
                error = 'Phone number must be at least 10 digits';
            }
            break;
            
        case 'applicantExperience':
        case 'experience':
            if (!value) error = 'Please select your experience level';
            break;
            
        case 'applicantMessage':
        case 'message':
            if (!value) {
                error = 'Cover letter is required';
            } else if (value.length < 50) {
                error = 'Cover letter should be at least 50 characters long';
            } else if (value.length > 2000) {
                error = 'Cover letter should not exceed 2000 characters';
            }
            break;
    }
    
    // For checkbox
    if (field.type === 'checkbox' && !field.checked) {
        error = 'You must agree to the privacy policy';
    }
    
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        if (error) {
            errorElement.textContent = error;
            errorElement.style.display = 'block';
            field.classList.add('error');
        } else {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            field.classList.remove('error');
        }
    }
}

function validateResumeFile(input) {
    const file = input.files[0];
    const errorElement = document.getElementById('resume-error') || document.getElementById('applicantResume').nextElementSibling;
    
    if (!file) {
        if (errorElement) {
            errorElement.textContent = 'Please upload your resume';
            errorElement.style.display = 'block';
        }
        return 'Please upload your resume';
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        if (errorElement) {
            errorElement.textContent = 'Please upload a PDF, DOC, or DOCX file';
            errorElement.style.display = 'block';
        }
        input.value = '';
        return 'Please upload a PDF, DOC, or DOCX file';
    }
    
    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        if (errorElement) {
            errorElement.textContent = 'File size must be less than 5MB';
            errorElement.style.display = 'block';
        }
        input.value = '';
        return 'File size must be less than 5MB';
    }
    
    // Clear error if valid
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    return null;
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Format as +XXX XXX XXX XXX
    if (value.length > 0) {
        value = '+' + value;
    }
    if (value.length > 4) {
        value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    if (value.length > 8) {
        value = value.substring(0, 8) + ' ' + value.substring(8);
    }
    if (value.length > 12) {
        value = value.substring(0, 12) + ' ' + value.substring(12);
    }
    
    input.value = value;
}

function submitJobApplication() {
    const form = document.getElementById('jobApplicationForm');
    const formSubmitBtn = form.querySelector('.form-submit');
    const btnText = formSubmitBtn.querySelector('.btn-text');
    const btnLoading = formSubmitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    formSubmitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const applicationData = {
        jobTitle: document.getElementById('jobTitle').textContent,
        jobDepartment: document.getElementById('jobDepartment').textContent,
        personalInfo: {
            name: formData.get('applicantName'),
            email: formData.get('applicantEmail'),
            phone: formData.get('applicantPhone'),
            location: formData.get('applicantLocation')
        },
        professionalInfo: {
            experience: formData.get('applicantExperience'),
            education: formData.get('applicantEducation'),
            skills: formData.get('applicantSkills')
        },
        applicationDetails: {
            coverLetter: formData.get('applicantMessage'),
            resume: formData.get('applicantResume').name,
            submittedAt: new Date().toISOString()
        }
    };
    
    // Simulate API submission with realistic delay
    setTimeout(function() {
        // Store application data (in real scenario, this would be sent to server)
        const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        applications.push(applicationData);
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        
        // Show confirmation
        form.style.display = 'none';
        document.getElementById('jobConfirmation').style.display = 'block';
        
        // Set confirmation details
        document.getElementById('confirmation-email').textContent = applicationData.personalInfo.email;
        
        // Send confirmation email simulation
        sendConfirmationEmail(applicationData);
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        formSubmitBtn.disabled = false;
        
        // Show success notification
        showNotification('Application submitted successfully! Our HR team will review your application within 3-5 business days.', 'success');
        
    }, 3000);
}

function sendConfirmationEmail(applicationData) {
    // In a real application, this would be an API call to your email service
    console.log('Confirmation email sent to:', applicationData.personalInfo.email);
    console.log('Application details:', applicationData);
    
    // You would typically integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Your custom backend API
}

// Enhanced Save for Later with Analytics
function enhanceSaveForLater() {
    const saveJobBtns = document.querySelectorAll('.save-job-btn');
    
    saveJobBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobData = {
                title: jobCard.querySelector('h3').textContent,
                location: jobCard.querySelector('.job-location').textContent,
                department: jobCard.getAttribute('data-department'),
                type: jobCard.querySelector('.job-type').textContent,
                savedAt: new Date().toISOString(),
                jobId: generateJobId(jobCard)
            };
            
            // Get saved jobs from localStorage
            const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            
            // Check if job is already saved
            const isAlreadySaved = savedJobs.some(job => job.jobId === jobData.jobId);
            
            if (!isAlreadySaved) {
                // Add job to saved list
                savedJobs.push(jobData);
                
                // Save back to localStorage
                localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
                
                // Track save event (for analytics)
                trackJobSave(jobData);
                
                // Show enhanced confirmation
                showEnhancedSaveConfirmation(this, '✓ Saved to your jobs');
            } else {
                // Remove from saved list
                const updatedJobs = savedJobs.filter(job => job.jobId !== jobData.jobId);
                localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
                
                showEnhancedSaveConfirmation(this, '✗ Removed from saved jobs');
            }
            
            // Update button state
            this.classList.toggle('saved');
        });
    });
}

function generateJobId(jobCard) {
    const title = jobCard.querySelector('h3').textContent;
    const location = jobCard.querySelector('.job-location').textContent;
    return btoa(title + location).substring(0, 16);
}

function trackJobSave(jobData) {
    // In a real application, this would send data to your analytics service
    console.log('Job saved for later:', jobData);
    
    // Example analytics integration:
    // - Google Analytics
    // - Mixpanel
    // - Your custom analytics
}

function showEnhancedSaveConfirmation(button, message) {
    const originalHTML = button.innerHTML;
    const originalBg = button.style.backgroundColor;
    
    button.innerHTML = message;
    button.style.backgroundColor = message.includes('✓') ? '#27ae60' : '#e74c3c';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = originalBg;
        button.disabled = false;
    }, 2000);
}

// Enhanced Job Filtering with Search
function enhanceJobFiltering() {
    const departmentFilter = document.getElementById('department-filter');
    const locationFilter = document.getElementById('location-filter');
    const jobsGrid = document.getElementById('jobsGrid');
    
    if (!jobsGrid) return;
    
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search jobs by title or keyword...';
    searchInput.className = 'filter-select';
    searchInput.style.gridColumn = '1 / -1';
    searchInput.style.marginBottom = '15px';
    
    const filtersContainer = document.querySelector('.jobs-filters');
    if (filtersContainer) {
        filtersContainer.insertBefore(searchInput, filtersContainer.firstChild);
        
        searchInput.addEventListener('input', function() {
            filterJobs();
        });
    }
    
    // Enhanced filter function
    window.filterJobs = function() {
        const selectedDepartment = departmentFilter ? departmentFilter.value : 'all';
        const selectedLocation = locationFilter ? locationFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        const jobCards = document.querySelectorAll('.job-card');
        let visibleCount = 0;
        
        jobCards.forEach(card => {
            const cardDepartment = card.getAttribute('data-department');
            const cardLocation = card.getAttribute('data-location');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDescription = card.querySelector('.job-description').textContent.toLowerCase();
            
            const departmentMatch = selectedDepartment === 'all' || cardDepartment === selectedDepartment;
            const locationMatch = selectedLocation === 'all' || cardLocation === selectedLocation;
            const searchMatch = !searchTerm || 
                              cardTitle.includes(searchTerm) || 
                              cardDescription.includes(searchTerm) ||
                              cardDepartment.includes(searchTerm);
            
            if (departmentMatch && locationMatch && searchMatch) {
                card.style.display = 'block';
                visibleCount++;
                
                // Add enhanced animation
                card.style.animation = 'enhancedFadeIn 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results count
        updateResultsCount(visibleCount, jobCards.length);
        
        // Show/hide no results message
        if (visibleCount === 0) {
            showEnhancedNoResultsMessage(searchTerm, selectedDepartment, selectedLocation);
        } else {
            removeNoResultsMessage();
        }
    };
    
    // Initialize filters
    if (departmentFilter) departmentFilter.addEventListener('change', filterJobs);
    if (locationFilter) locationFilter.addEventListener('change', filterJobs);
}

function updateResultsCount(visible, total) {
    let countElement = document.getElementById('resultsCount');
    
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.id = 'resultsCount';
        countElement.className = 'results-count';
        countElement.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 10px; background: #f8f9fa; border-radius: 5px; margin-bottom: 15px;';
        
        const filtersContainer = document.querySelector('.jobs-filters');
        if (filtersContainer) {
            filtersContainer.insertBefore(countElement, filtersContainer.querySelector('.filter-group'));
        }
    }
    
    countElement.textContent = `Showing ${visible} of ${total} jobs`;
    countElement.style.display = visible === total ? 'none' : 'block';
}

function showEnhancedNoResultsMessage(searchTerm, department, location) {
    removeNoResultsMessage();
    
    const noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'no-results-message enhanced';
    noResultsMsg.innerHTML = `
        <div class="no-results-icon">🔍</div>
        <h3>No Jobs Match Your Criteria</h3>
        <p>We couldn't find any positions matching ${
            searchTerm ? `"${searchTerm}"` : 
            department !== 'all' ? `the ${department} department` :
            location !== 'all' ? `${location} location` :
            'your current filters'
        }.</p>
        <div class="no-results-suggestions">
            <p><strong>Suggestions:</strong></p>
            <ul>
                <li>Try different keywords or search terms</li>
                <li>Broaden your department or location filters</li>
                <li>Check back later for new opportunities</li>
                <li><a href="mailto:hr@transportco.com?subject=General Application">Send us your resume</a> for future consideration</li>
            </ul>
        </div>
        <div class="no-results-actions">
            <button class="btn-primary" onclick="resetFilters()">Reset All Filters</button>
            <a href="careers.html" class="btn-secondary">View All Jobs</a>
        </div>
    `;
    
    const jobsGrid = document.getElementById('jobsGrid');
    if (jobsGrid) {
        jobsGrid.appendChild(noResultsMsg);
    }
}

// Initialize enhanced job application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeJobApplication();
    enhanceSaveForLater();
    enhanceJobFiltering();
    
    // Add enhanced CSS animations
    const enhancedStyles = document.createElement('style');
    enhancedStyles.textContent = `
        @keyframes enhancedFadeIn {
            from { 
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .job-card {
            transition: all 0.3s ease;
        }
        
        .save-job-btn.saved {
            background-color: #27ae60 !important;
            border-color: #27ae60 !important;
        }
        
        .save-job-btn.saved::before {
            content: '✓ ';
        }
        
        .no-results-message.enhanced {
            text-align: left;
            padding: 40px;
        }
        
        .no-results-suggestions {
            margin: 20px 0;
            text-align: left;
        }
        
        .no-results-suggestions ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .no-results-suggestions li {
            margin-bottom: 8px;
            color: #666;
        }
        
        .results-count {
            font-weight: 600;
            color: #0a3d62;
        }
        
        input.error, textarea.error, select.error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1) !important;
        }
    `;
    document.head.appendChild(enhancedStyles);
});