// Обычный JavaScript: та же корзина, всё больше прямых связей с DOM.
export function wireShop(root, report) {
  const find = selector => root.querySelector(selector);
  const countElement = find('[data-count]');
  const totalElement = find('[data-total]');
  const priceElement = find('[data-price]');
  const statusElement = find('[data-status]');
  const checkoutButton = find('[data-checkout]');
  const deliveryElement = find('[data-delivery]');
  const progressElement = find('[data-progress]');
  const bonusElement = find('[data-bonus]');
  const addButtons = root.querySelectorAll('[data-add]');
  const couponButton = find('[data-coupon]');
  const apiButton = find('[data-api]');

  let count = 0;
  let price = 700;
  let discount = false;

  function updateView() {
    const total = count * price * (discount ? 0.9 : 1);
    countElement.textContent = count;
    totalElement.textContent = total;
    priceElement.textContent = price + ' ₽';
    statusElement.textContent = count > 0 ? 'В корзине есть товары' : 'Корзина пока пуста';
    checkoutButton.disabled = count === 0;

    deliveryElement.textContent = total >= 2000 ? 'Бесплатно' : 'Ещё ' + (2000 - total) + ' ₽';
    progressElement.value = Math.min(total, 2000);
    bonusElement.textContent = Math.floor(total * 0.05);
  }

  function notify(action) {
    report({count, price, discount, action});
  }
  function add() {
    count = count + 1;
    updateView();
    notify('add');
  }
  function applyCoupon() {
    discount = !discount;
    updateView();
    notify('coupon');
  }
  function changePrice() {
    // Имитируем ответ сервера с новой ценой.
    price = price === 700 ? 900 : 700;
    updateView();
    notify('api');
  }

  // Пять мест добавления используют одну и ту же функцию.
  addButtons.forEach(function (button) {
    button.addEventListener('click', add);
  });
  couponButton.addEventListener('click', applyCoupon);
  apiButton.addEventListener('click', changePrice);
  updateView();

  // Сброс демонстрации и очистка событий.
  return {
    reset() {
      count = 0;
      price = 700;
      discount = false;
      updateView();
      notify('reset');
    },
    dispose() {
      addButtons.forEach(function (button) {
        button.removeEventListener('click', add);
      });
      couponButton.removeEventListener('click', applyCoupon);
      apiButton.removeEventListener('click', changePrice);
    }
  };
}
