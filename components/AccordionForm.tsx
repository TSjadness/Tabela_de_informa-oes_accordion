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

function generateRandomColor(): string {
  const colors = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
    "#06b6d4", "#f97316", "#6366f1", "#14b8a6", "#ef4444",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ✅ Converte qualquer coisa para number
function toNumber(id: any): number {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// ✅ Busca próximo ID de forma ULTRA ROBUSTA
async function getNextId(resource: string): Promise<number> {
  try {
    const response = await fetch(`http://localhost:3001/${resource}`);
    if (!response.ok) {
      console.log(`⚠️ Recurso ${resource} vazio, iniciando com ID 1`);
      return 1;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`⚠️ Array ${resource} vazio, iniciando com ID 1`);
      return 1;
    }

    // Converte TODOS os IDs para number
    const ids = data
      .map((item: any) => toNumber(item.id))
      .filter((id: number) => id > 0);
    
    if (ids.length === 0) {
      console.log(`⚠️ Nenhum ID válido em ${resource}, iniciando com ID 1`);
      return 1;
    }

    const nextId = Math.max(...ids) + 1;
    console.log(`✅ Próximo ID para ${resource}: ${nextId}`);
    return nextId;
  } catch (error) {
    console.error(`❌ Erro ao buscar próximo ID para ${resource}:`, error);
    return 1;
  }
}

export default function AccordionForm({ accordionId }: AccordionFormProps) {
  const router = useRouter();
  const { data, addAccordion, updateAccordion, getAccordionById, refreshData } = useAccordion();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(data.categories[0]?.id ?? 0);
  const [categoryType, setCategoryType] = useState<"existing" | "new">("existing");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [authorType, setAuthorType] = useState<"existing" | "new">("existing");
  const [authorId, setAuthorId] = useState<number>(data.authors[0]?.id ?? 0);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!accordionId;

  useEffect(() => {
    if (isEditMode && accordionId) {
      const result = getAccordionById(accordionId);
      if (result) {
        const { accordion, categoryId: catId } = result;
        setTitle(accordion.title);
        setContent(accordion.content);
        setCategoryId(catId);
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

      // ✅ CRIAR NOVA CATEGORIA
      if (categoryType === "new") {
        if (!newCategoryName.trim()) {
          toast.error("Digite o nome da nova categoria");
          setIsSubmitting(false);
          return;
        }

        const newCategoryId = await getNextId("categories");

        const newCat = {
          id: newCategoryId,
          name: newCategoryName.trim(),
          accordions: [],
        };

        console.log("📁 Criando categoria:", newCat);

        const response = await fetch("http://localhost:3001/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat),
        });

        if (!response.ok) {
          throw new Error("Erro ao criar categoria");
        }

        const created = await response.json();
        console.log("✅ Categoria criada:", created);

        finalCategoryId = toNumber(created.id);
        
        // ✅ FORÇA REFRESH para garantir que categoria existe
        await refreshData();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // ✅ CRIAR NOVO AUTOR
      if (authorType === "new") {
        if (!newAuthorName.trim()) {
          toast.error("Digite o nome do novo autor");
          setIsSubmitting(false);
          return;
        }

        const newAuthorId = await getNextId("authors");

        const newAuth = {
          id: newAuthorId,
          name: newAuthorName.trim(),
          color: generateRandomColor(),
        };

        console.log("👤 Criando autor:", newAuth);

        const response = await fetch("http://localhost:3001/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAuth),
        });

        if (!response.ok) {
          throw new Error("Erro ao criar autor");
        }

        const created = await response.json();
        console.log("✅ Autor criado:", created);

        finalAuthorId = toNumber(created.id);
        
        // ✅ FORÇA REFRESH para garantir que autor existe
        await refreshData();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // ✅ EDITAR ACCORDION
      if (isEditMode && accordionId) {
        console.log("✏️ Editando accordion:", accordionId);
        
        await updateAccordion(accordionId, finalCategoryId, {
          title: title.trim(),
          content: content.trim(),
          authorId: finalAuthorId,
        });
        
        toast.success("Item atualizado com sucesso!");
      } 
      // ✅ CRIAR NOVO ACCORDION
      else {
        console.log(`📝 Criando accordion na categoria ${finalCategoryId}`);
        
        // ✅ FORÇA REFRESH antes de buscar a categoria
        await refreshData();
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Busca a categoria atualizada DIRETO da API
        const catResponse = await fetch(`http://localhost:3001/categories/${finalCategoryId}`);
        
        if (!catResponse.ok) {
          throw new Error("Categoria não encontrada");
        }

        const category = await catResponse.json();

        // Gera ID único dentro da categoria
        let newAccordionId = 1;
        if (category.accordions && category.accordions.length > 0) {
          const existingIds = category.accordions
            .map((a: any) => toNumber(a.id))
            .filter((id: number) => id > 0);
          
          newAccordionId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        }

        console.log(`🆕 Novo accordion ID: ${newAccordionId}`);

        await addAccordion(finalCategoryId, {
          id: newAccordionId,
          title: title.trim(),
          content: content.trim(),
          authorId: finalAuthorId,
        });
        
        toast.success("Item criado com sucesso!");
      }

      // ✅ Força atualização e redireciona
      await refreshData();
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("❌ Erro ao salvar:", error);
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

      <Field initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
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
            <Select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} disabled={isSubmitting}>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
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

      <Field initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <Label htmlFor="title">Título *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Digite o título" disabled={isSubmitting} />
      </Field>

      <Field initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Digite o conteúdo" disabled={isSubmitting} />
      </Field>

      <Field initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <Label htmlFor="authorType">Autor *</Label>
        <Row>
          <Select
            id="authorType"
            value={authorType}
            onChange={(e) => setAuthorType(e.target.value as "existing" | "new")}
            disabled={isSubmitting}
          >
            <option value="existing">Selecionar existente</option>
            <option value="new">Adicionar novo</option>
          </Select>

          {authorType === "existing" && (
            <Select value={authorId} onChange={(e) => setAuthorId(Number(e.target.value))} disabled={isSubmitting}>
              {data.authors.map((author) => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </Select>
          )}

          {authorType === "new" && (
            <Input
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              placeholder="Nome do novo autor"
              disabled={isSubmitting}
            />
          )}
        </Row>
      </Field>

      <ButtonGroup>
        {isEditMode && (
          <Button variant="secondary" onClick={handleCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting}>
            <FiX size={18} /> Cancelar
          </Button>
        )}
        <Button onClick={handleSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting}>
          <FiSave size={18} />
          {isSubmitting ? "Salvando..." : isEditMode ? "Atualizar Item" : "Salvar Item"}
        </Button>
      </ButtonGroup>
    </Container>
  );
}

