'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

type ModalConfirmProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
};

// ✅ CORRIGIDO: "redgba" -> "rgba"
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(4px);
`;

const Box = styled(motion.div)` 
  background: rgba(255, 255, 255, 0.95);
  padding: 32px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1e3a8a;
`;

const Description = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 1rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled(motion.button)<{ $danger?: boolean }>`
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
  
  ${({ $danger }) =>
    $danger
      ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    
    &:hover {
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }
  `
      : `
    background: rgba(248, 250, 252, 0.9);
    color: #64748b;
    border: 1px solid rgba(59, 130, 246, 0.15);
    
    &:hover {
      background: rgba(241, 245, 249, 0.9);
      color: #475569;
    }
  `}

  &:active {
    transform: scale(0.98);
  }
`;

export default function ModalConfirm({
  open,
  title,
  description,
  onConfirm,
  onClose,
}: ModalConfirmProps) {
  return (
    <AnimatePresence>
      {open && (
        <Overlay
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Box
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Title>{title}</Title>
            <Description>{description}</Description>

            <Actions>
              <Button 
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </Button>
              <Button 
                $danger 
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Excluir
              </Button>
            </Actions>
          </Box>
        </Overlay>
      )}
    </AnimatePresence>
  );
}