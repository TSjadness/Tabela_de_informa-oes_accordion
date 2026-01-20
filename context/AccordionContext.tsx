"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";

type Accordion = {
  id: number;
  categoryId: number;
  authorId: number;
  title: string;
  content: string;
  createdAt?: string;
};

type Category = {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
};

type Author = {
  id: number;
  name: string;
  color: string;
  createdAt?: string;
};

type CategoryWithAccordions = Category & {
  accordions: Accordion[];
};

type Data = {
  categories: CategoryWithAccordions[];
  authors: Author[];
};

type AccordionContextType = {
  data: Data;
  loading: boolean;
  refreshData: () => Promise<void>;
  filteredCategories: (query: string) => CategoryWithAccordions[];
  addAccordion: (accordion: Omit<Accordion, "id" | "createdAt">) => Promise<void>;
  removeAccordion: (accordionId: number) => Promise<void>;
  updateAccordion: (accordionId: number, updates: Partial<Omit<Accordion, "id" | "createdAt">>) => Promise<void>;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  removeCategory: (categoryId: number) => Promise<void>;
  updateCategory: (categoryId: number, updates: Partial<Omit<Category, "id" | "createdAt">>) => Promise<void>;
  addAuthor: (author: Omit<Author, "id" | "createdAt">) => Promise<void>;
  getAccordionById: (accordionId: number) => Accordion | null;
};

const Context = createContext<AccordionContextType | null>(null);

const API_URL = "http://localhost:3001";

function toNumber(id: any): number {
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

async function cleanInvalidAccordions(accordions: Accordion[], categoryIds: number[], authorIds: number[]): Promise<void> {
  const invalidAccordions = accordions.filter(
    (acc) => !categoryIds.includes(acc.categoryId) || !authorIds.includes(acc.authorId) || acc.categoryId === 0 || acc.authorId === 0
  );

  if (invalidAccordions.length > 0) {
    console.warn(`🧹 Limpando ${invalidAccordions.length} accordions inválidos...`);
    
    await Promise.all(
      invalidAccordions.map(async (acc) => {
        try {
          await fetch(`${API_URL}/accordions/${acc.id}`, { method: "DELETE" });
        } catch (error) {
          console.error(`Erro ao deletar accordion inválido ${acc.id}:`, error);
        }
      })
    );
  }
}

export function AccordionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ categories: [], authors: [] });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [categoriesRes, accordionsRes, authorsRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/accordions`),
        fetch(`${API_URL}/authors`),
      ]);

      if (!categoriesRes.ok || !accordionsRes.ok || !authorsRes.ok) {
        throw new Error("Erro ao carregar dados da API");
      }

      const categoriesData: Category[] = await categoriesRes.json();
      const accordionsData: Accordion[] = await accordionsRes.json();
      const authorsData: Author[] = await authorsRes.json();

      const categoryIds = categoriesData.map((c) => toNumber(c.id));
      const authorIds = authorsData.map((a) => toNumber(a.id));

      await cleanInvalidAccordions(accordionsData, categoryIds, authorIds);

      const validAccordions = accordionsData.filter(
        (acc) => categoryIds.includes(toNumber(acc.categoryId)) && 
                 authorIds.includes(toNumber(acc.authorId)) &&
                 acc.categoryId !== 0 && 
                 acc.authorId !== 0
      );

      const categoriesWithAccordions: CategoryWithAccordions[] = categoriesData.map((category) => ({
        ...category,
        id: toNumber(category.id),
        accordions: validAccordions
          .filter((acc) => toNumber(acc.categoryId) === toNumber(category.id))
          .map((acc) => ({
            ...acc,
            id: toNumber(acc.id),
            categoryId: toNumber(acc.categoryId),
            authorId: toNumber(acc.authorId),
          })),
      }));

      const authors: Author[] = authorsData.map((author) => ({
        ...author,
        id: toNumber(author.id),
      }));

      setData({ categories: categoriesWithAccordions, authors });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados. Verifique se o servidor está rodando.");
      setData({ categories: [], authors: [] });
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

  const filteredCategories = useCallback(
    (query: string): CategoryWithAccordions[] => {
      if (!query.trim()) return data.categories;

      return data.categories
        .map((category) => ({
          ...category,
          accordions: category.accordions.filter(
            (accordion) =>
              accordion.title.toLowerCase().includes(query.toLowerCase()) ||
              accordion.content.toLowerCase().includes(query.toLowerCase())
          ),
        }))
        .filter(
          (category) =>
            category.name.toLowerCase().includes(query.toLowerCase()) ||
            category.accordions.length > 0
        );
    },
    [data.categories]
  );

  const addAccordion = useCallback(
    async (accordion: Omit<Accordion, "id" | "createdAt">) => {
      try {
        if (!accordion.categoryId || !accordion.authorId) {
          throw new Error("Categoria e autor são obrigatórios");
        }

        const newAccordion = {
          ...accordion,
          categoryId: toNumber(accordion.categoryId),
          authorId: toNumber(accordion.authorId),
          createdAt: new Date().toISOString(),
        };

        const response = await fetch(`${API_URL}/accordions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAccordion),
        });

        if (!response.ok) {
          throw new Error(`Erro ao adicionar item: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao adicionar accordion:", error);
        throw error;
      }
    },
    [loadData]
  );

  const removeAccordion = useCallback(
    async (accordionId: number) => {
      try {
        const numAccordionId = toNumber(accordionId);

        const response = await fetch(`${API_URL}/accordions/${numAccordionId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Erro ao remover item: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao remover accordion:", error);
        throw error;
      }
    },
    [loadData]
  );

  const updateAccordion = useCallback(
    async (accordionId: number, updates: Partial<Omit<Accordion, "id" | "createdAt">>) => {
      try {
        const numAccordionId = toNumber(accordionId);

        const currentAccordion = data.categories
          .flatMap((c) => c.accordions)
          .find((a) => a.id === numAccordionId);

        if (!currentAccordion) {
          throw new Error(`Item não encontrado`);
        }

        const updatedAccordion = {
          ...currentAccordion,
          ...updates,
          categoryId: updates.categoryId !== undefined ? toNumber(updates.categoryId) : currentAccordion.categoryId,
          authorId: updates.authorId !== undefined ? toNumber(updates.authorId) : currentAccordion.authorId,
          id: numAccordionId,
        };

        const response = await fetch(`${API_URL}/accordions/${numAccordionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccordion),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar item: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao atualizar accordion:", error);
        throw error;
      }
    },
    [data.categories, loadData]
  );

  const addCategory = useCallback(
    async (category: Omit<Category, "id" | "createdAt">) => {
      try {
        const exists = data.categories.some(
          (c) => c.name.toLowerCase() === category.name.toLowerCase()
        );

        if (exists) {
          throw new Error("Já existe uma categoria com este nome");
        }

        const newCategory = {
          ...category,
          createdAt: new Date().toISOString(),
        };

        const response = await fetch(`${API_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
          throw new Error(`Erro ao adicionar categoria: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
        throw error;
      }
    },
    [data.categories, loadData]
  );

  const removeCategory = useCallback(
    async (categoryId: number) => {
      try {
        const numCategoryId = toNumber(categoryId);

        const category = data.categories.find((c) => c.id === numCategoryId);
        
        if (category && category.accordions.length > 0) {
          const deletePromises = category.accordions.map((accordion) =>
            fetch(`${API_URL}/accordions/${accordion.id}`, { method: "DELETE" })
          );
          
          await Promise.all(deletePromises);
        }

        const response = await fetch(`${API_URL}/categories/${numCategoryId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Erro ao remover categoria: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao remover categoria:", error);
        throw error;
      }
    },
    [data.categories, loadData]
  );

  const updateCategory = useCallback(
    async (categoryId: number, updates: Partial<Omit<Category, "id" | "createdAt">>) => {
      try {
        const numCategoryId = toNumber(categoryId);

        const currentCategory = data.categories.find((c) => c.id === numCategoryId);

        if (!currentCategory) {
          throw new Error(`Categoria não encontrada`);
        }

        if (updates.name) {
          const exists = data.categories.some(
            (c) => c.id !== numCategoryId && c.name.toLowerCase() === updates.name!.toLowerCase()
          );

          if (exists) {
            throw new Error("Já existe uma categoria com este nome");
          }
        }

        const updatedCategory = {
          id: numCategoryId,
          name: updates.name !== undefined ? updates.name : currentCategory.name,
          description: updates.description !== undefined ? updates.description : currentCategory.description,
          createdAt: currentCategory.createdAt,
        };

        const response = await fetch(`${API_URL}/categories/${numCategoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCategory),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar categoria: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        throw error;
      }
    },
    [data.categories, loadData]
  );

  const addAuthor = useCallback(
    async (author: Omit<Author, "id" | "createdAt">) => {
      try {
        const exists = data.authors.some(
          (a) => a.name.toLowerCase() === author.name.toLowerCase()
        );

        if (exists) {
          throw new Error("Já existe um autor com este nome");
        }

        const newAuthor = {
          ...author,
          createdAt: new Date().toISOString(),
        };

        const response = await fetch(`${API_URL}/authors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAuthor),
        });

        if (!response.ok) {
          throw new Error(`Erro ao adicionar autor: ${response.status}`);
        }

        await loadData();
      } catch (error) {
        console.error("Erro ao adicionar autor:", error);
        throw error;
      }
    },
    [data.authors, loadData]
  );

  const getAccordionById = useCallback(
    (accordionId: number): Accordion | null => {
      const numAccordionId = toNumber(accordionId);

      for (const category of data.categories) {
        const accordion = category.accordions.find((a) => a.id === numAccordionId);
        if (accordion) {
          return accordion;
        }
      }
      return null;
    },
    [data.categories]
  );

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
        addCategory,
        removeCategory,
        updateCategory,
        addAuthor,
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