function showSellForm() {
    document.getElementById('sell-form').style.display = 'block';
    document.getElementById('storm-form').style.display = 'none';
}

function showStormForm() {
    document.getElementById('storm-form').style.display = 'block';
    document.getElementById('sell-form').style.display = 'none';
}

function calculateSell() {
    const workHours = parseFloat(document.getElementById('workHoursSell').value) || 0;
    const cooldown = parseFloat(document.getElementById('cooldown').value) || 0;
    const sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
    const twoItemChance = parseFloat(document.getElementById('twoItemChance').value) || 0;
    const magnetPerSellChance = parseFloat(document.getElementById('magnetPerSellChance').value) || 0;
    const magnetPerSellAmount = parseFloat(document.getElementById('magnetPerSellAmount').value) || 0;
    const magnetPerSpawnChance = parseFloat(document.getElementById('magnetPerSpawnChance').value) || 0;
    const magnetPerSpawnAmount = parseFloat(document.getElementById('magnetPerSpawnAmount').value) || 0;
    const percentageBoost = parseFloat(document.getElementById('percentageBoost').value) || 0;

    const totalSeconds = workHours * 3600;
    const totalIntervals = Math.floor(totalSeconds / cooldown);
    const avgItemsPerInterval = 1 + (twoItemChance / 100);
    const totalItems = totalIntervals * avgItemsPerInterval;
    const totalStarFragments = totalItems * sellPrice;
    const rawMagnetsSell = totalItems * (magnetPerSellChance / 100) * magnetPerSellAmount;
    const rawMagnetsSpawn = totalIntervals * (magnetPerSpawnChance / 100) * magnetPerSpawnAmount;
    const boostMultiplier = 1 + (percentageBoost / 100);
    const totalMagnetsSell = Math.floor(rawMagnetsSell * boostMultiplier);
    const totalMagnetsSpawn = Math.floor(rawMagnetsSpawn * boostMultiplier);
    const totalMagnets = totalMagnetsSell + totalMagnetsSpawn;

    document.getElementById('sell-results').innerHTML = `
        <strong>Results:</strong><br>
        Total items spawned: ${Math.floor(totalItems)}<br>
        Total star fragments earned from selling: ${Math.floor(totalStarFragments)}<br>
        Magnets from selling: ${totalMagnetsSell}<br>
        Magnets from spawning: ${totalMagnetsSpawn}<br>
        Total magnets earned: ${totalMagnets}
    `;
}

function addMultiplier() {
    const multipliersDiv = document.getElementById('multipliers');
    const index = multipliersDiv.children.length / 2;
    multipliersDiv.innerHTML += `
        <label>Multiplier ${index + 1}: <input type="number" class="multiplier" step="0.1"></label>
        <label>Chance for multiplier ${index + 1} to activate (%, leave blank to skip): <input type="number" class="chance" step="0.1"></label>
    `;
}

function calculateStorm() {
    const workHours = parseFloat(document.getElementById('workHoursStorm').value) || 0;
    const itemsPerEvent = parseInt(document.getElementById('itemsPerEvent').value) || 0;
    const baseMagnets = parseFloat(document.getElementById('baseMagnets').value) || 0;
    const percentBoost = parseFloat(document.getElementById('percentBoostStorm').value) || 0;
    const passivePerMin = parseFloat(document.getElementById('passivePerMin').value) || 0;

    const multipliers = [];
    const chances = [];
    const multiplierInputs = document.querySelectorAll('.multiplier');
    const chanceInputs = document.querySelectorAll('.chance');

    multiplierInputs.forEach((input, index) => {
        const multiplier = parseFloat(input.value);
        const chance = parseFloat(chanceInputs[index].value);
        if (!isNaN(multiplier) && !isNaN(chance)) {
            multipliers.push(multiplier);
            chances.push(chance);
        }
    });

    let baseMultiplier = 1;
    const remainingMultipliers = [];
    const remainingChances = [];

    multipliers.forEach((m, index) => {
        if (chances[index] === 100 && m > baseMultiplier) {
            baseMultiplier = m;
        } else {
            remainingMultipliers.push(m);
            remainingChances.push(chances[index]);
        }
    });

    if (remainingChances.reduce((a, b) => a + b, 0) > 100) {
        alert("Error: Additional multiplier chances exceed 100%! Check your inputs.");
        return;
    }

    const eventCount = Math.floor((workHours * 60) / 5);
    const boostedBase = baseMagnets * (1 + percentBoost / 100);
    const baseTotal = boostedBase * baseMultiplier * itemsPerEvent;

    let extraBonus = 0;
    remainingMultipliers.forEach((m, index) => {
        const bonus = (m - baseMultiplier) * boostedBase * itemsPerEvent;
        extraBonus += (bonus * remainingChances[index]) / 100;
    });

    const magnetsFromStorm = Math.floor((baseTotal + extraBonus) * eventCount);
    const passiveTotal = Math.floor(passivePerMin * 60 * workHours * (1 + percentBoost / 100));
    const total = magnetsFromStorm + passiveTotal;

    document.getElementById('storm-results').innerHTML = `
        <strong>Results:</strong><br>
        Storm events: ${eventCount}<br>
        Magnets from storm: ${magnetsFromStorm}<br>
        Passive magnets: ${passiveTotal}<br>
        Total magnets: ${total}
    `;
}
