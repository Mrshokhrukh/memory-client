'use client';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fadeIn">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6">
              Capture Memories
              <span className="text-gradient-primary block mt-2">Together</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Create collaborative digital memory capsules with friends and
              family. Share photos, videos, stories, and moments in beautiful,
              interactive spaces that bring people together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/register">
                <Button size="xl" className="group">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Start Creating Memories
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="group">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Memoryscape?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need to create and share meaningful memories with
              the people you care about
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-slideUp">
            {[
              {
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                title: 'Collaborative',
                description:
                  'Invite friends and family to contribute photos, videos, and stories to shared memory capsules.',
                color: 'primary',
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Real-time',
                description:
                  'See updates instantly as others add memories. Live reactions and comments make sharing more engaging.',
                color: 'secondary',
              },
              {
                icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                title: 'Private & Secure',
                description:
                  'Control who can see and contribute to your memories with flexible privacy settings and secure sharing.',
                color: 'success',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-20 h-20 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-${feature.color}-200 transition-all duration-300 group-hover:scale-110`}
                >
                  <svg
                    className={`w-10 h-10 text-${feature.color}-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="animate-slideUp">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Happy Users</div>
            </div>
            <div
              className="animate-slideUp"
              style={{ animationDelay: '200ms' }}
            >
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Memories Shared</div>
            </div>
            <div
              className="animate-slideUp"
              style={{ animationDelay: '400ms' }}
            >
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-slideUp">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join thousands of families and friends who are already preserving
              their precious moments together.
            </p>
            <Link to="/register">
              <Button size="xl" className="group">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Capsule
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                Memoryscape
              </span>
            </div>
            <p className="text-neutral-600">
              © 2024 Memoryscape. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
