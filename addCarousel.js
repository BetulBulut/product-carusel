(async function () {
    const PRODUCT_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    const STORAGE_PRODUCTS = "prods";
    const STORAGE_FAVORITES = "favs";
  
    if (window.location.pathname !== "/") {
      console.log("wrong page");
      return;
    }
  
    let products = await loadProducts();
    let favorites = loadFavorites();
    createCarousel(products, favorites);
  
    async function loadProducts() {
      const cached = localStorage.getItem(STORAGE_PRODUCTS);
      if (cached) return JSON.parse(cached);
  
      const response = await fetch(PRODUCT_URL);
      const data = await response.json();
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(data));
      return data;
    }
  
    function loadFavorites() {
      return JSON.parse(localStorage.getItem(STORAGE_FAVORITES) || "[]");
    }
  
    function saveFavorites(favs) {
      localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favs));
    }
  
    function createCarousel(products, favorites) {
      const mainContainer = document.createElement("div");
      mainContainer.style.margin = "10px";
  
      const title = document.createElement("h3");
      title.innerText = "Beğenebileceğinizi düşündüklerimiz";
  
      const carousel = document.createElement("div");
      carousel.style.display = "flex";
      carousel.style.overflowX = "scroll";
      carousel.style.gap = "8px";
  
      products.forEach(p => {
        const card = createProductCard(p, favorites);
        carousel.appendChild(card);
      });
  
      mainContainer.appendChild(title);
      mainContainer.appendChild(carousel);
        
      const targetElement = document.querySelector('cx-page-slot[position="Section2A"]');
      if (targetElement) {
          targetElement.appendChild(mainContainer);
      } else {
          document.body.appendChild(mainContainer);
          console.log("Hedef element (cx-page-slot[position='Section2A']) bulunamadı, karusel sayfanın en altına eklendi.");
      }
    }
  
    function createProductCard(product, favorites) {
        const card = document.createElement("div");
        card.style.cssText = `
        border: 1px solid lightgray;
        width: 150px;
        padding: 4px;
        font-size: 13px;
        flex: 0 0 auto;
        position: relative;
        background: #fff;
        `;
        const link = document.createElement("a");
        link.href = product.url;
        link.target = "_blank"; 
        link.style.display = "block"; 

        const img = document.createElement("img");
        img.src =  product.img || "https://dummyimage.com/150x150/cccccc/000000&text=No+Image";
        img.style.width = "100%";
        img.style.height = "130px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "4px";
        img.style.marginBottom = "4px";
        img.style.cursor = "pointer";

        link.appendChild(img);
        card.appendChild(link);

        const title = document.createElement("div");
        title.innerText = product.name;
        title.style.height = "36px";
        title.style.overflow = "hidden";

        const priceInfo = document.createElement("div");
        priceInfo.style.fontWeight = "bold";
        priceInfo.innerText = `${product.price.toFixed(2)} TL`;

        if (product.original_price && product.original_price !== product.price) {
        const original = document.createElement("div");
        original.innerHTML = "<s>" + product.original_price.toFixed(2) + " TL</s>";
        original.style.color = "#999";

        const discount = Math.round((1 - (product.price / product.original_price)) * 100);
        const discountText = document.createElement("div");
        discountText.innerText = "-" + discount + "%";
        discountText.style.color = "#c00";

        card.appendChild(original);
        card.appendChild(discountText);
      }
      
  
      const heart = document.createElement("div");
      heart.innerHTML = "♥";
      heart.style.position = "absolute";
      heart.style.top = "5px";
      heart.style.right = "5px";
      heart.style.cursor = "pointer";
      heart.style.fontSize = "16px";
      heart.style.color = favorites.includes(product.id) ? "orange" : "gray";
  
      heart.addEventListener("click", (e) => {
        e.stopPropagation();
        Favorite(product.id, heart);
      });
  
      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(priceInfo);
      card.appendChild(heart);
  
      card.addEventListener("click", () => {
        window.open(product.link, "_blank");
      });
  
      return card;
    }
    
    function Favorite(productId, heartElement) {
      let favorites = loadFavorites();
      const isFav = favorites.includes(productId);
  
      if (isFav) {
        favorites = favorites.filter(id => id !== productId);
        heartElement.style.color = "gray";
      } else {
        favorites.push(productId);
        heartElement.style.color = "orange";
      }
  
      saveFavorites(favorites);
    }
  })();
  