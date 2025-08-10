import React from 'react';
import Header from "./components/Header";
import MainRoutes from "./routes/MainRoute";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="flex-1">
          <MainRoutes />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
