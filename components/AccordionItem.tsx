"use client";

import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FiChevronDown, FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAccordion } from "../context/AccordionContext";
import ModalConfirm from "./ModalConfirm";

type Accordion = {
  id: number;
  categoryId: number;
  title: string;
  content: string;
  createdAt?: string;
};

const Wrapper = styled(motion.div)`
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.06);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const Header = styled.div<{ open: boolean }>`
  width: 100%;
  background: ${({ open }) =>
    open ? "rgba(239, 246, 255, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(239, 246, 255, 0.9);
  }
`;

const Title = styled.span`
  font-weight: 600;
  flex: 1;
  text-align: left;
  color: #1e3a8a;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const ChevronIcon = styled(motion(FiChevronDown))`
  color: #64748b;
`;

const ContentWrapper = styled(motion.div)`
  overflow: hidden;
`;

const Content = styled.div`
  padding: 20px;
  background: rgba(248, 250, 252, 0.8);
  white-space: pre-wrap;
  color: #334155;
  border-top: 1px solid rgba(59, 130, 246, 0.15);
  line-height: 1.7;
  font-size: 0.95rem;
`;

export default function AccordionItem({ accordion }: { accordion?: Accordion }) {
  const { removeAccordion } = useAccordion();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!accordion) return null;

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(accordion.content || "");
    toast.success("Conteúdo copiado");
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    router.push(`/accordion/edit/${accordion.id}`);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    removeAccordion(accordion.id);
    toast.success("Removido com sucesso!");
    setShowDeleteModal(false);
  }

  return (
    <>
      <Wrapper
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Header open={open} onClick={() => setOpen(!open)}>
          <Title>{accordion.title}</Title>

          <Actions onClick={(e) => e.stopPropagation()}>
            <IconButton
              onClick={handleCopy}
              title="Copiar conteúdo"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                borderColor: "rgba(59, 130, 246, 0.15)",
                color: "#2563eb",
              }}
            >
              <FiCopy size={16} />
            </IconButton>

            <IconButton
              onClick={handleEdit}
              title="Editar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                borderColor: "rgba(59, 130, 246, 0.15)",
                color: "#2563eb",
              }}
            >
              <FiEdit2 size={16} />
            </IconButton>

            <IconButton
              onClick={handleDeleteClick}
              title="Remover"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                borderColor: "rgba(244, 67, 54, 0.15)",
                color: "#b91c1c",
              }}
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Actions>

          <ChevronIcon
            size={20}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Header>

        <AnimatePresence initial={false}>
          {open && (
            <ContentWrapper
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Content>{accordion.content}</Content>
            </ContentWrapper>
          )}
        </AnimatePresence>
      </Wrapper>

      <ModalConfirm
        open={showDeleteModal}
        title="Confirmar exclusão"
        description={`Deseja realmente excluir o item "${accordion.title}"?`}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}