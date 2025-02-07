import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">StockSync AI</h3>
            <p className="text-gray-600">
              Transforming inventory management with artificial intelligence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail size={20} />
              <a
                href="mailto:contact@stocksync.ai"
                className="hover:text-primary"
              >
                contact@stocksync.ai
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} StockSync AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
