let currencySymbol = "$";
// Draws product list
function drawProducts() {
  let productList = document.querySelector(".products");

  let productItems = "";
  productsArr.forEach((element) => {
    productItems += `
            <div data-SKU='${element.SKU}'>
                <img src='${element.image}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${element.price}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
  });
  // use innerHTML so that products only drawn once
  productList.innerHTML = productItems;
}

// Draws cart
function drawCart() {
  let cartList = document.querySelector(".cart");
  // clear cart before drawing
  let cartItems = "";
  cartArr.forEach((element) => {
    let itemTotal = element.price * element.quantity;

    cartItems += `
            <div data-SKU='${element.SKU}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${element.price}</p>
                <p>quantity: ${element.quantity}</p>
                <p>total: ${currencySymbol}${itemTotal}</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">remove</button>
            </div>
        `;
  });
  // use innerHTML so that cart products only drawn once
  cartArr.length
    ? (cartList.innerHTML = cartItems)
    : (cartList.innerHTML = "Cart Empty");
}

// Draws checkout
function drawCheckout() {
  let checkout = document.querySelector(".cart-total");
  checkout.innerHTML = "";
  // run cartTotal() from script.js
  let cartSum = cartTotal();
  console.log(cartSum);
  let div = document.createElement("div");
  div.innerHTML = `<p>Cart Total: ${currencySymbol}${cartSum}`;
  checkout.append(div);
}

// Initialize store with products, cart, and checkout
drawProducts();
drawCart();
drawCheckout();

document.querySelector(".products").addEventListener("click", (e) => {
  let productSKU = e.target.parentNode.getAttribute("data-SKU");
  productSKU *= 1;
  addToCart(productSKU);
  drawCart();
  drawCheckout();
});

// Event delegation used to support dynamically added cart items
document.querySelector(".cart").addEventListener("click", (e) => {
  // Helper nested higher order function to use below
  // Must be nested to have access to the event target
  // Takes in a cart function as an agrument
  function runCartFunction(fn) {
    let productSKU = e.target.parentNode.getAttribute("data-SKU");
    productSKU *= 1;
    for (let i = cartArr.length - 1; i > -1; i--) {
      if (cartArr[i].SKU === productSKU) {
        let SKU = cartArr[i].SKU;
        fn(SKU);
      }
    }
    // force cart and checkout redraw after cart function completes
    drawCart();
    drawCheckout();
  }

  // check the target's class and run function based on class
  if (e.target.classList.contains("remove")) {
    // run remove() from script.js
    runCartFunction(remove);
  } else if (e.target.classList.contains("qup")) {
    // run increase() from script.js
    runCartFunction(increase);
  } else if (e.target.classList.contains("qdown")) {
    // run decrease() from script.js
    runCartFunction(decrease);
  }
});

document.querySelector(".pay").addEventListener("click", (e) => {
  e.preventDefault();

  // Get input cash received field value, set to number
  let amount = document.querySelector(".received").value;
  amount *= 1;

  // Set cashReturn to return value of pay()
  let cashReturn = pay(amount);

  let paymentSummary = document.querySelector(".pay-summary");
  let div = document.createElement("div");

  // If total cash received is greater than cart total thank customer
  // Else request additional funds
  if (cashReturn >= 0) {
    div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount}</p>
            <p>Cash Returned: ${currencySymbol}${cashReturn}</p>
            <p>Thank you!</p>
        `;
  } else {
    // reset cash field for next entry
    document.querySelector(".received").value = "";
    div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount}</p>
            <p>Remaining Balance: ${cashReturn}$</p>
            <p>Please pay additional amount.</p>
            <hr/>
        `;
  }

  paymentSummary.append(div);
});

/* Standout suggestions */
/* Begin remove all items from cart */
function dropCart() {
  let shoppingCart = document.querySelector(".empty-btn");
  let div = document.createElement("button");
  div.classList.add("empty");
  div.innerHTML = `Empty Cart`;
  shoppingCart.append(div);
}
dropCart();

document.querySelector(".empty-btn").addEventListener("click", (e) => {
  if (e.target.classList.contains("empty")) {
    emptyCart();
    drawCart();
    drawCheckout();
  }
});
/* End all items from cart */
