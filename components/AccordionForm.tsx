"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiSave, FiX, FiAlertCircle } from "react-icons/fi";
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const AlertBox = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #dc2626;
`;

const AlertIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

const AlertText = styled.div`
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.5;
`;

type AccordionFormProps = {
  accordionId?: number;
};

function generateRandomColor(): string {
  const colors = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
    "#06b6d4", "#f97316", "#6366f1", "#14b8a6", "#ef4444",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function AccordionForm({ accordionId }: AccordionFormProps) {
  const router = useRouter();
  const { data, addAccordion, updateAccordion, getAccordionById, addCategory, addAuthor, refreshData } = useAccordion();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryType, setCategoryType] = useState<"existing" | "new">("existing");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [authorId, setAuthorId] = useState<number>(0);
  const [authorType, setAuthorType] = useState<"existing" | "new">("existing");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!accordionId;

  useEffect(() => {
    if (data.categories.length > 0 && categoryId === 0 && !isEditMode) {
      setCategoryId(data.categories[0].id);
    }
    if (data.authors.length > 0 && authorId === 0 && !isEditMode) {
      setAuthorId(data.authors[0].id);
    }
  }, [data.categories, data.authors, categoryId, authorId, isEditMode]);

  useEffect(() => {
    if (isEditMode && accordionId) {
      const accordion = getAccordionById(accordionId);
      if (accordion) {
        setTitle(accordion.title);
        setContent(accordion.content);
        setCategoryId(accordion.categoryId);
        setAuthorId(accordion.authorId);
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
      let finalAuthorId = authorId;

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

        await refreshData();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await fetch("http://localhost:3001/categories");
        const categories = await response.json();
        const newCategory = categories.find(
          (c: any) => c.name.toLowerCase() === newCategoryName.trim().toLowerCase()
        );
        
        if (newCategory) {
          finalCategoryId = newCategory.id;
        } else {
          throw new Error("Erro ao criar categoria");
        }
      } else {
        if (finalCategoryId === 0 || !finalCategoryId) {
          toast.error("Selecione uma categoria válida");
          setIsSubmitting(false);
          return;
        }
      }

      if (authorType === "new") {
        if (!newAuthorName.trim()) {
          toast.error("Digite o nome do novo autor");
          setIsSubmitting(false);
          return;
        }

        await addAuthor({
          name: newAuthorName.trim(),
          color: generateRandomColor(),
        });

        await refreshData();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await fetch("http://localhost:3001/authors");
        const authors = await response.json();
        const newAuthor = authors.find(
          (a: any) => a.name.toLowerCase() === newAuthorName.trim().toLowerCase()
        );
        
        if (newAuthor) {
          finalAuthorId = newAuthor.id;
        } else {
          throw new Error("Erro ao criar autor");
        }
      } else {
        if (finalAuthorId === 0 || !finalAuthorId) {
          toast.error("Selecione um autor válido");
          setIsSubmitting(false);
          return;
        }
      }

      if (isEditMode && accordionId) {
        await updateAccordion(accordionId, {
          title: title.trim(),
          content: content.trim(),
          categoryId: finalCategoryId,
          authorId: finalAuthorId,
        });
        toast.success("Item atualizado com sucesso!");
      } else {
        await addAccordion({
          title: title.trim(),
          content: content.trim(),
          categoryId: finalCategoryId,
          authorId: finalAuthorId,
        });
        toast.success("Item criado com sucesso!");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasCategories = data.categories.length > 0 || categoryType === "new";
  const hasAuthors = data.authors.length > 0 || authorType === "new";

  if (!hasCategories || !hasAuthors) {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title>⚠️ Configuração Necessária</Title>
        
        {!hasCategories && (
          <AlertBox>
            <AlertIcon>
              <FiAlertCircle size={20} />
            </AlertIcon>
            <AlertText>
              Você precisa criar pelo menos uma categoria para adicionar itens.
              Selecione "Adicionar nova" no campo de categoria.
            </AlertText>
          </AlertBox>
        )}

        {!hasAuthors && (
          <AlertBox>
            <AlertIcon>
              <FiAlertCircle size={20} />
            </AlertIcon>
            <AlertText>
              Você precisa criar pelo menos um autor para adicionar itens.
              Selecione "Adicionar novo" no campo de autor.
            </AlertText>
          </AlertBox>
        )}

        <Button variant="secondary" onClick={() => router.push("/")}>
          Voltar para início
        </Button>
      </Container>
    );
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
            onChange={(e) => {
              setCategoryType(e.target.value as "existing" | "new");
              if (e.target.value === "new") {
                setNewCategoryName("");
              }
            }}
            disabled={isSubmitting}
          >
            <option value="existing">Selecionar existente</option>
            <option value="new">Adicionar nova</option>
          </Select>

          {categoryType === "existing" && (
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              disabled={isSubmitting || data.categories.length === 0}
            >
              {data.categories.length === 0 ? (
                <option value={0}>Nenhuma categoria disponível</option>
              ) : (
                data.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </Select>
          )}

          {categoryType === "new" && (
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria"
              disabled={isSubmitting}
              autoFocus
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

      <Field
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label htmlFor="authorType">Autor *</Label>
        <Row>
          <Select
            id="authorType"
            value={authorType}
            onChange={(e) => {
              setAuthorType(e.target.value as "existing" | "new");
              if (e.target.value === "new") {
                setNewAuthorName("");
              }
            }}
            disabled={isSubmitting}
          >
            <option value="existing">Selecionar existente</option>
            <option value="new">Adicionar novo</option>
          </Select>

          {authorType === "existing" && (
            <Select
              value={authorId}
              onChange={(e) => setAuthorId(Number(e.target.value))}
              disabled={isSubmitting || data.authors.length === 0}
            >
              {data.authors.length === 0 ? (
                <option value={0}>Nenhum autor disponível</option>
              ) : (
                data.authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))
              )}
            </Select>
          )}

          {authorType === "new" && (
            <Input
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              placeholder="Nome do novo autor"
              disabled={isSubmitting}
              autoFocus={categoryType === "existing"}
            />
          )}
        </Row>
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