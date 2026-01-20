"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiSave, FiX } from "react-icons/fi";
import { useAccordion } from "../context/AccordionContext";

const Container = styled(motion.div)`
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.15);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 8px;
`;

const Field = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-size: 0.95rem;
  flex: 1;
  transition: all 0.3s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-size: 0.95rem;
  flex: 1;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Textarea = styled.textarea`
  padding: 14px 16px;
  min-height: 160px;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-size: 0.95rem;
  font-family: inherit;
  line-height: 1.6;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled(motion.button)<{ variant?: "primary" | "secondary" }>`
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  ${({ variant }) =>
    variant === "secondary"
      ? `
    background: rgba(248, 250, 252, 0.9);
    color: #64748b;
    border: 1px solid rgba(59, 130, 246, 0.15);
    
    &:hover {
      background: rgba(241, 245, 249, 0.9);
      border-color: rgba(59, 130, 246, 0.25);
      color: #475569;
    }
  `
      : `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    
    &:hover {
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.98);
  }
`;

type AccordionFormProps = {
  accordionId?: number;
};

export default function AccordionForm({ accordionId }: AccordionFormProps) {
  const router = useRouter();
  const { data, addAccordion, updateAccordion, getAccordionById, addCategory } = useAccordion();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(data.categories[0]?.id ?? 0);
  const [categoryType, setCategoryType] = useState<"existing" | "new">("existing");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!accordionId;

  useEffect(() => {
    if (isEditMode && accordionId) {
      const accordion = getAccordionById(accordionId);
      if (accordion) {
        setTitle(accordion.title);
        setContent(accordion.content);
        setCategoryId(accordion.categoryId);
      }
    }
  }, [accordionId, isEditMode, getAccordionById]);

  function handleCancel() {
    router.push("/");
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    if (!content.trim()) {
      toast.error("O conteúdo é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCategoryId = categoryId;

      if (categoryType === "new") {
        if (!newCategoryName.trim()) {
          toast.error("Digite o nome da nova categoria");
          setIsSubmitting(false);
          return;
        }

        await addCategory({
          name: newCategoryName.trim(),
          description: "",
        });

        await new Promise((resolve) => setTimeout(resolve, 300));

        const response = await fetch("http://localhost:3001/categories");
        const categories = await response.json();
        const newCategory = categories.find((c: any) => c.name === newCategoryName.trim());
        
        if (newCategory) {
          finalCategoryId = newCategory.id;
        }
      }

      if (isEditMode && accordionId) {
        await updateAccordion(accordionId, {
          title: title.trim(),
          content: content.trim(),
          categoryId: finalCategoryId,
        });
        toast.success("Item atualizado com sucesso!");
      } else {
        await addAccordion({
          title: title.trim(),
          content: content.trim(),
          categoryId: finalCategoryId,
        });
        toast.success("Item criado com sucesso!");
      }

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Title>{isEditMode ? "Editar Item" : "Novo Item"}</Title>

      <Field
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="categoryType">Categoria *</Label>
        <Row>
          <Select
            id="categoryType"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value as "existing" | "new")}
            disabled={isSubmitting}
          >
            <option value="existing">Selecionar existente</option>
            <option value="new">Adicionar nova</option>
          </Select>

          {categoryType === "existing" && (
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              disabled={isSubmitting}
            >
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}

          {categoryType === "new" && (
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria"
              disabled={isSubmitting}
            />
          )}
        </Row>
      </Field>

      <Field
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título"
          disabled={isSubmitting}
        />
      </Field>

      <Field
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite o conteúdo"
          disabled={isSubmitting}
        />
      </Field>

      <ButtonGroup>
        {isEditMode && (
          <Button
            variant="secondary"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            <FiX size={18} /> Cancelar
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          <FiSave size={18} />
          {isSubmitting ? "Salvando..." : isEditMode ? "Atualizar Item" : "Salvar Item"}
        </Button>
      </ButtonGroup>
    </Container>
  );
}