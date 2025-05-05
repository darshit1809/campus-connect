import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;