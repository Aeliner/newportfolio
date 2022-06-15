import styled, { css, keyframes } from 'styled-components';
import tw from 'twin.macro';

const Container = styled.div`
  ${tw`absolute z-10`}
`;

const WindowContainer = styled.div`
  ${tw`absolute bg-white z-10 shadow-window`}
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

const minimize = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(.5);
  }

  `;

const Animation = css`
  animation: ${minimize} 0.15s cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
`;
const ReverseAnimation = css`
  animation: ${minimize} 0.15s cubic-bezier(0.47, 0, 0.745, 0.715) reverse;
`;

export {
  Animation,
  ReverseAnimation,
  Container,
  WindowContainer,
  WindowLayout,
  ButtonsContainer,
};
