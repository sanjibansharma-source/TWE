export const addToCart = (cart, product) => {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { ...product, quantity: 1 }];
};

export const removeFromCart = (cart, productId) => {
  return cart.filter((item) => item.id !== productId);
};

export const updateQuantity = (cart, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
};

export const getCartTotal = (cart) => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const getCartCount = (cart) => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};