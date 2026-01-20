"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiLock, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const Container = styled.main`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const BackgroundEffects = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Orb = styled(motion.div)<{ top: string; left: string }>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  filter: blur(80px);
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 420px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 32px;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-weight: 600;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-size: 0.95rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  margin-top: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackLink = styled.a`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 16px;
  display: block;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #2563eb;
  }
`;

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Credenciais simples (em produção, use backend real)
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else {
      toast.error("Credenciais inválidas!");
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackgroundEffects>
        <Orb
          top="20%"
          left="10%"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Orb
          top="60%"
          left="70%"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </BackgroundEffects>

      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>🔐 Admin</Title>
        <Subtitle>Acesso restrito para administradores</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Usuário</Label>
            <InputWrapper>
              <Icon>
                <FiUser size={18} />
              </Icon>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <InputWrapper>
              <Icon>
                <FiLock size={18} />
              </Icon>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Form>

        <BackLink onClick={() => router.push("/")}>
          ← Voltar para início
        </BackLink>
      </LoginCard>
    </Container>
  );
}
