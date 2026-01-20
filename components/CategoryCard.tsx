// "use client";

// import styled from "styled-components";
// import { motion } from "framer-motion";
// import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiCopy } from "react-icons/fi";
// import AccordionItem from "./AccordionItem";
// import Link from "next/link";
// import { useAdmin } from "../hooks/useAdmin";
// import { useState } from "react";
// import ModalConfirm from "./ModalConfirm";
// import { toast } from "react-toastify";
// import { useAccordion } from "../context/AccordionContext";

// type Accordion = {
//   id: number;
//   categoryId: number;
//   authorId: number;
//   title: string;
//   content: string;
//   createdAt?: string;
// };

// type Category = {
//   id: number;
//   name: string;
//   description?: string;
//   createdAt?: string;
//   accordions: Accordion[];
// };

// const Card = styled(motion.div)`
//   background: rgba(255, 255, 255, 0.8);
//   border: 1px solid rgba(59, 130, 246, 0.15);
//   border-radius: 16px;
//   padding: 24px;
//   backdrop-filter: blur(20px);
//   box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   transition: all 0.3s;

//   &:hover {
//     box-shadow: 0 6px 16px rgba(59, 130, 246, 0.12);
//     border-color: rgba(59, 130, 246, 0.25);
//   }
// `;

// const Header = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   padding-bottom: 16px;
//   border-bottom: 2px solid rgba(59, 130, 246, 0.1);
// `;

// const IconWrapper = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 10px;
//   background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
//   flex-shrink: 0;
// `;

// const CategoryInfo = styled.div`
//   flex: 1;
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   min-width: 0;
// `;

// const CategoryName = styled.h3`
//   font-size: 1.3rem;
//   font-weight: 700;
//   color: #1e3a8a;
//   flex: 1;
//   min-width: 0;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// `;

// const EditWrapper = styled.div`
//   flex: 1;
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   background: rgba(239, 246, 255, 0.8);
//   border: 2px solid #3b82f6;
//   border-radius: 12px;
//   padding: 8px 12px;
// `;

// const EditInput = styled.input`
//   flex: 1;
//   font-size: 1.3rem;
//   font-weight: 700;
//   color: #1e3a8a;
//   border: none;
//   background: transparent;
//   outline: none;
//   min-width: 0;

//   &::placeholder {
//     color: #94a3b8;
//   }
// `;

// const Badge = styled.span`
//   background: rgba(59, 130, 246, 0.1);
//   color: #2563eb;
//   padding: 4px 12px;
//   border-radius: 100px;
//   font-size: 0.85rem;
//   font-weight: 600;
//   flex-shrink: 0;
// `;

// const Actions = styled.div`
//   display: flex;
//   gap: 8px;
//   align-items: center;
//   flex-shrink: 0;
// `;

// const ActionButton = styled(motion.button)<{
//   variant?: "edit" | "delete" | "save" | "cancel";
// }>`
//   background: ${({ variant }) => {
//     if (variant === "save")
//       return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
//     if (variant === "cancel") return "rgba(100, 116, 139, 0.1)";
//     if (variant === "delete") return "rgba(239, 68, 68, 0.1)";
//     return "rgba(59, 130, 246, 0.1)";
//   }};
//   border: 1px solid
//     ${({ variant }) => {
//       if (variant === "save") return "transparent";
//       if (variant === "cancel") return "rgba(100, 116, 139, 0.3)";
//       if (variant === "delete") return "rgba(239, 68, 68, 0.3)";
//       return "rgba(59, 130, 246, 0.3)";
//     }};
//   color: ${({ variant }) => {
//     if (variant === "save") return "#ffffff";
//     if (variant === "cancel") return "#64748b";
//     if (variant === "delete") return "#dc2626";
//     return "#2563eb";
//   }};
//   padding: ${({ variant }) =>
//     variant === "save" || variant === "cancel" ? "8px 16px" : "8px"};
//   border-radius: 8px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 6px;
//   font-weight: 600;
//   font-size: 0.9rem;
//   transition: all 0.3s;
//   white-space: nowrap;

//   &:hover {
//     background: ${({ variant }) => {
//       if (variant === "save")
//         return "linear-gradient(135deg, #059669 0%, #047857 100%)";
//       if (variant === "cancel") return "rgba(100, 116, 139, 0.2)";
//       if (variant === "delete") return "rgba(239, 68, 68, 0.2)";
//       return "rgba(59, 130, 246, 0.2)";
//     }};
//     transform: translateY(-1px);
//   }

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//     transform: none;
//   }

//   &:active {
//     transform: scale(0.98);
//   }
// `;

// const AccordionList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const EmptyState = styled.div`
//   text-align: center;
//   padding: 40px 20px;
//   background: rgba(239, 246, 255, 0.5);
//   border: 2px dashed rgba(59, 130, 246, 0.2);
//   border-radius: 12px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 16px;
// `;

// const EmptyIcon = styled.div`
//   font-size: 3rem;
//   color: #93c5fd;
// `;

// const EmptyText = styled.p`
//   color: #64748b;
//   font-size: 0.95rem;
//   margin: 0;
// `;

// const AddButton = styled(Link)`
//   background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//   color: #fff;
//   padding: 12px 24px;
//   border-radius: 10px;
//   font-weight: 600;
//   font-size: 0.9rem;
//   display: inline-flex;
//   align-items: center;
//   gap: 8px;
//   transition: all 0.3s;
//   box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
//   }

//   &:active {
//     transform: translateY(0);
//   }
// `;

// export default function CategoryCard({ category }: { category: Category }) {
//   const { isAdmin } = useAdmin();
//   const { removeCategory, updateCategory } = useAccordion();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedName, setEditedName] = useState(category.name);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const hasAccordions = category.accordions.length > 0;

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedName(category.name);
//   };

//   const handleSave = async () => {
//     if (!editedName.trim()) {
//       toast.error("O nome da categoria não pode estar vazio");
//       return;
//     }

//     if (editedName.trim() === category.name) {
//       setIsEditing(false);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await updateCategory(category.id, { name: editedName.trim() });
//       toast.success("Categoria atualizada com sucesso!");
//       setIsEditing(false);
//     } catch (error: any) {
//       console.error("Erro ao atualizar categoria:", error);
//       toast.error(error.message || "Erro ao atualizar categoria");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedName(category.name);
//   };

//   const handleDelete = async () => {
//     setIsLoading(true);

//     try {
//       await removeCategory(category.id);
//       toast.success(
//         hasAccordions
//           ? `Categoria "${category.name}" e todos os ${category.accordions.length} itens excluídos com sucesso!`
//           : "Categoria excluída com sucesso!",
//       );
//       setShowDeleteModal(false);
//     } catch (error: any) {
//       console.error("Erro ao excluir categoria:", error);
//       toast.error(error.message || "Erro ao excluir categoria");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Card
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         whileHover={{ y: -4 }}
//         transition={{ type: "spring", stiffness: 300 }}
//       >
//         <Header>
//           <IconWrapper>
//             <FiFolder size={20} />
//           </IconWrapper>

//           {isEditing ? (
//             <EditWrapper>
//               <EditInput
//                 type="text"
//                 value={editedName}
//                 onChange={(e) => setEditedName(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSave();
//                   if (e.key === "Escape") handleCancel();
//                 }}
//                 disabled={isLoading}
//                 autoFocus
//                 placeholder="Nome da categoria"
//               />
//             </EditWrapper>
//           ) : (
//             <CategoryInfo>
//               <CategoryName>{category.name}</CategoryName>
//             </CategoryInfo>
//           )}

//           <Badge>{category.accordions.length}</Badge>
//         </Header>

//         <div>
//           {isAdmin && (
//             <Actions>
//               {isEditing ? (
//                 <>
//                   <ActionButton
//                     variant="save"
//                     onClick={handleSave}
//                     disabled={isLoading}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Salvar
//                   </ActionButton>
//                   <ActionButton
//                     variant="cancel"
//                     onClick={handleCancel}
//                     disabled={isLoading}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Cancelar
//                   </ActionButton>
//                 </>
//               ) : (
//                 <>
//                   <ActionButton
//                     variant="edit"
//                     onClick={handleEdit}
//                     disabled={isLoading}
//                     title="Editar categoria"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <FiEdit2 size={16} />
//                   </ActionButton>
//                   <ActionButton
//                     variant="delete"
//                     onClick={() => setShowDeleteModal(true)}
//                     disabled={isLoading}
//                     title="Excluir categoria"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <FiTrash2 size={16} />
//                   </ActionButton>
//                 </>
//               )}
//             </Actions>
//           )}
//         </div>

//         {hasAccordions ? (
//           <AccordionList>
//             {category.accordions.map((accordion) => (
//               <AccordionItem key={accordion.id} accordion={accordion} />
//             ))}
//           </AccordionList>
//         ) : (
//           <EmptyState>
//             <EmptyIcon>📝</EmptyIcon>
//             <EmptyText>Nenhum item cadastrado nesta categoria ainda.</EmptyText>
//             <AddButton href="/accordion">
//               <FiPlus size={18} />
//               Adicionar Item
//             </AddButton>
//           </EmptyState>
//         )}
//       </Card>

//       <ModalConfirm
//         open={showDeleteModal}
//         title="Confirmar exclusão"
//         description={
//           hasAccordions
//             ? `Deseja realmente excluir a categoria "${category.name}" e TODOS os ${category.accordions.length} itens dentro dela? Esta ação não pode ser desfeita!`
//             : `Deseja realmente excluir a categoria "${category.name}"?`
//         }
//         onConfirm={handleDelete}
//         onClose={() => setShowDeleteModal(false)}
//       />
//     </>
//   );
// }

"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiFolder,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBookmark,
} from "react-icons/fi";
import AccordionItem from "./AccordionItem";
import Link from "next/link";
import { useAdmin } from "../hooks/useAdmin";
import { useState } from "react";
import ModalConfirm from "./ModalConfirm";
import { toast } from "react-toastify";
import { useAccordion } from "../context/AccordionContext";

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
  pinned?: boolean;
  description?: string;
  createdAt?: string;
  accordions: Accordion[];
};

type CategoryCardProps = {
  category: Category;
  // pinnedCategories: number[];
  // setPinnedCategories: (categories: number[]) => void;
};

const Card = styled(motion.div)<{ $isPinned?: boolean }>`
  background: rgba(255, 255, 255, 0.8);
  /* background: ${({ $isPinned }) =>
    $isPinned
      ? "linear-gradient(135deg, rgba(251, 243, 219, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)"
      : "rgba(255, 255, 255, 0.8)"}; */
  /* border: 1px solid
    ${({ $isPinned }) =>
    $isPinned ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.15)"}; */
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  /* box-shadow: ${({ $isPinned }) =>
    $isPinned
      ? "0 8px 24px rgba(245, 158, 11, 0.15)"
      : "0 4px 12px rgba(59, 130, 246, 0.08)"}; */
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s;
  position: relative;

  /* &:hover {
    box-shadow: ${({ $isPinned }) =>
    $isPinned
      ? "0 12px 32px rgba(245, 158, 11, 0.25)"
      : "0 6px 16px rgba(59, 130, 246, 0.12)"};
    border-color: ${({ $isPinned }) =>
    $isPinned ? "rgba(245, 158, 11, 0.5)" : "rgba(59, 130, 246, 0.25)"};
  } */
`;

const PinnedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.1);
`;

const IconWrapper = styled.div<{ $isPinned?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $isPinned }) =>
    $isPinned
      ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: ${({ $isPinned }) =>
    $isPinned
      ? "0 4px 12px rgba(245, 158, 11, 0.3)"
      : "0 4px 12px rgba(59, 130, 246, 0.3)"};
  flex-shrink: 0;
`;

const CategoryInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const CategoryName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a8a;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(239, 246, 255, 0.8);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 8px 12px;
`;

const EditInput = styled.input`
  flex: 1;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a8a;
  border: none;
  background: transparent;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: #94a3b8;
  }
`;

const Badge = styled.span`
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

const ActionButton = styled(motion.button)<{
  variant?: "edit" | "delete" | "save" | "cancel" | "pin";
  $disabled?: boolean;
}>`
  background: ${({ variant, $disabled }) => {
    if ($disabled) return "rgba(203, 213, 225, 0.3)";
    if (variant === "save")
      return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    if (variant === "cancel") return "rgba(100, 116, 139, 0.1)";
    if (variant === "delete") return "rgba(239, 68, 68, 0.1)";
    if (variant === "pin") return "transparent";
    return "rgba(59, 130, 246, 0.1)";
  }};
  border: 1px solid
    ${({ variant, $disabled }) => {
      if ($disabled) return "rgba(203, 213, 225, 0.5)";
      if (variant === "save") return "transparent";
      if (variant === "cancel") return "rgba(100, 116, 139, 0.3)";
      if (variant === "delete") return "rgba(239, 68, 68, 0.3)";
      return "rgba(59, 130, 246, 0.3)";
    }};
  color: ${({ variant, $disabled }) => {
    if ($disabled) return "#94a3b8";
    if (variant === "save") return "#ffffff";
    if (variant === "cancel") return "#64748b";
    if (variant === "delete") return "#dc2626";
    return "#2563eb";
  }};
  padding: ${({ variant }) =>
    variant === "save" || variant === "cancel" ? "8px 16px" : "8px"};
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  white-space: nowrap;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background: ${({ variant, $disabled }) => {
      if ($disabled) return "rgba(203, 213, 225, 0.3)";
      if (variant === "save")
        return "linear-gradient(135deg, #059669 0%, #047857 100%)";
      if (variant === "cancel") return "rgba(100, 116, 139, 0.2)";
      if (variant === "delete") return "rgba(239, 68, 68, 0.2)";
      return "rgba(59, 130, 246, 0.2)";
    }};
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(-1px)")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "scale(0.98)")};
  }
`;

const PinButton = styled(ActionButton)<{ $isPinned?: boolean }>`
  background: ${({ $isPinned, $disabled }) =>
    $disabled
      ? "rgba(203, 213, 225, 0.3)"
      : $isPinned
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "rgba(59, 130, 246, 0.1)"};
  border: 1px solid
    ${({ $isPinned, $disabled }) =>
      $disabled
        ? "rgba(203, 213, 225, 0.5)"
        : $isPinned
          ? "transparent"
          : "rgba(59, 130, 246, 0.3)"};
  color: ${({ $isPinned, $disabled }) =>
    $disabled ? "#94a3b8" : $isPinned ? "#ffffff" : "#2563eb"};
  box-shadow: ${({ $isPinned }) =>
    $isPinned ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "none"};

  &:hover {
    background: ${({ $isPinned, $disabled }) =>
      $disabled
        ? "rgba(203, 213, 225, 0.3)"
        : $isPinned
          ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
          : "rgba(59, 130, 246, 0.2)"};
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
export default function CategoryCard({
  category,
}: CategoryCardProps) {
  const { isAdmin } = useAdmin();
  const { removeCategory, updateCategory, togglePinCategory, data } = useAccordion(); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasAccordions = category.accordions.length > 0;
  const isPinned = category.pinned || false; 
  const pinnedCount = data.categories.filter((c) => c.pinned).length;
  const canPin = isPinned || pinnedCount < 3;
  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(category.name);
  };
  const handleSave = async () => {
    if (!editedName.trim()) {
      toast.error("O nome da categoria não pode estar vazio");
      return;
    }
    if (editedName.trim() === category.name) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);

    try {
      await updateCategory(category.id, { name: editedName.trim() });
      toast.success("Categoria atualizada com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erro ao atualizar categoria:", error);
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
    setIsLoading(true);
    try {
      await removeCategory(category.id);

      toast.success(
        hasAccordions
          ? `Categoria "${category.name}" e todos os ${category.accordions.length} itens excluídos com sucesso!`
          : "Categoria excluída com sucesso!",
      );
      setShowDeleteModal(false);
    } catch (error: any) {
      console.error("Erro ao excluir categoria:", error);
      toast.error(error.message || "Erro ao excluir categoria");
    } finally {
      setIsLoading(false);
    }
  };
 

  const togglePin = async () => {
    if (!canPin && !isPinned) {
      toast.error("Você só pode fixar até 3 categorias por vez!");
      return;
    }

    setIsLoading(true);

    try {
      await togglePinCategory(category.id);

      if (isPinned) {
        toast.success(`Categoria "${category.name}" desfixada!`);
      } else {
        toast.success(`Categoria "${category.name}" fixada no topo!`);
      }
    } catch (error: any) {
      console.error("Erro ao fixar/desafixar categoria:", error);
      toast.error(error.message || "Erro ao fixar categoria");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Card
        $isPinned={isPinned}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* {isPinned && (
          <PinnedBadge>
            <FiBookmark size={12} />
            Fixada
          </PinnedBadge>
        )} */}
        <Header>
          <IconWrapper $isPinned={isPinned}>
            <FiFolder size={20} />
          </IconWrapper>

          {isEditing ? (
            <EditWrapper>
              <EditInput
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                disabled={isLoading}
                autoFocus
                placeholder="Nome da categoria"
              />
            </EditWrapper>
          ) : (
            <CategoryInfo>
              <CategoryName>{category.name}</CategoryName>
            </CategoryInfo>
          )}

          <Badge>{category.accordions.length}</Badge>

          <PinButton
            variant="pin"
            $isPinned={isPinned}
            $disabled={(!canPin && !isPinned) || isLoading} 
            onClick={togglePin}
            whileHover={{ scale: canPin || isPinned ? 1.1 : 1 }}
            whileTap={{ scale: canPin || isPinned ? 0.9 : 1 }}
            title={
              isPinned
                ? "Desafixar categoria"
                : canPin
                  ? "Fixar categoria no topo"
                  : "Limite de 3 categorias fixadas atingido"
            }
          >
            <FiBookmark size={16} />
          </PinButton>
        </Header>

        <div>
          {isAdmin && (
            <Actions>
              {isEditing ? (
                <>
                  <ActionButton
                    variant="save"
                    onClick={handleSave}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Salvar
                  </ActionButton>
                  <ActionButton
                    variant="cancel"
                    onClick={handleCancel}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton
                    variant="edit"
                    onClick={handleEdit}
                    disabled={isLoading}
                    title="Editar categoria"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiEdit2 size={16} />
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                    title="Excluir categoria"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiTrash2 size={16} />
                  </ActionButton>
                </>
              )}
            </Actions>
          )}
        </div>

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
        description={
          hasAccordions
            ? `Deseja realmente excluir a categoria "${category.name}" e TODOS os ${category.accordions.length} itens dentro dela? Esta ação não pode ser desfeita!`
            : `Deseja realmente excluir a categoria "${category.name}"?`
        }
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
