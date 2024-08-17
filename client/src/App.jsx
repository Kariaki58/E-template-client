import React, { useState } from 'react'
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
import Analytics from './component/sellers-dashboard/Analytics'
import Orders from './component/sellers-dashboard/Orders'
import Products from './component/sellers-dashboard/Products'
import Email from './component/sellers-dashboard/Email'
import Address from './component/checkout/Address'
import ProductContext from './contextApi/ProductContext'

function App() {
  
  return (
    <div className='max-w-screen-2xl mx-auto'>
      <Modal>
        <ProductContext>
          <Ads />
          <Navigation />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/' element={<Home />}>
              <Route path='login' element={<LoginPage />} />
              <Route path='sign-up' element={<Signup />}/>
            </Route>
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/:id/product' element={<ProductSections />} />
            <Route path='/dashboard/user' element={<Buyer />}>
              <Route index element={<MyOrder />} />
              <Route path='address' element={<Address />} />
            </Route>
            <Route path='/dashboard/admin' element={<Sellers />}>
              <Route index element={<Analytics />} />
              <Route path='orders' element={<Orders />} />
              <Route path='products' element={<Products />} />
              <Route path='emails' element={<Email />} />
            </Route>
          </Routes>
          <Footer />
        </ProductContext>
      </Modal>
    </div>
  )
}

export default App
