"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Calendar, Shield, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Navigation */}
      <nav className="border-b border-light-secondary bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-primary mr-2" />
              <span className="text-xl font-cormorant font-bold text-dark-primary">PropertyManager</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="font-satoshi font-medium text-dark-secondary hover:text-blue-primary">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="btn-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-cormorant font-bold text-5xl md:text-7xl text-dark-primary mb-6 leading-tight">
            Manage Your Properties
            <span className="text-blue-primary block">Like a Pro</span>
          </h1>
          <p className="font-satoshi text-xl text-gray-medium mb-8 max-w-3xl mx-auto leading-relaxed">
            Complete property management solution with geolocation mapping, tenant tracking, 
            automated rent reminders, and comprehensive analytics for landlords.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="btn-secondary px-8 py-4 text-lg">
                <Shield className="mr-2 h-5 w-5" />
                Privacy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-cormorant font-bold text-4xl md:text-5xl text-dark-primary mb-6">
              Everything You Need to Manage Properties
            </h2>
            <p className="font-satoshi text-xl text-gray-medium max-w-2xl mx-auto">
              Powerful features designed specifically for landlords and property managers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-primary mb-4" />
                <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Property Mapping</CardTitle>
                <CardDescription className="font-satoshi text-gray-medium">
                  Pin your properties on Google Maps with detailed location information and nearby amenities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-secondary mb-4" />
                <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Tenant Management</CardTitle>
                <CardDescription className="font-satoshi text-gray-medium">
                  Track tenant details, rent agreements, payment history, and contact information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-tertiary mb-4" />
                <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Rent Calendar</CardTitle>
                <CardDescription className="font-satoshi text-gray-medium">
                  Visual calendar showing all rent expiry dates with color-coded status indicators
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Building className="h-12 w-12 text-blue-primary mb-4" />
                <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Document Storage</CardTitle>
                <CardDescription className="font-satoshi text-gray-medium">
                  Store land documents, renovation records, and property images securely in the cloud
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-blue-secondary mb-4" />
                <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Cost Tracking</CardTitle>
                <CardDescription className="font-satoshi text-gray-medium">
                  Track renovation costs and property value to make informed selling decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-tertiary mb-4" />
                <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Automated Reminders</CardTitle>
                <CardDescription className="font-satoshi text-gray-medium">
                  Automatic email and SMS notifications for rent expiries and important dates
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-light-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-cormorant font-bold text-4xl md:text-5xl text-dark-primary mb-6">
              How It Works
            </h2>
            <p className="font-satoshi text-xl text-gray-medium">Simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-cormorant font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="font-cormorant font-semibold text-2xl text-dark-primary mb-4">Add Properties</h3>
              <p className="font-satoshi text-gray-medium">
                Pin your properties on the map and upload relevant documents and images
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-secondary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-cormorant font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="font-cormorant font-semibold text-2xl text-dark-primary mb-4">Add Tenants</h3>
              <p className="font-satoshi text-gray-medium">
                Register tenants with their contact details and rent agreement information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-tertiary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-cormorant font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="font-cormorant font-semibold text-2xl text-dark-primary mb-4">Monitor & Manage</h3>
              <p className="font-satoshi text-gray-medium">
                Use the calendar and dashboard to track rent expiries and send reminders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cormorant font-bold text-4xl md:text-5xl text-white mb-6">
            Ready to Streamline Your Property Management?
          </h2>
          <p className="font-satoshi text-xl text-white/90 mb-8">
            Join hundreds of landlords who trust PropertyManager for their property management needs
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-primary hover:bg-light-primary font-satoshi font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-light-secondary bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building className="h-6 w-6 text-blue-primary mr-2" />
              <span className="text-lg font-cormorant font-semibold text-dark-primary">PropertyManager</span>
            </div>
            <p className="font-satoshi text-gray-medium">© 2024 PropertyManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}