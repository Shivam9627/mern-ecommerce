import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-emerald-400 mb-4">About E-Commerce</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted partner for quality products, seamless shopping, and exceptional service.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-1 shadow-lg">
              <div className="bg-gray-900 rounded-lg p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-300 text-lg">Curated Selection of Premium Products</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              At E-Commerce, we believe online shopping should be simple, reliable, and enjoyable. Our mission
              is to connect you with quality products at fair prices while delivering exceptional customer
              service at every step.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Whether you're looking for the latest trends, everyday essentials, or timeless classics, we
              curate every product to ensure it meets our high standards of quality and value.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose E-Commerce</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-8 hover:border-emerald-400/60 transition">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality Assurance</h3>
              <p className="text-gray-300">
                Every product is carefully vetted and tested to meet our strict quality standards before it reaches you.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-8 hover:border-emerald-400/60 transition">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-white mb-3">Fast & Secure Delivery</h3>
              <p className="text-gray-300">
                We partner with reliable logistics providers to ensure your orders arrive safely and on time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-8 hover:border-emerald-400/60 transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-3">Dedicated Support</h3>
              <p className="text-gray-300">
                Our friendly support team is always here to help with questions, orders, and returns.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Customer First</h3>
                <p className="text-gray-300">Your satisfaction is our priority. We listen to your feedback and continuously improve.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">💎</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Quality & Value</h3>
                <p className="text-gray-300">Premium products at fair prices. No compromises on quality or integrity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Trust & Transparency</h3>
                <p className="text-gray-300">Clear pricing, honest product descriptions, and transparent policies.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🌱</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Continuous Growth</h3>
                <p className="text-gray-300">Always evolving to offer better products, features, and experiences.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Shop?</h2>
          <p className="text-emerald-100 mb-6">Discover thousands of quality products curated just for you.</p>
          <a
            href="/"
            className="inline-block bg-white text-emerald-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
