import styled from 'styled-components';
import tw from 'twin.macro';
import { IMAGE_SIZE } from '../Footer/Footer.styles';

export const ImageContainer = styled.div`
  ${tw`flex relative justify-center items-center text-white hover:bg-gray-600 hover:text-[#00adef]`}
  svg {
    ${tw`w-6 h-6`}
  }
  img {
    ${tw`w-6 h-6`}
  }
  width: ${IMAGE_SIZE}px;
  height: ${IMAGE_SIZE}px;
`;
