'use client';

import AccordionForm from '../../components/AccordionForm';
import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const Container = styled.main`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
  padding: 48px 24px 80px;
  position: relative;
  overflow: hidden;
`;

const BackgroundEffects = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Orb = styled(motion.div)<{ top: string; left: string; color: string }>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: ${({ color }) => color};
  filter: blur(120px);
  opacity: 0.3;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled(motion.header)`
  margin-bottom: 40px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 16px;
  transition: all 0.3s;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.15);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    color: #1d4ed8;
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.05rem;
`;

export default function Page() {
  return (
    <Container>
      <BackgroundEffects>
        <Orb
          top="15%"
          left="10%"
          color="rgba(147, 197, 253, 0.4)"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <Orb
          top="60%"
          left="75%"
          color="rgba(96, 165, 250, 0.4)"
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </BackgroundEffects>

      <ContentWrapper>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackLink href="/">
            <FiArrowLeft size={18} />
            Voltar para início
          </BackLink>
          <Title>Cadastrar Item</Title>
          <Subtitle>Preencha os campos abaixo para criar um novo item</Subtitle>
        </Header>
        <AccordionForm />
      </ContentWrapper>
    </Container>
  );
}
