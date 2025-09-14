// utils/getDiscount.js
export function getDiscount(price, discount) {
    return price - price * (discount / 100);
}
