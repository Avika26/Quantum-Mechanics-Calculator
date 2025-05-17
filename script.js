// Constants
const h = 6.62607015e-34; // Planck's constant (J·s)
const hBar = h / (2 * Math.PI); // Reduced Planck's constant (ħ)

// Function to show a specific page and hide others
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        // Clear all inputs and outputs when switching pages
        const inputs = page.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        const outputs = page.querySelectorAll('.result');
        outputs.forEach(output => output.innerHTML = '');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update input fields based on selection
    if (pageId === 'uncertainty') {
        document.getElementById('uncertainty-calculate').dispatchEvent(new Event('change'));
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set up uncertainty calculator toggle
    document.getElementById('uncertainty-calculate').addEventListener('change', function() {
        const calculateOption = this.value;
        const momentumInput = document.getElementById('momentum-uncertainty');
        const positionInput = document.getElementById('position-uncertainty');

        if (calculateOption === 'position') {
            momentumInput.disabled = false;
            positionInput.disabled = true;
            positionInput.value = '';
        } else {
            momentumInput.disabled = true;
            positionInput.disabled = false;
            momentumInput.value = '';
        }
    });
});

// Helper functions
function parseInput(value, name, unit, positive = true, integer = false) {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error(`Please enter a valid number for ${name}`);
    if (positive && num <= 0) throw new Error(`${name} must be positive`);
    if (integer && !Number.isInteger(num)) throw new Error(`${name} must be an integer`);
    return num;
}

function formatValue(value) {
    if (Math.abs(value) >= 1e4 || Math.abs(value) <= 1e-4) {
        return value.toExponential(4);
    }
    return value.toFixed(6).replace(/\.?0+$/, '');
}

function formatResult(value) {
    if (Math.abs(value) >= 1e3 || Math.abs(value) <= 1e-3) {
        return value.toExponential(4);
    }
    return value.toFixed(6).replace(/\.?0+$/, '');
}

// Enhanced Heisenberg Uncertainty Calculator
function calculateUncertainty() {
    const calculateOption = document.getElementById('uncertainty-calculate').value;
    const momentumInput = document.getElementById('momentum-uncertainty');
    const positionInput = document.getElementById('position-uncertainty');
    const output = document.getElementById('uncertainty-result');

    output.innerHTML = '';

    try {
        if (calculateOption === 'position') {
            const deltaP = parseInput(momentumInput.value, 'Momentum uncertainty', 'kg·m/s');
            const result = hBar / (2 * deltaP);
            
            output.innerHTML = `
                <div class="result-value">
                    <h3>Minimum Position Uncertainty</h3>
                    <p>Δx ≥ ${formatResult(result)} m</p>
                </div>
                <div class="calculation-steps">
                    <h4>Calculation Steps:</h4>
                    <p>Δx ≥ ħ/(2Δp)</p>
                    <p>≥ ${formatValue(hBar)}/(2 × ${formatValue(deltaP)})</p>
                    <p>≥ ${formatResult(result)} m</p>
                </div>
                <div class="explanation">
                    <h4>Physical Interpretation:</h4>
                    <p>This fundamental limit means we cannot simultaneously know both position and momentum with perfect precision.</p>
                    <p>For an electron (mₑ = 9.11×10⁻³¹ kg), this corresponds to a velocity uncertainty of:</p>
                    <p>Δv = Δp/mₑ ≈ ${formatResult(deltaP/9.10938356e-31)} m/s</p>
                </div>
            `;
        } else {
            const deltaX = parseInput(positionInput.value, 'Position uncertainty', 'm');
            const result = hBar / (2 * deltaX);
            
            output.innerHTML = `
                <div class="result-value">
                    <h3>Minimum Momentum Uncertainty</h3>
                    <p>Δp ≥ ${formatResult(result)} kg·m/s</p>
                </div>
                <div class="calculation-steps">
                    <h4>Calculation Steps:</h4>
                    <p>Δp ≥ ħ/(2Δx)</p>
                    <p>≥ ${formatValue(hBar)}/(2 × ${formatValue(deltaX)})</p>
                    <p>≥ ${formatResult(result)} kg·m/s</p>
                </div>
                <div class="explanation">
                    <h4>Physical Interpretation:</h4>
                    <p>This result shows the fundamental trade-off between position and momentum measurements.</p>
                    <p>For context, an electron confined to an atom (Δx ≈ 10⁻¹⁰ m) would have:</p>
                    <p>Δp ≈ ${formatResult(hBar/(2*1e-10))} kg·m/s</p>
                    <p>Δv ≈ ${formatResult(hBar/(2*1e-10*9.10938356e-31))} m/s (~1% of light speed)</p>
                </div>
            `;
        }
    } catch (error) {
        output.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Enhanced Schrödinger Equation Calculator
function calculateSchrodinger() {
    const m = parseFloat(document.getElementById('schrodinger-mass').value);
    const energy = parseFloat(document.getElementById('schrodinger-energy').value);
    const output = document.getElementById('schrodinger-result');

    output.innerHTML = '';

    try {
        parseInput(m, 'Particle mass', 'kg');
        parseInput(energy, 'Energy', 'J');
        
        output.innerHTML = `
            <div class="result-value">
                <h3>Schrödinger Equation Analysis</h3>
                <p>For particle mass: ${formatValue(m)} kg</p>
                <p>At energy: ${formatValue(energy)} J (${formatValue(energy/1.602176634e-19)} eV)</p>
            </div>
            <div class="explanation">
                <h4>About the Schrödinger Equation:</h4>
                <p>The time-independent Schrödinger equation for a free particle:</p>
                <p class="formula">-ħ²/2m ∇²ψ + Vψ = Eψ</p>
                <p>For a free particle (V=0), the solutions are plane waves:</p>
                <p class="formula">ψ(x) = Ae<sup>ikx</sup> + Be<sup>-ikx</sup></p>
                <p>where the wavenumber k is related to energy by:</p>
                <p class="formula">k = √(2mE)/ħ = ${formatResult(Math.sqrt(2*m*energy)/hBar)} m⁻¹</p>
                <p>De Broglie wavelength: λ = 2π/k = ${formatResult(2*Math.PI*hBar/Math.sqrt(2*m*energy))} m</p>
                <p>Momentum: p = ħk = ${formatResult(Math.sqrt(2*m*energy))} kg·m/s</p>
            </div>
            <div class="explanation">
                <h4>Numerical Solution Note:</h4>
                <p>Complete solutions require boundary conditions and numerical methods for complex potentials.</p>
                <p>For common potentials (square well, harmonic oscillator), analytic solutions exist.</p>
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Enhanced Wave Function Calculator
function calculateWaveFunction() {
    const L = parseFloat(document.getElementById('wave-length').value);
    const n = parseInt(document.getElementById('wave-n').value);
    const x = parseFloat(document.getElementById('wave-x').value);
    const output = document.getElementById('wave-result');

    output.innerHTML = '';

    try {
        parseInput(L, 'Box length', 'm', true);
        parseInput(n, 'Quantum number', '', true, true);
        parseInput(x, 'Position', 'm');
        
        if (x < 0 || x > L) {
            throw new Error(`Position must be between 0 and ${L} m`);
        }

        const normalization = Math.sqrt(2/L);
        const argument = (n * Math.PI * x) / L;
        const psi = normalization * Math.sin(argument);
        const probability = psi * psi;
        const nodes = n - 1;
        
        output.innerHTML = `
            <div class="result-value">
                <h3>Wave Function Analysis</h3>
                <p>ψ(${formatValue(x)}) = ${formatResult(psi)}</p>
                <p>|ψ|<sup>2</sup> = ${formatResult(probability)} (probability density)</p>
            </div>
            <div class="calculation-steps">
                <h4>Calculation Steps:</h4>
                <p>ψ(x) = √(2/L) sin(nπx/L)</p>
                <p>Normalization factor: √(2/${formatValue(L)}) = ${formatResult(normalization)}</p>
                <p>Argument: ${n}π × ${formatValue(x)}/${formatValue(L)} = ${formatResult(argument)} rad</p>
                <p>sin(${formatResult(argument)}) = ${formatResult(Math.sin(argument))}</p>
                <p>ψ(${formatValue(x)}) = ${formatResult(normalization)} × ${formatResult(Math.sin(argument))}</p>
                <p>= ${formatResult(psi)}</p>
            </div>
            <div class="explanation">
                <h4>Physical Interpretation:</h4>
                <p>This is the normalized wave function for a particle in a 1D box of length ${formatValue(L)} m.</p>
                <p>Key features:</p>
                <ul>
                    <li>Quantum number n = ${n} determines the energy state</li>
                    <li>Number of nodes (ψ=0 points): ${nodes}</li>
                    <li>Probability density at x = ${formatValue(x)} m: ${formatResult(probability)} m⁻¹</li>
                    <li>Probability in small interval dx: P = ${formatResult(probability)}dx</li>
                </ul>
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Enhanced Particle in a Box Calculator
function calculateParticleInBox() {
    const n = parseInt(document.getElementById('box-n').value);
    const m = parseFloat(document.getElementById('box-mass').value);
    const L = parseFloat(document.getElementById('box-length').value);
    const output = document.getElementById('box-result');

    output.innerHTML = '';

    try {
        parseInput(n, 'Quantum number', '', true, true);
        parseInput(m, 'Particle mass', 'kg', true);
        parseInput(L, 'Box length', 'm', true);
        
        const energy = (n ** 2 * h ** 2) / (8 * m * L ** 2);
        const energyEv = energy / 1.602176634e-19;
        const wavelength = h / Math.sqrt(2 * m * energy);
        
        output.innerHTML = `
            <div class="result-value">
                <h3>Energy Level Calculation</h3>
                <p>E<sub>${n}</sub> = ${formatResult(energy)} J</p>
                <p>= ${formatResult(energyEv)} eV</p>
                <p>Associated wavelength: ${formatResult(wavelength)} m</p>
            </div>
            <div class="calculation-steps">
                <h4>Calculation Steps:</h4>
                <p>E<sub>n</sub> = n²h²/(8mL²)</p>
                <p>= ${n}² × (${formatValue(h)})²/(8 × ${formatValue(m)} × ${formatValue(L)}²)</p>
                <p>= ${n*n} × ${formatValue(h*h)}/(8 × ${formatValue(m)} × ${formatValue(L*L)})</p>
                <p>= ${formatResult(energy)} J</p>
            </div>
            <div class="explanation">
                <h4>Physical Interpretation:</h4>
                <p>This is the quantized energy for a particle of mass ${formatValue(m)} kg in a box of size ${formatValue(L)} m.</p>
                <p>Key observations:</p>
                <ul>
                    <li>Ground state (n=1) energy: ${formatResult((h ** 2) / (8 * m * L ** 2))} J</li>
                    <li>Energy levels are proportional to n²</li>
                    <li>Energy difference to next level (n→${n+1}): ${formatResult(((2*n+1)*h**2)/(8*m*L**2))} J</li>
                    <li>For an electron (mₑ) in 1Å box (L=10⁻¹⁰ m):</li>
                    <li>E₁ ≈ ${formatResult((h**2)/(8*9.10938356e-31*1e-20))} J ≈ 37.6 eV</li>
                </ul>
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Enhanced Harmonic Oscillator Calculator
function calculateHarmonicOscillator() {
    const n = parseInt(document.getElementById('harmonic-n').value);
    const omega = parseFloat(document.getElementById('harmonic-frequency').value);
    const output = document.getElementById('harmonic-result');

    output.innerHTML = '';

    try {
        parseInput(n, 'Quantum number', '', false, true);
        parseInput(omega, 'Angular frequency', 'rad/s', true);
        
        const energy = (n + 0.5) * hBar * omega;
        const energyEv = energy / 1.602176634e-19;
        const classicalFreq = omega / (2 * Math.PI);
        const zeroPointEnergy = 0.5 * hBar * omega;
        
        output.innerHTML = `
            <div class="result-value">
                <h3>Quantum Harmonic Oscillator</h3>
                <p>E<sub>${n}</sub> = ${formatResult(energy)} J</p>
                <p>= ${formatResult(energyEv)} eV</p>
                <p>Zero-point energy: ${formatResult(zeroPointEnergy)} J</p>
            </div>
            <div class="calculation-steps">
                <h4>Calculation Steps:</h4>
                <p>E<sub>n</sub> = (n + ½)ħω</p>
                <p>= (${n} + 0.5) × ${formatValue(hBar)} × ${formatValue(omega)}</p>
                <p>= ${formatResult(energy)} J</p>
            </div>
            <div class="explanation">
                <h4>Physical Interpretation:</h4>
                <p>The quantum harmonic oscillator describes many physical systems including:</p>
                <ul>
                    <li>Molecular vibrations (ω ≈ 10¹³-10¹⁴ rad/s for typical bonds)</li>
                    <li>Quantum field theory (each mode is an oscillator)</li>
                    <li>Classical frequency: ${formatResult(classicalFreq)} Hz</li>
                    <li>Energy levels are equally spaced by ΔE = ħω = ${formatResult(hBar * omega)} J</li>
                    <li>For n=${n}, the wave function has ${n} nodes</li>
                </ul>
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<div class="error">${error.message}</div>`;
    }
}