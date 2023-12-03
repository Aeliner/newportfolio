import { styled } from 'styled-components';
import tw from 'twin.macro';

export const ActionBarContainer = styled.div`
  ${tw`bg-gray-700 w-full h-12 flex`}
`;

export const ImageContainer = styled.div`
  ${tw`h-12 w-12 flex justify-center items-center text-white hover:cursor-pointer hover:bg-gray-600 hover:text-[#00adef]`}
  svg {
    ${tw`w-6 h-6`}
  }
  img {
    ${tw`w-6 h-6`}
  }
`;
