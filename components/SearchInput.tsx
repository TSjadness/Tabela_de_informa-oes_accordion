'use client';

import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const Wrapper = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 18px 18px 56px;
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-size: 1rem;
  transition: all 0.3s;
  backdrop-filter: blur(20px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Icon = styled(FiSearch)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
`;

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Wrapper
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={22} />
      <Input
        aria-label="Busca global"
        placeholder="Buscar por título, conteúdo ou categoria..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </Wrapper>
  );
}