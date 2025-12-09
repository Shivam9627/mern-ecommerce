import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-800 bg-transparent text-sm text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-emerald-400">E-Commerce</h3>
            <p className="mt-3 text-gray-400 max-w-lg">
              E-Commerce is your destination for curated products, secure checkout, and fast delivery. We
              prioritize quality and a smooth shopping experience.
            </p>
          </div>

          <div>
            <p className="text-lg font-semibold mb-4 text-white">Company</p>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-emerald-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-emerald-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="/category/men" className="hover:text-emerald-400">
                  Shop
                </a>
              </li>
              <li>
                <a href="/policy" className="hover:text-emerald-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold mb-4 text-white">Contact</p>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>Phone: [+91] 0123456789</li>
              <li>Email: contact@ecommerce.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <hr className="border-gray-800" />
          <p className="py-4 text-center text-gray-400">© {currentYear} ecommerce.com - All Rights Reserved</p>
          <p className="pb-2 text-center text-gray-400">Made with ❤️ by Shivam Chamoli</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
