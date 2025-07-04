import styled from "@emotion/styled";
import type { ToastVariant } from "./ToastProvider";

export const ToastContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  gap: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const Toast = styled.div<{ variant: ToastVariant; duration: number }>`
  min-width: 300px;
  max-width: 350px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  border-radius: 8px;
  box-shadow: 0 2px 12px ${({ theme }) => theme.colors.gray};
  display: flex;
  align-items: center;
  padding: 16px 20px 12px 16px;
  background-color: ${({ variant, theme }) => (variant === "success" ? theme.colors.success : theme.colors.error)};
  animation: active ${({ duration }) => duration}ms ease forwards;

  @keyframes active {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }

    10% {
      transform: translateX(0%);
      opacity: 1;
    }

    90% {
      transform: translateX(0%);
      opacity: 1;
    }

    100% {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
`;

export const ToastIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

export const ToastMessage = styled.div`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
`;

export const ToastClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 18px;
  cursor: pointer;
`;

export const ToastProgress = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.success};
  border-radius: 0 0 8px 8px;
  transition: width linear;
`;
