"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { FiFolder, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AccordionItem from "./AccordionItem";
import Link from "next/link";
import { useAdmin } from "../hooks/useAdmin";
import { useState } from "react";
import ModalConfirm from "./ModalConfirm";
import { toast } from "react-toastify";
import { useAccordion } from "../context/AccordionContext";

type Accordion = {
  id: number;
  title: string;
  content: string;
  authorId: number;
};

type Category = {
  id: number;
  name: string;
  accordions: Accordion[];
};

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.25);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.1);
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const CategoryInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CategoryName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a8a;
  flex: 1;
`;

const EditableCategoryName = styled.input`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a8a;
  flex: 1;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const Badge = styled.span`
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 8px;
`;

const AdminButton = styled(motion.button)<{ variant?: "danger" }>`
  background: ${({ variant }) => variant === "danger" ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  border: 1px solid ${({ variant }) => variant === "danger" ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"};
  color: ${({ variant }) => (variant === "danger" ? "#dc2626" : "#2563eb")};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: ${({ variant }) => variant === "danger" ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(motion.button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(motion.button)`
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;

  &:hover {
    background: rgba(100, 116, 139, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: rgba(239, 246, 255, 0.5);
  border: 2px dashed rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #93c5fd;
`;

const EmptyText = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
`;

const AddButton = styled(Link)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ✅ Converte qualquer coisa para number
function toNumber(id: any): number {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export default function CategoryCard({ category }: { category: Category }) {
  const { isAdmin } = useAdmin();
  const { refreshData } = useAccordion();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasAccordions = category.accordions.length > 0;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(category.name);
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast.error("O nome da categoria não pode estar vazio");
      return;
    }

    setIsLoading(true);

    try {
      const categoryId = toNumber(category.id);

      const updatedCategory = {
        id: categoryId,
        name: editedName.trim(),
        accordions: category.accordions.map((acc) => ({
          id: toNumber(acc.id),
          title: acc.title,
          content: acc.content,
          authorId: toNumber(acc.authorId),
        })),
      };

      console.log("✏️ Atualizando categoria:", updatedCategory);

      const response = await fetch(`http://localhost:3001/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar categoria: ${response.status}`);
      }

      console.log("✅ Categoria atualizada");

      toast.success("Categoria atualizada com sucesso!");
      setIsEditing(false);

      await refreshData();
    } catch (error: any) {
      console.error("❌ Erro ao atualizar categoria:", error);
      toast.error(error.message || "Erro ao atualizar categoria");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(category.name);
  };

  const handleDelete = async () => {
    if (category.accordions.length > 0) {
      toast.error("Não é possível excluir uma categoria com itens. Remova os itens primeiro.");
      setShowDeleteModal(false);
      return;
    }

    setIsLoading(true);

    try {
      const categoryId = toNumber(category.id);

      console.log(`🗑️ Deletando categoria ${categoryId}`);

      // Verifica se existe
      const checkResponse = await fetch(`http://localhost:3001/categories/${categoryId}`);

      if (!checkResponse.ok) {
        throw new Error("Categoria não encontrada");
      }

      // Deleta
      const response = await fetch(`http://localhost:3001/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir categoria: ${response.status}`);
      }

      console.log("✅ Categoria deletada");

      toast.success("Categoria excluída com sucesso!");
      setShowDeleteModal(false);

      await refreshData();
    } catch (error: any) {
      console.error("❌ Erro ao excluir categoria:", error);
      toast.error(error.message || "Erro ao excluir categoria");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
        <Header>
          <IconWrapper>
            <FiFolder size={20} />
          </IconWrapper>

          <CategoryInfo>
            {isEditing ? (
              <>
                <EditableCategoryName
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                  disabled={isLoading}
                  autoFocus
                />
                <SaveButton onClick={handleSave} disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {isLoading ? "..." : "Salvar"}
                </SaveButton>
                <CancelButton onClick={handleCancel} disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Cancelar
                </CancelButton>
              </>
            ) : (
              <CategoryName>{category.name}</CategoryName>
            )}
          </CategoryInfo>

          <Badge>{category.accordions.length}</Badge>

          {isAdmin && !isEditing && (
            <AdminActions>
              <AdminButton onClick={handleEdit} disabled={isLoading} title="Editar categoria" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FiEdit2 size={16} />
              </AdminButton>
              <AdminButton variant="danger" onClick={() => setShowDeleteModal(true)} disabled={isLoading} title="Excluir categoria" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FiTrash2 size={16} />
              </AdminButton>
            </AdminActions>
          )}
        </Header>

        {hasAccordions ? (
          <AccordionList>
            {category.accordions.map((accordion) => (
              <AccordionItem key={accordion.id} accordion={accordion} />
            ))}
          </AccordionList>
        ) : (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyText>Nenhum item cadastrado nesta categoria ainda.</EmptyText>
            <AddButton href="/accordion">
              <FiPlus size={18} />
              Adicionar Item
            </AddButton>
          </EmptyState>
        )}
      </Card>

      <ModalConfirm
        open={showDeleteModal}
        title="Confirmar exclusão"
        description={`Deseja realmente excluir a categoria "${category.name}"?${
          category.accordions.length > 0 ? " Atenção: Esta categoria possui itens!" : ""
        }`}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
