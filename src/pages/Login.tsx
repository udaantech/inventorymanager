import AuthForm from "@/components/auth/AuthForm";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <AuthForm mode="login" />
      </div>
      <Footer />
    </div>
  );
}
