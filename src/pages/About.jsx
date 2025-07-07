// AboutPage.jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl text-gray-600">
            Learn more about who we are, what we do, and why we love doing it.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg">
            At <span className="font-semibold">[Your Brand]</span>, our mission is to provide high-quality, affordable products that elevate everyday life. We believe shopping should be easy, fun, and inspiring.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-10">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Quality', desc: 'We deliver only the best in everything we sell.' },
              { title: 'Customer First', desc: 'Your satisfaction is our top priority.' },
              { title: 'Innovation', desc: 'We’re always improving our products and service.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-10">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Alice Johnson', role: 'Founder & CEO' },
              { name: 'David Smith', role: 'Head of Marketing' },
              { name: 'Sophie Lee', role: 'Product Manager' },
            ].map((member, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl shadow-md bg-white">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300" />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
