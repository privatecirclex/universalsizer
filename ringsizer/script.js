// --- 1. CONSTANTS & DATA ---
// Using the short edge of a credit card for mobile portrait orientation
const CARD_SHORT_EDGE_MM = 53.98;
let ppm = 0; // Pixels Per Millimeter

const sizeChart = [
    { diameter: 14.1, circumference: 44.2, us: "3", india: "4", uk: "F", eu: "44" },
    { diameter: 14.5, circumference: 45.5, us: "3.5", india: "5", uk: "G", eu: "45" },
    { diameter: 14.9, circumference: 46.8, us: "4", india: "6", uk: "H", eu: "47" },
    { diameter: 15.3, circumference: 48.0, us: "4.5", india: "8", uk: "I", eu: "48" },
    { diameter: 15.7, circumference: 49.3, us: "5", india: "9", uk: "J 1/2", eu: "49" },
    { diameter: 16.1, circumference: 50.6, us: "5.5", india: "10", uk: "K", eu: "50" },
    { diameter: 16.5, circumference: 51.9, us: "6", india: "12", uk: "L 1/2", eu: "52" },
    { diameter: 16.9, circumference: 53.1, us: "6.5", india: "13", uk: "M", eu: "53" },
    { diameter: 17.3, circumference: 54.4, us: "7", india: "14", uk: "N", eu: "54" },
    { diameter: 17.7, circumference: 55.7, us: "7.5", india: "15", uk: "O", eu: "56" },
    { diameter: 18.1, circumference: 57.0, us: "8", india: "17", uk: "P", eu: "57" },
    { diameter: 18.5, circumference: 58.3, us: "8.5", india: "18", uk: "Q", eu: "58" },
    { diameter: 18.9, circumference: 59.5, us: "9", india: "19", uk: "R", eu: "59" },
    { diameter: 19.4, circumference: 60.8, us: "9.5", india: "21", uk: "S", eu: "61" },
    { diameter: 19.8, circumference: 62.1, us: "10", india: "22", uk: "T 1/2", eu: "62" },
    { diameter: 20.2, circumference: 63.4, us: "10.5", india: "23", uk: "U 1/2", eu: "63" },
    { diameter: 20.6, circumference: 64.6, us: "11", india: "25", uk: "V 1/2", eu: "65" },
    { diameter: 21.0, circumference: 65.9, us: "11.5", india: "26", uk: "W 1/2", eu: "66" },
    { diameter: 21.4, circumference: 67.2, us: "12", india: "27", uk: "Y", eu: "67" },
    { diameter: 21.8, circumference: 68.5, us: "12.5", india: "28", uk: "Z", eu: "68" },
    { diameter: 22.2, circumference: 69.7, us: "13", india: "30", uk: "Z+1", eu: "70" }
];

// --- 2. INITIALIZATION & LOCAL STORAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has calibrated before
    const savedPPM = localStorage.getItem('universal_measurer_ppm');
    
    if (savedPPM) {
        ppm = parseFloat(savedPPM);
        showMeasurementTool();
    } else {
        // First time user, show calibration
        document.getElementById('step-calibration').classList.remove('hidden');
    }
});

// --- 3. CALIBRATION LOGIC ---
const calibrateSlider = document.getElementById('calibrate-slider');
const cardBox = document.getElementById('card-box');

// Adjust visual box width
calibrateSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    cardBox.style.width = val + 'px';
    
    // 90% Threshold Toast Logic (90% of 600 = 540)
    const landscapeToast = document.getElementById('landscape-toast');
    if (val > 540) {
        landscapeToast.classList.add('show');
    } else {
        landscapeToast.classList.remove('show');
        
    }
});


// Proceed to Verification Step (DO NOT SAVE YET)
document.getElementById('btn-to-verification').addEventListener('click', () => {
    const pixels = parseInt(calibrateSlider.value);
    ppm = pixels / CARD_SHORT_EDGE_MM; // Calculate the temporary scale
    
    // Draw the 20mm test line using the new scale
    const testLinePixels = ppm * 20; 
    document.getElementById('verification-line').style.width = testLinePixels + 'px';
    
    // Hide Calibration, Show Verification
    document.getElementById('step-calibration').classList.add('hidden');
    document.getElementById('step-verification').classList.remove('hidden');
    document.getElementById('landscape-toast').classList.remove('show');

});

// Verification Passed: Save and unlock tools
document.getElementById('btn-confirm-match').addEventListener('click', () => {
    // Now we safely save to browser memory
    localStorage.setItem('universal_measurer_ppm', ppm);
    
    // Hide verification, show the main tool
    document.getElementById('step-verification').classList.add('hidden');
    showMeasurementTool();
});

// Verification Failed: Go back to calibration
document.getElementById('btn-recalibrate-now').addEventListener('click', () => {
    document.getElementById('step-verification').classList.add('hidden');
    document.getElementById('step-calibration').classList.remove('hidden');
});

// Handle Recalibration
document.getElementById('btn-recalibrate').addEventListener('click', () => {
    localStorage.removeItem('universal_measurer_ppm');
    document.getElementById('step-measurement').classList.add('hidden');
    document.getElementById('btn-recalibrate').classList.add('hidden');
    document.getElementById('step-calibration').classList.remove('hidden');
});

// --- 4. UI TOGGLES ---
function showMeasurementTool() {
    document.getElementById('step-calibration').classList.add('hidden');
    document.getElementById('step-measurement').classList.remove('hidden');
    document.getElementById('btn-recalibrate').classList.remove('hidden');
    
    // Trigger initial calculation
    document.getElementById('ring-slider').dispatchEvent(new Event('input'));
    
    // Trigger the dimension bracket math
    updateHumanRangeBracket();
}


const toggleBtns = document.querySelectorAll('.toggle-btn');
toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Manage active states
        toggleBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Hide all modes
        document.getElementById('mode-ring').classList.add('hidden');
        document.getElementById('mode-paper').classList.add('hidden');
        
        // Show selected mode
        const mode = e.target.getAttribute('data-mode');
        document.getElementById('mode-' + mode).classList.remove('hidden');
        
        // Trigger calculation for the newly visible slider
        document.getElementById(mode + '-slider').dispatchEvent(new Event('input'));
    });
});

// --- 5. MATH & MEASUREMENT ENGINE ---
function findClosestSize(measurement, type) {
    let closest = sizeChart[0];
    let minDiff = Math.abs(measurement - sizeChart[0][type]);

    for (let i = 1; i < sizeChart.length; i++) {
        let diff = Math.abs(measurement - sizeChart[i][type]);
        if (diff < minDiff) {
            minDiff = diff;
            closest = sizeChart[i];
        }
    }
    return closest;
}

function updateDigitalReadout(sizeObj, rawMeasurement) {
    document.getElementById('raw-measurement').innerText = rawMeasurement.toFixed(1) + ' mm';
    document.getElementById('res-us').innerText = sizeObj.us;
    document.getElementById('res-in').innerText = sizeObj.india;
    document.getElementById('res-uk').innerText = sizeObj.uk;
    document.getElementById('res-eu').innerText = sizeObj.eu;
}

// Mode: Ring
const ringSlider = document.getElementById('ring-slider');
const ringCircle = document.getElementById('ring-circle');

ringSlider.addEventListener('input', (e) => {
    const pixels = e.target.value;
    ringCircle.style.width = pixels + 'px';
    ringCircle.style.height = pixels + 'px';
    
    if (ppm > 0) {
        const diameterMM = pixels / ppm;
        const match = findClosestSize(diameterMM, 'diameter');
        updateDigitalReadout(match, diameterMM);
    }
});

// Mode: Paper
const paperSlider = document.getElementById('paper-slider');
const paperLine = document.getElementById('paper-line');

paperSlider.addEventListener('input', (e) => {
    const pixels = e.target.value;
    paperLine.style.width = pixels + 'px';
    
    if (ppm > 0) {
        const circumferenceMM = pixels / ppm;
        const match = findClosestSize(circumferenceMM, 'circumference');
        updateDigitalReadout(match, circumferenceMM);
    }
});

// --- 6. SHARE & COPY LOGIC ---
document.getElementById('share-btn').addEventListener('click', () => {
    const us = document.getElementById('res-us').innerText;
    const india = document.getElementById('res-in').innerText;
    const uk = document.getElementById('res-uk').innerText;
    const eu = document.getElementById('res-eu').innerText;
    
    const text = `My Ring Size Measurements:\nUS: ${us}\nIndia: ${india}\nUK: ${uk}\nEU: ${eu}\nMeasured via Universal Screen Measurer.`;
    
    if (navigator.share) {
        navigator.share({ title: 'Ring Size', text: text });
    } else {
        navigator.clipboard.writeText(text);
        alert('Size data copied to clipboard!');
    }
});
// --- 7. DYNAMIC RANGE BRACKET ---
function updateHumanRangeBracket() {
    if (ppm <= 0) return;
    
    // The physical human range in millimeters
    const minMM = 14.1;
    const maxMM = 22.2;
    
    // The slider's exact HTML attributes
    const sliderMin = 30;
    const sliderMax = 250;
    
    // Convert physical millimeters to pixels on THIS specific screen
    let startPx = minMM * ppm;
    let endPx = maxMM * ppm;
    
    // Calculate the percentage positions for CSS styling
    const startPct = ((startPx - sliderMin) / (sliderMax - sliderMin)) * 100;
    const endPct = ((endPx - sliderMin) / (sliderMax - sliderMin)) * 100;
    const widthPct = endPct - startPct;
    
    // Apply to the UI
    const bracket = document.getElementById('human-range-bracket');
    
    // Minor safeguard: Only show if the math fits within the slider
    if (startPct >= 0 && endPct <= 100) {
        bracket.style.left = startPct + '%';
        bracket.style.width = widthPct + '%';
        bracket.classList.remove('hidden');
        document.getElementById('ring-slider').style.background = `linear-gradient(to right, var(--border-ui) ${startPct}%, rgba(38, 38, 38, 0.35) ${startPct}%, rgba(38, 38, 38, 0.35) ${endPct}%, var(--border-ui) ${endPct}%)`;

    } else {
        bracket.classList.add('hidden');
    }
}


