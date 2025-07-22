'use client';

import React from 'react';
import Link from 'next/link';
import { FlexLayout, GridLayout } from './GridLayout';
import { Container } from './Container';
import { useUI } from '@/hooks';

/**
 * Footer heading component
 */
const FooterHeading = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <h4 className="font-semibold text-foreground">{children}</h4>
);

/**
 * Footer text component
 */
const FooterText = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <p className="text-muted-foreground">{children}</p>
);

/**
 * Footer link component
 */
const FooterLink = ({ 
  href, 
  children 
}: { 
  href: string; 
  children: React.ReactNode;
}): JSX.Element => (
  <Link href={href as any} className="text-muted-foreground hover:text-foreground transition-colors">
    {children}
  </Link>
);

/**
 * Footer section component
 */
const FooterSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}): JSX.Element => (
  <FlexLayout direction="column" gap="lg">
    <FooterHeading>{title}</FooterHeading>
    <FlexLayout direction="column" gap="md">
      {children}
    </FlexLayout>
  </FlexLayout>
);

/**
 * Company info section
 */
const CompanySection = (): JSX.Element => {
  const { t } = useUI();
  
  return (
    <FlexLayout direction="column" gap="lg" className="tablet:col-span-2">
      <h3 className="text-xl font-bold text-foreground">{t('company.name')}</h3>
      <FooterText>{t('company.tagline')}</FooterText>
    </FlexLayout>
  );
};

/**
 * Quick links section
 */
const QuickLinksSection = (): JSX.Element => {
  const { t } = useUI();
  
  return (
    <FooterSection title={t('footer.quickLinks')}>
      <FooterLink href={'/features' as any}>
        {t('footer.features')}
      </FooterLink>
      <FooterLink href={'/pricing' as any}>
        {t('footer.pricing')}
      </FooterLink>
      <FooterLink href={'/about' as any}>
        {t('footer.about')}
      </FooterLink>
    </FooterSection>
  );
};

/**
 * Legal links section
 */
const LegalSection = (): JSX.Element => {
  const { t } = useUI();
  
  return (
    <FooterSection title={t('footer.legal')}>
      <FooterLink href={'/privacy' as any}>
        {t('footer.privacyPolicy')}
      </FooterLink>
      <FooterLink href={'/terms' as any}>
        {t('footer.termsOfService')}
      </FooterLink>
      <FooterLink href={'/gdpr' as any}>
        {t('footer.gdpr')}
      </FooterLink>
    </FooterSection>
  );
};

/**
 * Copyright section
 */
const CopyrightSection = (): JSX.Element => {
  const { t } = useUI();
  
  return (
    <FlexLayout direction="column" gap="md" className="border-t border-border">
      <FlexLayout direction="row" justify="center">
        <FooterText>{t('footer.copyright')}</FooterText>
      </FlexLayout>
    </FlexLayout>
  );
};

/**
 * Main footer component
 */
export const Footer = (): JSX.Element => {
  return (
    <footer className="bg-muted/10 border-t border-border mt-auto">
      <Container>
        <FlexLayout direction="column" gap="xl">
          <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="xl">
            <CompanySection />
            <QuickLinksSection />
            <LegalSection />
          </GridLayout>
          <CopyrightSection />
        </FlexLayout>
      </Container>
    </footer>
  );
};