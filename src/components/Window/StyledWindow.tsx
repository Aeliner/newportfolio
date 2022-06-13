import styled, { css, keyframes } from 'styled-components';
import tw from 'twin.macro';

interface ContainerProps {
  minimized: boolean;
}

const minimize = keyframes`
  0% { opacity: 1;}
    99% { opacity: 0.01;}
    100% { opacity: 1;width: 0; height: 0; visibility: hidden;}
  `;

const animation = css`
  animation: ${minimize} 0.15s cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
`;

const WindowContainer = styled.div<ContainerProps>`
  ${tw`w-full h-full bg-white z-10 shadow-window`}
`;

const WindowLayout = styled.div`
  ${tw`flex w-full h-12 `}
`;

const ButtonsContainer = styled.div`
  ${tw`flex ml-auto`}
  button {
    ${tw`h-12 w-12 text-center  text-3xl text-black hover:cursor-pointer hover:bg-gray-600 hover:text-[#00adef]`}
  }
`;

export {
  animation as Animation,
  WindowContainer,
  WindowLayout,
  ButtonsContainer,
};
