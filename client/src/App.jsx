import React, { useState, useEffect, useContext } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './page/home/Home'
import CartPage from './page/cart/Cart'
import Ads from './component/home/Ads'
import Navigation from './component/home/Navigation'
import Footer from './component/home/Footer'
import LoginPage from './page/authentication/Login'
import Signup from './page/authentication/Signup'
import Checkout from './page/checkout/Checkout'
import ProductSections from './page/product/ProductPage'
import Modal from './contextApi/Modal'
import Buyer from './page/dashboard/buyers/Buyer'
import MyOrder from './component/buyers-dashboard/MyOrder'
import Sellers from './page/dashboard/sellers/Sellers'
import Orders from './component/sellers-dashboard/Orders'
import Products from './component/sellers-dashboard/Products'
import Address from './component/checkout/Address'
import { CartProvider } from './contextApi/cartContext'
import OrderContext from './contextApi/Orders'
import Management from './component/sellers-dashboard/Management'
import CheckoutNonAuth from './page/checkout/CheckoutNonAuth'
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import PaymentPlan from './page/billing/Offer'
import About from './page/about/About'
import Contact from './page/contact/Contact'
import Faq from './page/faq/Faq'
import Analytics from './Analytics/Analytics'
import Customer from './page/costomers/customers'
import Settings from './component/sellers-dashboard/Settings'
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios'
import { RotatingSquare } from 'react-loader-spinner'
import { ProductUploadContext } from './contextApi/ProductContext'



function App() {
  const location = useLocation();
  const [settings, setSettings] = useState()
  const { fetchAllProducts } = useContext(ProductUploadContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/layout`, { withCredentials: true });
        await fetchAllProducts()
        
        if (res.status === 200 && res.data) {
          const response = res.data;
          changeFavicon(response.logoImage);
          setSettings(response);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      }
      setLoading(false);
    }
    

    fetchSettings()

  }, [])

  const changeFavicon = (newIconUrl) => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = newIconUrl;
  };

  // Check if the current route is a dashboard route
  const isDashboardRoute = location.pathname.includes('/dashboard');


  return (
    <div className='max-w-screen-2xl mx-auto'>
      {
        loading ? (
          <div className='col-span-full flex justify-center items-center h-screen'>
            <RotatingSquare
              visible={true}
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="rotating-square-loading"
              wrapperStyle={{}}
              wrapperClass=""
              />
          </div>
        ): (
          <>
            <Modal>
              <CartProvider>
                <OrderContext>
                    <Ads offer={settings?.offer}/>
                    <Navigation logoImage={settings?.logoImage}/>
                    <Routes>
                      <Route path='/about-us' element={<About />} />
                      <Route 
                        path='/contact' 
                        element={
                          <Contact 
                            location={settings?.location} 
                            contact={settings?.contact} 
                            support={settings?.support} 
                            openHours={settings?.hours} 
                            storeDescription={settings?.storeDescription} 
                          />
                        } 
                      />

                      <Route path='/faq' element={<Faq faq={settings?.content} />} />
                      <Route path='/offer/paymentPlan' element={<PaymentPlan />} />
                      <Route path='/' element={<Home banner={settings?.mainBannerImage}/>} >
                        <Route path='login' element={<LoginPage />} />
                        <Route path='sign-up' element={<Signup />} />
                      </Route>
                      <Route path='/checkout' element={<Checkout />} />
                      <Route path='/checkout/:id' element={<CheckoutNonAuth />} />
                      <Route path='/products/content/:id' element={<ProductSections />} />
                      <Route path='/cart' element={<CartPage />} />
                      <Route element={<AuthOutlet fallbackPath='/login' />} >
                        <Route path='/dashboard/user' element={<Buyer />} >
                          <Route index element={<MyOrder />} />
                          <Route path='address' element={<Address />} />
                        </Route>
                        <Route path='/dashboard/admin' element={<Sellers />} >
                          <Route index element={<Analytics />} />
                          <Route path='orders' element={<Orders />} />
                          <Route path='products' element={<Products />} />
                          {/* <Route path='emails' element={<Email />} /> */}
                          <Route path='customers' element={<Customer />} />
                          <Route path='products/management' element={<Management />} />
                          <Route path='settings' element={<Settings faq={settings?.content} />} />
                        </Route>
                      </Route>
                    </Routes>

                    {/* Conditionally render the footer based on route */}
                    {!isDashboardRoute && <Footer socialLinks={settings?.socialLinks} storeName={settings?.storeName} aboutUs={settings?.aboutUs}/>}
                </OrderContext>
              </CartProvider>
            </Modal>
          </>
        )
      }
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App
