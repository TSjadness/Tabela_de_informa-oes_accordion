"use client";

import { useState, useMemo } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
  FiZap,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import { useAccordion } from "../context/AccordionContext";
import SearchInput from "../components/SearchInput";
import CategoryCard from "../components/CategoryCard";
import { useAdmin } from "../hooks/useAdmin";

const Container = styled.main`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
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
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: ${({ color }) => color};
  filter: blur(120px);
  opacity: 0.3;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  position: relative;
  z-index: 1;
`;

const Header = styled(motion.header)`
  margin-bottom: 48px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IconBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2563eb;
  width: fit-content;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #1e40af;
  max-width: 600px;
  line-height: 1.6;
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CTAButton = styled(motion(Link))`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.15);
  padding: 4px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
`;

const ViewButton = styled(motion.button)<{ $active: boolean }>`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#64748b")};

  &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
        : "rgba(59, 130, 246, 0.1)"};
    color: ${({ $active }) => ($active ? "#ffffff" : "#2563eb")};
  }
`;

const SearchSection = styled(motion.div)`
  margin-bottom: 32px;
`;

const StatsBar = styled(motion.div)`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.15);
  padding: 20px 28px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const CategoryGrid = styled(motion.div)<{ view: "grid" | "list" }>`
  display: grid;
  grid-template-columns: ${({ view }) =>
    view === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr"};
  gap: 24px;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 100px 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 2px dashed rgba(59, 130, 246, 0.2);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  color: #93c5fd;
`;

const EmptyTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: #1e3a8a;
  font-weight: 700;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
`;

const AdminButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #2563eb;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(59, 130, 246, 0.4);
  }
`;

export default function Home() {
  const router = useRouter();
  const { filteredCategories, data, loading } = useAccordion();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const { isAdmin, logout } = useAdmin();

  const categories = useMemo(
    () => filteredCategories(search),
    [search, filteredCategories]
  );

  const totalAccordions = useMemo(
    () => data.categories.reduce((acc, cat) => acc + cat.accordions.length, 0),
    [data.categories]
  );

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingState>Carregando dados...</LoadingState>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <BackgroundEffects>
        <Orb
          top="10%"
          left="20%"
          color="rgba(147, 197, 253, 0.4)"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Orb
          top="60%"
          left="70%"
          color="rgba(96, 165, 250, 0.4)"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Orb
          top="30%"
          left="80%"
          color="rgba(59, 130, 246, 0.3)"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </BackgroundEffects>

      <ContentWrapper>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TopBar>
            <TitleSection>
              <IconBadge
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FiZap size={16} />
                Seja Bem-vindo
              </IconBadge>
              <Title
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Anotações
              </Title>
              <Subtitle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Gerencie e organize seus conteúdos de forma inteligente e
                eficiente
              </Subtitle>
            </TitleSection>

            <Actions>
              <ViewToggle>
                <ViewButton
                  $active={view === "grid"}
                  onClick={() => setView("grid")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiGrid size={18} />
                  Grid
                </ViewButton>
                <ViewButton
                  $active={view === "list"}
                  onClick={() => setView("list")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiList size={18} />
                  Lista
                </ViewButton>
              </ViewToggle>

              {isAdmin ? (
                <AdminButton
                  onClick={logout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut size={18} />
                  Sair Admin
                </AdminButton>
              ) : (
                <AdminButton
                  onClick={() => router.push("/admin/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiShield size={18} />
                  Admin
                </AdminButton>
              )}

              <CTAButton
                href="/accordion"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus size={20} />
                Novo Cadastro
              </CTAButton>
            </Actions>
          </TopBar>

          <StatsBar
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StatCard
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <StatValue>{data.categories.length}</StatValue>
              <StatLabel>Categorias</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <StatValue>{totalAccordions}</StatValue>
              <StatLabel>Total de itens</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <StatValue>{data.authors.length}</StatValue>
              <StatLabel>Autores</StatLabel>
            </StatCard>
          </StatsBar>
        </Header>

        <SearchSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <SearchInput value={search} onChange={setSearch} />
        </SearchSection>

        <AnimatePresence mode="wait">
          {categories.length > 0 ? (
            <CategoryGrid
              view={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </CategoryGrid>
          ) : (
            <EmptyState
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <EmptyIcon>
                <FiSearch />
              </EmptyIcon>
              <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>
              <EmptyText>
                Tente ajustar sua busca ou adicione novos itens para começar
              </EmptyText>
            </EmptyState>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </Container>
  );
}