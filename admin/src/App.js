import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Component/Layout";
import Dashboard from "./Component/Dashboard";
import Header from "./Component/Header";
import Category from "./Component/category";
import Invoice from "./Component/Invoice";
import Product from "./Component/Product";
import OrderList from "./Component/OrderList";
import PrductView from "./Component/PrductView";
import Reports from "./Component/Reports";
import Clients from "./Component/Clients";
import ClientView from "./Component/ClientsView";
import Login from "./Component/Login";
import Offers from "./Component/Offers";
import Banners from "./Component/Banner";
import Signup from "./Component/Signup";
import DeliveryCharge from "./Component/DeliveryCharge";

import DeliveryChallan from "./Component/DeliveryChallan";
import TicketsRise from "./Component/Tickets";
import DeliverChallanFormat from "./Component/DeliverChallanFormat";
import OrderDetails from "./Component/OrderDetails";
import Querylist from "./Component/Querylist";

function App() {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/home"
          element={
            <Layout>
              <Header />
              <Dashboard />
            </Layout>
          }
        />
        <Route
          exact
          path="/category"
          element={
            <Layout>
              <Header />
              <Category />
            </Layout>
          }
        />

        <Route
          exact
          path="/Invoice"
          element={
            <Layout>
              <Header />
              <Invoice />
            </Layout>
          }
        />
        <Route
          exact
          path="/DeliverChallanFormat"
          element={
            <Layout>
              <Header />
              <DeliverChallanFormat />
            </Layout>
          }
        />

        <Route
          exact
          path="/Product"
          element={
            <Layout>
              <Header />
              <Product />
            </Layout>
          }
        />
        <Route
          exact
          path="/OrderList"
          element={
            <Layout>
              <Header />
              <OrderList />
            </Layout>
          }
        />
        <Route
          exact
          path="/PrductView"
          element={
            <Layout>
              <Header />
              <PrductView />
            </Layout>
          }
        />
        <Route
          exact
          path="/Reports"
          element={
            <Layout>
              <Header />
              <Reports />
            </Layout>
          }
        />
        <Route
          exact
          path="/Clients"
          element={
            <Layout>
              <Header />
              <Clients />
            </Layout>
          }
        />
        <Route
          exact
          path="/ClientView"
          element={
            <Layout>
              <Header />
              <ClientView />
            </Layout>
          }
        />
        <Route
          exact
          path="/Offers"
          element={
            <Layout>
              <Header />
              <Offers />
            </Layout>
          }
        />
        <Route
          exact
          path="/banners"
          element={
            <Layout>
              <Header />
              <Banners />
            </Layout>
          }
        />
        <Route
          exact
          path="/DeliveryCharge"
          element={
            <Layout>
              <Header />
              <DeliveryCharge />
            </Layout>
          }
        />
        <Route
          exact
          path="/DeliveryChallan"
          element={
            <Layout>
              <Header />
              <DeliveryChallan />
            </Layout>
          }
        />

        <Route
          exact
          path="/Tickets"
          element={
            <Layout>
              <Header />
              <TicketsRise />
            </Layout>
          }
        />
        <Route
          exact
          path="/orderdetails"
          element={
            <Layout>
              <Header />
              <OrderDetails />
            </Layout>
          }
        />
        <Route
          exact
          path="/Querylist"
          element={
            <Layout>
              <Header />
              <Querylist />
            </Layout>
          }
        />

        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
