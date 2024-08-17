import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const productContext = createContext();

const ProductContext = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('Latest');
    const [sortByCategory, setSortByCategory] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/product`, { withCredentials: true });
                setProducts(response.data.message);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortProducts = (products, option) => {
        let sortedProducts = [...products];
        switch (option) {
            case 'Highest to Lowest':
                sortedProducts.sort((a, b) => parseFloat(b.price.$numberDecimal || b.price) - parseFloat(a.price.$numberDecimal || a.price));
                break;
            case 'Lowest to Highest':
                sortedProducts.sort((a, b) => parseFloat(a.price.$numberDecimal || a.price) - parseFloat(b.price.$numberDecimal || b.price));
                break;
            case 'Latest':
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }
        return sortedProducts;
    };

    const filterProductsByCategory = (products, category) => {
        if (category === 'all') return products;
        return products.filter(product => product.categoryId.name === category);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <productContext.Provider value={{
            products,
            loading,
            sortOption,
            sortByCategory,
            setSortByCategory,
            sortProducts,
            filterProductsByCategory,
            handleSortChange
        }}>
            {children}
        </productContext.Provider>
    );
};

export default ProductContext;
