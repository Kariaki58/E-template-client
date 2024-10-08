import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/home/Home'
import CartPage from './page/cart/Cart'
import Ads from './component/home/Ads'
import Navigation from './component/home/Navigation';
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
import Email from './component/sellers-dashboard/Email'
import Address from './component/checkout/Address'
import { CartProvider } from './contextApi/cartContext'
import OrderContext from './contextApi/Orders'
import Management from './component/sellers-dashboard/Management'
import CheckoutNonAuth from './page/checkout/CheckoutNonAuth'
import { ProductUploadProvider } from './contextApi/ProductContext'
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import PaymentPlan from './page/billing/Offer'
import About from './page/about/About'
import Contact from './page/contact/Contact'
import Faq from './page/faq/Faq'
import AbondonCart from './component/sellers-dashboard/AbondonCart'
import Analytics from './Analytics/Analytics'


function App() {
  return (
    <div className='max-w-screen-2xl mx-auto'>
      <Modal>
        <CartProvider>
        <OrderContext>
        <ProductUploadProvider>
          <Ads />
          <Navigation />
          <Routes>
            <Route path='/about-us' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/faq' element={<Faq />} />
            <Route path='/offer/paymentPlan' element={<PaymentPlan />} />
            <Route path='/' element={<Home />}>
              <Route path='login' element={<LoginPage />} />
              <Route path='sign-up' element={<Signup />}/>
            </Route>
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/checkout/:id' element={<CheckoutNonAuth />} />
            <Route path='/products/content/:id' element={<ProductSections />} />
            <Route path='/cart' element={<CartPage />} />
            <Route element={<AuthOutlet fallbackPath='/login' />}>
              <Route path='/dashboard/user' element={<Buyer />}>
                <Route index element={<MyOrder />} />
                <Route path='address' element={<Address />} />
              </Route>
              <Route path='/dashboard/admin' element={<Sellers />}>
                <Route index element={<Analytics />} />
                <Route path='orders' element={<Orders />} />
                <Route path='products' element={<Products />} />
                <Route path='emails' element={<Email />} />
                <Route path='products/management' element={<Management />} />
                <Route path='products/abandon/cart' element={<AbondonCart />} />
              </Route>
            </Route>
          </Routes>
          <Footer />
        </ProductUploadProvider>
        </OrderContext>
        </CartProvider>
      </Modal>
    </div>
  )
}

export default App
