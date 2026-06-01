"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrice = parsePrice;
exports.formatPrice = formatPrice;
function parsePrice(price) {
    return Number(price);
}
function formatPrice(price, currency = "CZK") {
    return new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency,
    }).format(Number(price));
}
