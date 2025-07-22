'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Clock,
  ArrowRight,
  Star,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import { Container, GridLayout, CardLayout, CardLayoutHeader, CardLayoutBody } from '../layout';
import { cn } from '@/utils';

interface Feature {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly description: string;
}

interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly content: string;
  readonly rating: number;
}

interface PricingPlan {
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly description: string;
  readonly features: string[];
  readonly highlighted?: boolean;
}

/**
 * Landing page content component
 * @returns JSX.Element
 */
export const LandingContent = (): JSX.Element => {
  const features: Feature[] = [
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Organize tasks with priorities, due dates, and custom tags for maximum productivity.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates and team assignments.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into productivity with detailed analytics and custom reports.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and GDPR compliance to keep your data safe.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures smooth experience even with thousands of tasks.',
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Available in multiple languages with full internationalization support.',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager',
      company: 'TechCorp',
      content: 'TaskManager has transformed how our team handles projects. The intuitive interface and powerful features have increased our productivity by 40%.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'CEO',
      company: 'StartupHub',
      content: 'Best task management solution we\'ve used. The analytics help us make data-driven decisions about our workflow.',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      role: 'Team Lead',
      company: 'DesignStudio',
      content: 'The collaboration features are outstanding. Our remote team stays perfectly synchronized thanks to TaskManager.',
      rating: 5,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individuals and small teams',
      features: [
        'Up to 10 tasks',
        'Basic task management',
        'Mobile app access',
        'Email support',
      ],
    },
    {
      name: 'Professional',
      price: '$12',
      period: 'per user/month',
      description: 'For growing teams and businesses',
      features: [
        'Unlimited tasks',
        'Advanced analytics',
        'Team collaboration',
        'Priority support',
        'Custom workflows',
        'API access',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Advanced security',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'On-premise option',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <Container size="lg" className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">
              <Sparkles className="h-4 w-4 mr-2" />
              New: AI-powered task suggestions
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Manage Tasks with
              <span className="text-primary block mt-2">Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The professional task management solution that helps teams and individuals 
              stay organized, collaborate effectively, and achieve more every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-xl shadow-xl min-w-[200px]">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-xl min-w-[200px]">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently and collaborate seamlessly.
            </p>
          </div>
          <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <CardLayout key={index} variant="elevated" className="hover:-translate-y-1 transition-transform">
                  <CardLayoutHeader>
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardLayoutHeader>
                </CardLayout>
              );
            })}
          </GridLayout>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <Container size="lg">
          <GridLayout 
            columns={{ mobile: 2, desktop: 4 }}
            gap="xl"
            className="text-center"
          >
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Active Users</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">2M+</div>
              <div className="text-primary-foreground/80">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-primary-foreground/80">Uptime</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">4.9</div>
              <div className="text-primary-foreground/80">User Rating</div>
            </div>
          </GridLayout>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience with TaskManager.
            </p>
          </div>
          <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {testimonials.map((testimonial, index) => (
              <CardLayout key={index} variant="bordered">
                <CardLayoutBody className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardLayoutBody>
              </CardLayout>
            ))}
          </GridLayout>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </p>
          </div>
          <Container size="lg">
            <GridLayout 
              columns={{ mobile: 1, tablet: 3 }}
              gap="xl"
            >
            {pricingPlans.map((plan, index) => (
              <CardLayout
                key={index}
                variant={plan.highlighted ? 'gradient' : 'bordered'}
                className={cn(
                  plan.highlighted && 'ring-2 ring-primary shadow-xl scale-105'
                )}
              >
                <CardLayoutBody className="p-8">
                  {plan.highlighted && (
                    <Badge className="mb-4 rounded-full">Most Popular</Badge>
                  )}
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full rounded-xl"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardLayoutBody>
              </CardLayout>
            ))}
            </GridLayout>
          </Container>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <Container size="lg" className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of teams already using TaskManager to achieve more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                variant="secondary"
                className="rounded-xl shadow-xl min-w-[200px]"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-xl min-w-[200px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};