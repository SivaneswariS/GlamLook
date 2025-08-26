import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false); // for mobile toggle
  const { addToCart } = useCart();
  const location = useLocation();
  const params = useParams();

  // ✅ Helper function to toggle checkbox values
  const handleCheckboxChange = (value, setter, selectedList) => {
    if (selectedList.includes(value)) {
      setter(selectedList.filter((item) => item !== value));
    } else {
      setter([...selectedList, value]);
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedColors([]);
    setPriceRange([0, 10000]);

    // Auto-close filter panel if on mobile
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };


  // Fetch products
  useEffect(() => {
    fetch("http://https://app-glamlook.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // ✅ Handle filters when URL changes
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const category = query.get("category");
    const productName = params.name;

    if (category) setSelectedCategories([category]);
    else setSelectedCategories([]);

    if (productName) {
      setSelectedCategories([]);
      setSelectedOccasions([]);
      setSelectedColors([]);
    }
  }, [location.search, params.name]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const productName = params.name;
    if (productName) {
      return p.name.toLowerCase() === productName.toLowerCase();
    }

    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const occasionMatch =
      selectedOccasions.length === 0 || selectedOccasions.includes(p.occasion);
    const colorMatch =
      selectedColors.length === 0 || selectedColors.includes(p.color);
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];

    return categoryMatch && occasionMatch && colorMatch && priceMatch;
  });

  return (
    <section className="py-12 px-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">All Products</h2>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-6 text-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-fuchsia-700 text-white rounded-lg font-medium shadow hover:bg-fuchsia-800"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`bg-white p-4 rounded-xl shadow-md w-full md:w-64 md:block ${showFilters ? "block" : "hidden"
            }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={handleClearAll}
              className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Clear All
            </button>


          </div>

          {/* Category Filter */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">Category</summary>
            {["Dress", "Accessory", "Footwear"].map((cat) => (
              <label key={cat} className="flex items-center gap-2 mb-2 pl-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() =>
                    handleCheckboxChange(cat, setSelectedCategories, selectedCategories)
                  }
                  className="w-4 h-4 accent-fuchsia-700"
                />
                <span>{cat}</span>
              </label>
            ))}
          </details>

          {/* Occasion Filter */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">Occasion</summary>
            {["Party", "Wedding", "Drama", "Reception"].map((occ) => (
              <label key={occ} className="flex items-center gap-2 mb-2 pl-2">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(occ)}
                  onChange={() =>
                    handleCheckboxChange(occ, setSelectedOccasions, selectedOccasions)
                  }
                  className="w-4 h-4 accent-fuchsia-700"
                />
                <span>{occ}</span>
              </label>
            ))}
          </details>

          {/* Color Filter */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">Color</summary>
            {["Red", "Blue", "Gold", "White", "Black", "Green", "Pink", "Purple"].map(
              (color) => (
                <label key={color} className="flex items-center gap-2 mb-2 pl-2">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() =>
                      handleCheckboxChange(color, setSelectedColors, selectedColors)
                    }
                    className="w-4 h-4 accent-fuchsia-700"
                  />
                  <span>{color}</span>
                </label>
              )
            )}
          </details>

          {/* Price Filter */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">
              Price Range (₹)
            </summary>
            <div className="mb-2 text-sm text-gray-600 pl-2">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </div>
            <Range
              step={100}
              min={0}
              max={10000}
              values={priceRange}
              onChange={(values) => setPriceRange(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="w-full h-2 bg-gray-200 rounded"
                  style={{ ...props.style }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, index }) => {
                const { key, ...rest } = props;
                return (
                  <div
                    {...rest}
                    key={index}
                    className="h-4 w-4 bg-fuchsia-700 rounded-full shadow cursor-pointer"
                  />
                );
              }}
            />
          </details>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/products/${product._id}`}>
                <div className="h-64 w-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={`http://localhost:3000/images/${product.image}`}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="font-bold text-pink-600 mb-3">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-lg font-medium shadow"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
