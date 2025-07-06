  export async function fetchProducts() {
      try {
          const response = await fetch('https://fakestoreapi.com/products');
          const data = await response.json();
          console.log('Products:', data);
          return data;
      } catch (error) {
          console.error('Error fetching products:', error);
          throw error;
      }
  }
   
   