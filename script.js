document.addEventListener('DOMContentLoaded', () => {
    let stocks = [
        { name: "Boba Pearls", qty: 85, max: 100, unit: "kg", color: "from-amber-700 to-amber-900" },
        { name: "Brown Sugar Syrup", qty: 90, max: 100, unit: "L", color: "from-orange-600 to-amber-800" },
        { name: "Taro Powder", qty: 70, max: 100, unit: "kg", color: "from-purple-500 to-indigo-600" },
        { name: "Matcha Powder", qty: 60, max: 100, unit: "kg", color: "from-emerald-500 to-green-700" },
        { name: "Fresh Milk", qty: 95, max: 100, unit: "L", color: "from-sky-400 to-blue-600" }
    ];

    const drinks = [
        { name: "Classic Boba Milk Tea", price: 120, icon: "🧋", req: [ { item: "Boba Pearls", use: 3 }, { item: "Fresh Milk", use: 2 } ] },
        { name: "Taro Milk Tea", price: 135, icon: "💜", req: [ { item: "Taro Powder", use: 4 }, { item: "Fresh Milk", use: 2 } ] },
        { name: "Matcha Latte", price: 145, icon: "🍵", req: [ { item: "Matcha Powder", use: 4 }, { item: "Fresh Milk", use: 3 } ] },
        { name: "Brown Sugar Boba", price: 150, icon: "🍯", req: [ { item: "Boba Pearls", use: 4 }, { item: "Brown Sugar Syrup", use: 3 }, { item: "Fresh Milk", use: 2 } ] }
    ];

    let totalRevenue = 0;
    let transactions = [];

    const stockList = document.getElementById('stockList');
    const drinkMenu = document.getElementById('drinkMenu');
    const salesLog = document.getElementById('salesLog');
    const revenueDisplay = document.getElementById('revenueDisplay');
    const orderCount = document.getElementById('orderCount');
    const restockBtn = document.getElementById('restockBtn');

    function renderStocks() {
        stockList.innerHTML = stocks.map(s => {
            const pct = Math.round((s.qty / s.max) * 100);
            return `
            <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="text-slate-200">${s.name}</span>
                    <span class="${pct < 20 ? 'text-rose-400 font-bold' : 'text-slate-400'}">${s.qty} ${s.unit} (${pct}%)</span>
                </div>
                <div class="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div class="h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-500" style="width: ${pct}%;"></div>
                </div>
            </div>`;
        }).join('');
    }

    function renderMenu() {
        drinkMenu.innerHTML = drinks.map((d, i) => `
            <div class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between text-center transition hover:border-amber-500/40">
                <div class="text-4xl mb-2">${d.icon}</div>
                <h4 class="font-bold text-slate-100 text-sm mb-1">${d.name}</h4>
                <div class="text-amber-400 font-extrabold text-base mb-3">₱${d.price}.00</div>
                <button class="order-btn bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-xl active:scale-95 transition text-xs shadow-md shadow-amber-600/20" data-index="${i}">
                    Order Drink
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                orderDrink(drinks[idx]);
            });
        });
    }

    function orderDrink(drink) {
        // Check stock availability
        for (let r of drink.req) {
            const stock = stocks.find(s => s.name === r.item);
            if (!stock || stock.qty < r.use) {
                alert(`Cannot make order: Low stock for ${r.item}! Click Restock All Supplies.`);
                return;
            }
        }

        // Deduct stock
        drink.req.forEach(r => {
            const stock = stocks.find(s => s.name === r.item);
            stock.qty -= r.use;
        });

        totalRevenue += drink.price;
        transactions.unshift({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            item: drink.name,
            price: drink.price
        });

        updateUI();
    }

    function updateUI() {
        renderStocks();
        revenueDisplay.textContent = `₱${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        orderCount.textContent = `${transactions.length} orders`;

        if (transactions.length > 0) {
            salesLog.innerHTML = transactions.map(t => `
                <tr class="hover:bg-slate-800/40">
                    <td class="py-2.5 text-xs text-slate-400 font-mono">${t.time}</td>
                    <td class="py-2.5 font-medium">${t.item}</td>
                    <td class="py-2.5 text-right font-bold text-amber-400">₱${t.price}.00</td>
                </tr>
            `).join('');
        }
    }

    restockBtn.addEventListener('click', () => {
        stocks.forEach(s => s.qty = s.max);
        updateUI();
    });

    renderStocks();
    renderMenu();
});
