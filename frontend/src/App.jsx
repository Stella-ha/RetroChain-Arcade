import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="flex-1">
        <AppRoutes/>
        <ProtectedRoutes/>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
