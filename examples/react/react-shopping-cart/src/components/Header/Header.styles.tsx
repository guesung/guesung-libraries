import styled from "@emotion/styled";

export const headerLayout = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  background-color: black;
  color: ${({ theme }) => theme.colors.white};
  font-family: "Noto Sans";
  font-size: 20px;
  font-weight: 800;
`;

export const Title = styled.div`
  cursor: pointer;
`;
