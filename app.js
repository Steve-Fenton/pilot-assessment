// Chart setup
const canvas = document.getElementById('spiderChart');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 120;

// Categories are used to drive the app
const categories = {
    investment: 'Investment',
    adoption: 'Adoption',
    interfaces: 'Interfaces',
    operations: 'Operations',
    measurement: 'Measurement'
}

const scores = {}
const counts = {}

for (let name in categories) {
    scores[name] = 0;
    counts[name] = 0;
}

// Set canvas size
canvas.width = 350;
canvas.height = 350;

function drawSpiderChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;
    
    // Draw grid circles
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw grid lines and labels
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#4a5568';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    const displayNames = Object.values(categories);
    
    for (let i = 0; i < displayNames.length; i++) {
        const angle = (i * 2 * Math.PI) / displayNames.length - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Draw grid line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw label
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(displayNames[i], labelX, labelY + 5);
    }
    
    // Draw level numbers
    ctx.fillStyle = '#718096';
    ctx.font = '10px Arial';
    for (let i = 1; i <= 4; i++) {
        ctx.fillText(i.toString(), centerX + 5, centerY - (radius / 4) * i + 3);
    }
    
    // Draw data polygon
    if (Object.values(scores).some(score => score > 0)) {
        ctx.strokeStyle = '#667eea';
        ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        for (let i = 0; i < displayNames.length; i++) {
            const categoryKey = displayNames[i].toLowerCase();
            const score = scores[categoryKey] || 0;
            const angle = (i * 2 * Math.PI) / displayNames.length - Math.PI / 2;
            const distance = (score / 4) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#667eea';
        for (let i = 0; i < displayNames.length; i++) {
            const categoryKey = displayNames[i].toLowerCase();
            const score = scores[categoryKey] || 0;
            const angle = (i * 2 * Math.PI) / displayNames.length - Math.PI / 2;
            const distance = (score / 4) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function drawRow(category, values){
    return `<tr><td>${category}</td><td class="heat_${values["1"]}"></td><td class="heat_${values["2"]}"></td><td class="heat_${values["3"]}"></td><td class="heat_${values["4"]}"></td></tr>`;
}

function drawMatrix() {
    let tableBody = '';
    
    for (let name in categories) {
        tableBody += drawRow(categories[name], counts[name]);
    }

    document.getElementById('matrix').innerHTML = tableBody;
}

function calculateCategoryScore(category) {
    const inputs = document.querySelectorAll(`input[name^="${category}_"]:checked`);
    if (inputs.length === 0) return 0;
    
    let total = 0;
    inputs.forEach(input => {
        total += parseInt(input.value);
    });
    
    return total / inputs.length;
}

function calculateCategoryCount(category) {
    const inputs = document.querySelectorAll(`input[name^="${category}_"]:checked`);
    if (inputs.length === 0) return 0;
    
    let count = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0 
    };
    inputs.forEach(input => {
        const value = parseInt(input.value ?? 0).toString();
        count[value]++
    });
    
    return count;
}

function updateScores() {
    for (var name in categories) {
        scores[name] = calculateCategoryScore(name);
        counts[name] = calculateCategoryCount(name);

        // Update score displays
        document.getElementById(`${name}Score`).textContent = scores[name].toFixed(1);
    }
    
    // Redraw chart
    drawSpiderChart();
    drawMatrix();
}

// Add event listeners to all radio buttons
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        // Remove selected class from all options in the same question group
        const questionGroup = e.target.closest('.question-group');
        questionGroup.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to chosen option
        e.target.closest('.option').classList.add('selected');
        
        // Update scores and chart
        updateScores();
    }
});

// Initial chart draw
drawSpiderChart();
drawMatrix();