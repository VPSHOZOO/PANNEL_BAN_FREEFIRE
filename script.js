document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('banAppealForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnSubmit = document.querySelector('.btn-submit');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');
    const btnCloseModal = document.querySelector('.btn-close-modal');
    const summaryContent = document.getElementById('summaryContent');
    const ticketId = document.getElementById('ticketId');

    let currentStep = 1;

    // Initialize form
    showStep(currentStep);

    // Next button click
    btnNext.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    // Previous button click
    btnPrev.addEventListener('click', function() {
        currentStep--;
        showStep(currentStep);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Generate random ticket ID
            const randomId = 'FF-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            ticketId.textContent = randomId;
            
            // Show success modal
            successModal.style.display = 'flex';
            
            // Here you would normally send the data to your backend
            // For demo purposes, we'll just log it
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Form submitted:', data);
        }
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    btnCloseModal.addEventListener('click', function() {
        successModal.style.display = 'none';
    });

    // Show current step
    function showStep(step) {
        // Hide all steps
        formSteps.forEach(formStep => {
            formStep.classList.remove('active');
        });
        
        // Show current step
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        
        // Update progress bar
        progressSteps.forEach((progressStep, index) => {
            if (index < step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
        
        // Update buttons
        if (step === 1) {
            btnPrev.disabled = true;
            btnNext.style.display = 'flex';
            btnSubmit.style.display = 'none';
        } else if (step === formSteps.length) {
            btnPrev.disabled = false;
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'flex';
            updateSummary();
        } else {
            btnPrev.disabled = false;
            btnNext.style.display = 'flex';
            btnSubmit.style.display = 'none';
        }
    }

    // Validate current step
    function validateStep(step) {
        let isValid = true;
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        
        // Check all required fields in current step
        const inputs = currentStepEl.querySelectorAll('[required]');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger)';
                isValid = false;
                
                // Add error message if not exists
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('small');
                    errorMsg.classList.add('error-message');
                    errorMsg.style.color = 'var(--danger)';
                    errorMsg.textContent = 'This field is required';
                    input.insertAdjacentElement('afterend', errorMsg);
                }
            } else {
                input.style.borderColor = '#ddd';
                
                // Remove error message if exists
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                    input.nextElementSibling.remove();
                }
            }
        });
        
        // Special validation for appeal reason
        if (step === 2) {
            const appealReason = document.getElementById('appealReason');
            if (appealReason.value.trim().length < 50) {
                appealReason.style.borderColor = 'var(--danger)';
                isValid = false;
                
                if (!appealReason.nextElementSibling || !appealReason.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('small');
                    errorMsg.classList.add('error-message');
                    errorMsg.style.color = 'var(--danger)';
                    errorMsg.textContent = 'Please provide at least 50 characters explanation';
                    appealReason.insertAdjacentElement('afterend', errorMsg);
                }
            } else {
                appealReason.style.borderColor = '#ddd';
                
                if (appealReason.nextElementSibling && appealReason.nextElementSibling.classList.contains('error-message')) {
                    appealReason.nextElementSibling.remove();
                }
            }
        }
        
        return isValid;
    }

    // Update summary before submission
    function updateSummary() {
        let summaryHTML = '';
        
        // Account Info
        summaryHTML += `
            <div class="summary-item">
                <div class="summary-label">Player ID:</div>
                <div class="summary-value">${document.getElementById('playerId').value}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Nickname:</div>
                <div class="summary-value">${document.getElementById('nickname').value}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Email:</div>
                <div class="summary-value">${document.getElementById('email').value}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Server:</div>
                <div class="summary-value">${document.getElementById('server').options[document.getElementById('server').selectedIndex].text}</div>
            </div>
        `;
        
        // Ban Details
        summaryHTML += `
            <div class="summary-item">
                <div class="summary-label">Ban Date:</div>
                <div class="summary-value">${document.getElementById('banDate').value || 'Not specified'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Ban Reason:</div>
                <div class="summary-value">${document.getElementById('banReason').options[document.getElementById('banReason').selectedIndex].text}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Appeal Reason:</div>
                <div class="summary-value">${document.getElementById('appealReason').value}</div>
            </div>
        `;
        
        // Files info
        const filesInput = document.getElementById('evidence');
        if (filesInput.files.length > 0) {
            summaryHTML += `
                <div class="summary-item">
                    <div class="summary-label">Attachments:</div>
                    <div class="summary-value">${filesInput.files.length} file(s) selected</div>
                </div>
            `;
        }
        
        summaryContent.innerHTML = summaryHTML;
    }
});
