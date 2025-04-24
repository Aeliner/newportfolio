import styled from 'styled-components';
import tw from 'twin.macro';

export const PreviewContainer = styled.div`
  ${tw`absolute bg-gray-600/20 hover:bg-gray-600/30 bottom-12 px-4 py-3.5 rounded-lg flex flex-col gap-2 text-white`}
`;

export const PreviewHeader = styled.div`
  ${tw`flex items-center gap-2`}
`;
