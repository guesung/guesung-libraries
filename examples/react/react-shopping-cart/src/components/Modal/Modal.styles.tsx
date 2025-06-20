import type { Device } from "@/hooks";
import styled from "@emotion/styled";
import type { ModalProps } from "./Modal";
import { size } from "@/styles";

export const ModalContainer = styled.div<
	Pick<ModalProps, "position" | "zIndex" | "size"> & { device: Device }
>`
  max-width: calc(${size.mobileWidth}px - 64px);
  box-sizing: border-box;
  height: fit-content;

  background-color: white;
  padding: 24px 32px;

  border-radius: ${(props) => (props.position === "center" ? "8px" : "8px 8px 0 0")};
  position: fixed;

  left: 0;
  right: 0;
  margin: 0 auto;

  top: ${(props) => (props.position === "center" ? "50%" : "auto")};
  transform: ${(props) => (props.position === "center" ? "translateY(-50%)" : "translateY(0)")};

  bottom: 0;

  z-index: ${(props) => props.zIndex};
`;

export const ModalTop = styled.div`
  display: flex;
`;

export const ModalContent = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-left: auto;
  justify-content: flex-end;
  width: 100%;
`;

export const ModalBottom = styled.div`
  display: flex;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;

  flex: 1;
`;

export const ModalBackdrop = styled.div<{ zIndex: number }>`
  background-color: ${({ theme }) => theme.colors.black};
  opacity: 0.35;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  z-index: ${(props) => props.zIndex};
`;

export const TransparentButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
