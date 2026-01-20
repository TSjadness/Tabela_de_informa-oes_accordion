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
  categoryId: number;
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

type CategoryWithAccordions = Category & {
  accordions: Accordion[];
};

type Data = {
  categories: CategoryWithAccordions[];
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

export function AccordionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ categories: [] });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [categoriesRes, accordionsRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/accordions`),
      ]);

      if (!categoriesRes.ok || !accordionsRes.ok) {
        throw new Error("Erro ao carregar dados da API");
      }

      const categoriesData: Category[] = await categoriesRes.json();
      const accordionsData: Accordion[] = await accordionsRes.json();

      const categoriesWithAccordions: CategoryWithAccordions[] = categoriesData.map((category) => ({
        ...category,
        id: toNumber(category.id),
        accordions: accordionsData
          .filter((acc) => toNumber(acc.categoryId) === toNumber(category.id))
          .map((acc) => ({
            ...acc,
            id: toNumber(acc.id),
            categoryId: toNumber(acc.categoryId),
          })),
      }));

      setData({ categories: categoriesWithAccordions });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setData({ categories: [] });
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
        const newAccordion = {
          ...accordion,
          categoryId: toNumber(accordion.categoryId),
          createdAt: new Date().toISOString(),
        };

        const response = await fetch(`${API_URL}/accordions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAccordion),
        });

        if (!response.ok) {
          throw new Error(`Erro ao adicionar accordion: ${response.status}`);
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
          throw new Error(`Erro ao remover accordion: ${response.status}`);
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
          throw new Error(`Accordion ${numAccordionId} não encontrado`);
        }

        const updatedAccordion = {
          ...currentAccordion,
          ...updates,
          categoryId: updates.categoryId !== undefined ? toNumber(updates.categoryId) : currentAccordion.categoryId,
          id: numAccordionId,
        };

        const response = await fetch(`${API_URL}/accordions/${numAccordionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccordion),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar accordion: ${response.status}`);
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
    [loadData]
  );

  const removeCategory = useCallback(
    async (categoryId: number) => {
      try {
        const numCategoryId = toNumber(categoryId);

        const category = data.categories.find((c) => c.id === numCategoryId);
        if (category && category.accordions.length > 0) {
          throw new Error("Não é possível excluir uma categoria com itens");
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
          throw new Error(`Categoria ${numCategoryId} não encontrada`);
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