import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Building2, Users, Wallet, PiggyBank, BarChart as ChartBar, Shield, ArrowRight } from 'lucide-react';
import styles from '../styles/components/Input.module.css';

export function InvestPage() {
  const navigate = useNavigate();

  const investmentOptions = [
    {
      title: 'Property Crowdfunding',
      description: 'Invest in residential properties with as little as £100. Earn returns through rental income and property appreciation.',
      minInvestment: '100',
      expectedReturn: '8-12',
      term: '3-5',
      icon: Building2
    },
    {
      title: 'Property Development',
      description: 'Participate in property development projects. Fund new constructions and major renovations.',
      minInvestment: '5,000',
      expectedReturn: '15-20',
      term: '1-3',
      icon: TrendingUp
    },
    {
      title: 'Buy-to-Let Portfolio',
      description: 'Invest in a diversified portfolio of rental properties managed by experienced professionals.',
      minInvestment: '10,000',
      expectedReturn: '6-10',
      term: '5-10',
      icon: PiggyBank
    }
  ];

  const benefits = [
    {
      title: 'Passive Income',
      description: 'Earn regular rental income without the hassles of property management',
      icon: Wallet
    },
    {
      title: 'Professional Management',
      description: 'Experienced team handles tenant screening, maintenance, and rent collection',
      icon: Users
    },
    {
      title: 'Market Analysis',
      description: 'Data-driven investment decisions based on comprehensive market research',
      icon: ChartBar
    },
    {
      title: 'Asset Security',
      description: 'All investments are secured against physical property assets',
      icon: Shield
    }
  ];

  return (
    <>
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Search className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-2xl font-bold text-primary">RentHub</h1>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-6">Invest in Premium Properties</h1>
              <p className="text-xl mb-8">Access institutional-quality real estate investments with market-leading returns</p>
              <button className={`${styles.searchButton} bg-white !text-primary hover:!bg-neutral-100`}>
                Start Investing Now
              </button>
            </div>
          </div>
        </div>

        {/* Investment Options */}
        <div className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-secondary mb-12 text-center">Investment Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investmentOptions.map((option) => (
                <div key={option.title} className="bg-white rounded-xl p-6 shadow-search hover:shadow-card transition-shadow">
                  <option.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-secondary mb-2">{option.title}</h3>
                  <p className="text-secondary-light mb-6">{option.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-secondary-light">Min Investment</span>
                      <span className="font-semibold text-secondary">£{option.minInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-light">Expected Return</span>
                      <span className="font-semibold text-secondary">{option.expectedReturn}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-light">Investment Term</span>
                      <span className="font-semibold text-secondary">{option.term} years</span>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-secondary mb-12 text-center">Why Invest with Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">{benefit.title}</h3>
                  <p className="text-secondary-light">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of investors who have already discovered the benefits of property investment through RentHub</p>
            <button className={styles.searchButton}>
              Create Investment Account
            </button>
          </div>
        </div>
      </main>
    </>
  );
}