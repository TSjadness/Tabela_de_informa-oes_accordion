"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

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

type Author = {
  id: number;
  name: string;
  color: string;
};

type Data = {
  authors: Author[];
  categories: Category[];
};

type AccordionContextType = {
  data: Data;
  loading: boolean;
  refreshData: () => Promise<void>;
  filteredCategories: (query: string) => Category[];
  addAccordion: (categoryId: number, accordion: Accordion) => Promise<void>;
  removeAccordion: (accordionId: number) => Promise<void>;
  updateAccordion: (
    accordionId: number,
    categoryId: number,
    updates: Partial<Accordion>,
  ) => Promise<void>;
  addAuthor: (author: Author) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  getAccordionById: (
    accordionId: number,
  ) => { accordion: Accordion; categoryId: number } | null;
};

const Context = createContext<AccordionContextType | null>(null);

const API_URL = "http://localhost:3001";

// ✅ Função que SEMPRE converte ID para number (trata string e number)
function toNumber(id: any): number {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// ✅ Normaliza TODOS os dados garantindo IDs como number
function normalizeData(data: any[]): any[] {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    ...item,
    id: toNumber(item.id),
    authorId: item.authorId !== undefined ? toNumber(item.authorId) : undefined,
    accordions: Array.isArray(item.accordions)
      ? item.accordions.map((acc: any) => ({
          ...acc,
          id: toNumber(acc.id),
          authorId: toNumber(acc.authorId),
        }))
      : [],
  }));
}

export function AccordionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ authors: [], categories: [] });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [authorsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/authors`),
        fetch(`${API_URL}/categories`),
      ]);

      if (!authorsRes.ok || !categoriesRes.ok) {
        throw new Error("Erro ao carregar dados da API");
      }

      const authorsData = await authorsRes.json();
      const categoriesData = await categoriesRes.json();

      const authors = normalizeData(authorsData);
      const categories = normalizeData(categoriesData);

      console.log("✅ Dados carregados:", { authors, categories });

      setData({ authors, categories });
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      setData({ authors: [], categories: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const filteredCategories = useCallback((query: string): Category[] => {
    if (!query.trim()) return data.categories;

    return data.categories
      .map((category) => ({
        ...category,
        accordions: category.accordions.filter(
          (accordion) =>
            accordion.title.toLowerCase().includes(query.toLowerCase()) ||
            accordion.content.toLowerCase().includes(query.toLowerCase()),
        ),
      }))
      .filter(
        (category) =>
          category.name.toLowerCase().includes(query.toLowerCase()) ||
          category.accordions.length > 0,
      );
  }, [data.categories]);

  const addAccordion = useCallback(async (categoryId: number, accordion: Accordion) => {
    try {
      const numCategoryId = toNumber(categoryId);

      console.log(`📝 Adicionando accordion na categoria ${numCategoryId}:`, accordion);

      const response = await fetch(`${API_URL}/categories/${numCategoryId}`);

      if (!response.ok) {
        throw new Error(`Categoria ${numCategoryId} não encontrada`);
      }

      const category = await response.json();
      const normalizedCategory = normalizeData([category])[0];

      const normalizedAccordion = {
        id: toNumber(accordion.id),
        title: accordion.title,
        content: accordion.content,
        authorId: toNumber(accordion.authorId),
      };

      const updatedCategory = {
        id: numCategoryId,
        name: normalizedCategory.name,
        accordions: [...normalizedCategory.accordions, normalizedAccordion],
      };

      console.log("📤 Enviando categoria atualizada:", updatedCategory);

      const updateResponse = await fetch(`${API_URL}/categories/${numCategoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!updateResponse.ok) {
        throw new Error(`Erro ao adicionar accordion: ${updateResponse.status}`);
      }

      console.log("✅ Accordion adicionado com sucesso");

      await loadData();
    } catch (error) {
      console.error("❌ Erro ao adicionar accordion:", error);
      throw error;
    }
  }, [loadData]);

  const removeAccordion = useCallback(async (accordionId: number) => {
    try {
      const numAccordionId = toNumber(accordionId);

      console.log(`🗑️ Removendo accordion ${numAccordionId}`);

      const category = data.categories.find((c) =>
        c.accordions.some((a) => a.id === numAccordionId),
      );

      if (!category) {
        throw new Error(`Accordion ${numAccordionId} não encontrado`);
      }

      const updatedCategory = {
        id: category.id,
        name: category.name,
        accordions: category.accordions.filter((a) => a.id !== numAccordionId),
      };

      console.log("📤 Enviando categoria atualizada:", updatedCategory);

      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        throw new Error(`Erro ao remover accordion: ${response.status}`);
      }

      console.log("✅ Accordion removido com sucesso");

      await loadData();
    } catch (error) {
      console.error("❌ Erro ao remover accordion:", error);
      throw error;
    }
  }, [data.categories, loadData]);

  const updateAccordion = useCallback(async (
    accordionId: number,
    newCategoryId: number,
    updates: Partial<Accordion>,
  ) => {
    try {
      const numAccordionId = toNumber(accordionId);
      const numNewCategoryId = toNumber(newCategoryId);

      console.log(`✏️ Atualizando accordion ${numAccordionId} para categoria ${numNewCategoryId}`);

      const currentCategory = data.categories.find((c) =>
        c.accordions.some((a) => a.id === numAccordionId),
      );

      if (!currentCategory) {
        throw new Error(`Accordion ${numAccordionId} não encontrado`);
      }

      const accordion = currentCategory.accordions.find(
        (a) => a.id === numAccordionId,
      );

      if (!accordion) {
        throw new Error(`Accordion ${numAccordionId} não encontrado`);
      }

      const updatedAccordion = {
        ...accordion,
        ...updates,
        id: numAccordionId,
        authorId: toNumber(updates.authorId || accordion.authorId),
      };

      // Se mudou de categoria
      if (currentCategory.id !== numNewCategoryId) {
        const newCategory = data.categories.find((c) => c.id === numNewCategoryId);

        if (!newCategory) {
          throw new Error(`Categoria ${numNewCategoryId} não encontrada`);
        }

        const updatedCurrentCategory = {
          id: currentCategory.id,
          name: currentCategory.name,
          accordions: currentCategory.accordions.filter(
            (a) => a.id !== numAccordionId,
          ),
        };

        const updatedNewCategory = {
          id: newCategory.id,
          name: newCategory.name,
          accordions: [...newCategory.accordions, updatedAccordion],
        };

        console.log("📤 Movendo entre categorias:", {
          from: updatedCurrentCategory,
          to: updatedNewCategory,
        });

        const [res1, res2] = await Promise.all([
          fetch(`${API_URL}/categories/${currentCategory.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCurrentCategory),
          }),
          fetch(`${API_URL}/categories/${numNewCategoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedNewCategory),
          }),
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error("Erro ao atualizar categorias");
        }
      } else {
        // Mesma categoria
        const updatedCategory = {
          id: currentCategory.id,
          name: currentCategory.name,
          accordions: currentCategory.accordions.map((a) =>
            a.id === numAccordionId ? updatedAccordion : a,
          ),
        };

        console.log("📤 Atualizando na mesma categoria:", updatedCategory);

        const response = await fetch(`${API_URL}/categories/${currentCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCategory),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar accordion: ${response.status}`);
        }
      }

      console.log("✅ Accordion atualizado com sucesso");

      await loadData();
    } catch (error) {
      console.error("❌ Erro ao atualizar accordion:", error);
      throw error;
    }
  }, [data.categories, loadData]);

  const addAuthor = useCallback(async (author: Author) => {
    try {
      const normalizedAuthor = {
        id: toNumber(author.id),
        name: author.name,
        color: author.color,
      };

      console.log("👤 Adicionando autor:", normalizedAuthor);

      const response = await fetch(`${API_URL}/authors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedAuthor),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar autor: ${response.status}`);
      }

      console.log("✅ Autor adicionado com sucesso");

      await loadData();
    } catch (error) {
      console.error("❌ Erro ao adicionar autor:", error);
      throw error;
    }
  }, [loadData]);

  const addCategory = useCallback(async (category: Category) => {
    try {
      const normalizedCategory = {
        id: toNumber(category.id),
        name: category.name,
        accordions: [],
      };

      console.log("📁 Adicionando categoria:", normalizedCategory);

      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedCategory),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar categoria: ${response.status}`);
      }

      console.log("✅ Categoria adicionada com sucesso");

      await loadData();
    } catch (error) {
      console.error("❌ Erro ao adicionar categoria:", error);
      throw error;
    }
  }, [loadData]);

  const getAccordionById = useCallback((
    accordionId: number,
  ): { accordion: Accordion; categoryId: number } | null => {
    const numAccordionId = toNumber(accordionId);

    for (const category of data.categories) {
      const accordion = category.accordions.find((a) => a.id === numAccordionId);
      if (accordion) {
        return { accordion, categoryId: category.id };
      }
    }
    return null;
  }, [data.categories]);

  return (
    <Context.Provider
      value={{
        data,
        loading,
        refreshData,
        filteredCategories,
        addAccordion,
        removeAccordion,
        updateAccordion,
        addAuthor,
        addCategory,
        getAccordionById,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useAccordion = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAccordion must be used within AccordionProvider");
  }
  return context;
};

