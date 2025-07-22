import React, { type ReactElement } from 'react';
import { styled } from '@/styles';
import { 
  RevealSection, 
  TransitionCard, 
  ImageGallery,
  StaggeredList,
  ZoomableImage
} from './';

/**
 * Example images for demonstration
 */
const exampleImages = [
  {
    src: 'https://a0.muscache.com/im/pictures/miso/Hosting-53733023/original/1e4b3029-b84e-4506-bc0c-37b56f0daf16.jpeg',
    alt: 'Example image 1',
    aspectRatio: 1.5
  },
  {
    src: 'https://a0.muscache.com/im/pictures/miso/Hosting-53662498/original/45b49c51-104c-441a-9336-def21b14b39c.jpeg',
    alt: 'Example image 2',
    aspectRatio: 1.5
  },
  {
    src: 'https://a0.muscache.com/im/pictures/miso/Hosting-53662498/original/dc1f37fd-b5a8-4be1-b835-4b75ab3757d0.jpeg',
    alt: 'Example image 3',
    aspectRatio: 1.5
  },
];

/**
 * Sample card data for demonstration
 */
const cardData = [
  { title: 'Luxury Beachfront Villa', location: 'Malibu, California', price: '$350' },
  { title: 'Mountain Retreat', location: 'Aspen, Colorado', price: '$275' },
  { title: 'Urban Apartment', location: 'New York City', price: '$180' },
];

/**
 * Demonstrates usage of Airbnb-style animation components
 */
export const AnimationExample = (): ReactElement => {
  return (
    <Container>
      <Title>Airbnb-Style Animation Examples</Title>
      
      <Section>
        <SectionTitle>Reveal Section</SectionTitle>
        <RevealSection direction="up" distance={20}>
          <SectionContent>
            This content fades in and slides up when it enters the viewport,
            exactly like Airbnb's reveal effects on their homepage.
          </SectionContent>
        </RevealSection>
      </Section>
      
      <Section>
        <SectionTitle>Staggered Card Animations</SectionTitle>
        <CardsContainer>
          <StaggeredList
            staggerDelay="medium"
            initialDelay="short"
          >
            {cardData.map((card, index) => (
              <TransitionCard key={index} elevated hoverScale={1.03} animateEntry>
                <CardContent>
                  <CardTitle>{card.title}</CardTitle>
                  <CardLocation>{card.location}</CardLocation>
                  <CardPrice>{card.price} night</CardPrice>
                </CardContent>
              </TransitionCard>
            ))}
          </StaggeredList>
        </CardsContainer>
      </Section>
      
      <Section>
        <SectionTitle>Image Gallery with Hover Effects</SectionTitle>
        <RevealSection direction="up" distance={15}>
          <ImageGallery
            images={exampleImages}
            columns={3}
            gap={1}
            staggered
          />
        </RevealSection>
      </Section>
      
      <Section>
        <SectionTitle>Single Zoomable Image</SectionTitle>
        <RevealSection direction="up">
          <ZoomImageContainer>
            <ZoomableImage 
              src="https://a0.muscache.com/im/pictures/miso/Hosting-53733023/original/7fcce2f8-bd6a-4d4f-b96c-a0881b2412a2.jpeg"
              alt="Zoomable image example"
            />
          </ZoomImageContainer>
        </RevealSection>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const SectionContent = styled.div`
  background-color: #f7f7f7;
  padding: 2rem;
  border-radius: 12px;
  line-height: 1.6;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardLocation = styled.p`
  color: #717171;
  margin-bottom: 1rem;
`;

const CardPrice = styled.p`
  font-weight: 600;
`;

const ZoomImageContainer = styled.div`
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
`;
