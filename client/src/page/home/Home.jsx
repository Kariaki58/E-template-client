import React, { useContext, useState } from 'react';
import Header from '../../component/home/Header';
import ProductList from '../../component/home/ProductList';
import Categories from '../../component/home/Categories';
import { Outlet } from 'react-router-dom';
import { context } from '../../contextApi/Modal';


const Home = () => {
    const { isOpen } = useContext(context)
  return (
    <div>
      <Header />
      <Categories />
      <ProductList />
      {
        isOpen && (
          <Outlet isOpen={isOpen} />
        )
      }
    </div>
  );
}

export default Home;
