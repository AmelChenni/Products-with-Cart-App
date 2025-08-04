// initialize local storage
let cart = JSON.parse(localStorage.getItem('cart'))||[];



// initialize App
function initializeApp(){
  fetch('./products.json')
  .then((responce)=>responce.json())
  .then((products)=>{
    let allProducts = products;
    console.log(allProducts);
    // get categories
    renderCateories(allProducts);
    // get products
    renderProducts(allProducts);
    // update Cart
    updateCart();
  }).catch((error)=>{
    console.log("Error Fetching:",error);
  })
}

// function get categories
function renderCateories(products){
  let categories = Array.from(new Set (products.map((product)=>product.category)));
  // display the categories
  let navbar= document.querySelector('#navbar');
  navbar.textContent = ""
  // update Active Class
  function updateActive(category){
    let allCategories = document.querySelectorAll('.nav-item');
    allCategories.forEach(element => {
      element.classList.remove("active");
    });    
    category.classList.add("active");
  }
  // display first one "All products"
  let liAllProducts = document.createElement('li');
  liAllProducts.className = "nav-item active";
  liAllProducts.textContent ="All Products";
      // update active
      liAllProducts.addEventListener('click',function(){
        updateActive(liAllProducts)
      })
  navbar.appendChild(liAllProducts);
  // display others categories
  categories.forEach(category => {
      let liCategory = document.createElement('li');
      liCategory.className = "nav-item";
      liCategory.textContent =category;
        // update active
      liCategory.addEventListener('click',function(){    
        updateActive(liCategory);
      let filteredProducts = products.filter(p => p.category === category);
      renderProducts(filteredProducts);        
      })
      navbar.appendChild(liCategory);
      
  });
  
  
}

// function get All Products
function renderProducts(products){
  let productsList = document.querySelector('.products');
  productsList.innerHTML= "";
  products.forEach(product => {
         // span number of item in cart
      const cartItem = cart.find((item)=>item.id===product.id.toString());
      const cartQuantity = cartItem? cartItem.quantity:0 ;
        // 
    let productDiv = document.createElement('div');
    productDiv.classList.add("product-card");
    productDiv.innerHTML=`
      <span class="id">#${product.id}</span>
      <img src="imgs/${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p class="description">${product.description}.</p>
      <div class="info-container">
        <p class="price">$${product.price}</p>
        <p class="in-cart-amount">  ${cartQuantity > 0 ? `[ <span>${cartQuantity}</span> ] In Cart` : `<span> Not In Cart </span>` }</p>
      </div>
      <button data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
        Add To Cart
      </button>
      `
      productsList.appendChild(productDiv)
  });
  // btn add
  let buttons = document.querySelectorAll('.product-card button');
  buttons.forEach(button => {
    button.addEventListener('click',addToCart);  
  });  

}

// function add to cart
function addToCart(event){
      let id  = event.target.getAttribute('data-id');
      let title  = event.target.getAttribute('data-title');
      let price  = Number(event.target.getAttribute('data-price'));
      // add to local storage
      // check if first time or no
      let existItem = cart.find((item)=> item.id === id);      
      if(existItem){
        existItem.quantity++;        
      }else{
        cart.push({id,title,price,quantity:1})
      }
      localStorage.setItem("cart",JSON.stringify(cart));
      updateCart();


      let x = event.target.getAttribute("data-id");
        let newQuantity = cart.find((item)=> item.id === x); 
        newQuantity = newQuantity.quantity;     
        // get the element
        let box = this.closest(".product-card");
        let y =box.querySelector('.in-cart-amount span');
        y.textContent =`${newQuantity} In Cart`; 
      
        

}

// function updateCart 
function updateCart(){
let cart = JSON.parse(localStorage.getItem('cart'))||[];
let cartItems = document.querySelector(".cart-items");
let totalPrice = document.querySelector('#cart-total');

cartItems.innerHTML = "";

cart.forEach(element => {
  let liCart = document.createElement('li');
  liCart.innerHTML= `
   <div>
        <h4>${element.title}</h4>
        <span>${element.price} x${element.quantity} </span>
      </div>
      <button class="delete-btn" data-id="${element.id}">Delete</button>
  `
  cartItems.appendChild(liCart);

});
  // delete function
 let buttons = document.querySelectorAll('.cart-items button');
  buttons.forEach(button => {
    button.addEventListener('click',function(){
      deleteFromCart(button.getAttribute('data-id'));
      
    });  
  });
// calc the total Price
const total = cart.reduce((sum, item) => {
  return sum + item.price * item.quantity;
}, 0);

totalPrice.textContent = total.toFixed(2);
}

// function delete
function deleteFromCart(id){
 cart = JSON.parse(localStorage.getItem('cart'))||[];
// cart.splice(cart.id, 1);
 cart = cart.filter(element =>element.id!==id)
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCart();
}

 
// On louding
document.addEventListener("DOMContentLoaded",initializeApp);


