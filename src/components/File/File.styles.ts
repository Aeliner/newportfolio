import styled from 'styled-components';
import tw from 'twin.macro';

export const FileContainer = styled.div`
  ${tw`flex flex-col p-1 bg-transparent hover:shadow-2xl`}
  &.selected {
    box-shadow: inset 0px 0px 0px 1px rgba(0, 221, 255, 1);
    background: rgba(0, 221, 255, 0.15);
  }
  img {
    ${tw`p-4 pb-0`}
  }
  &:hover,
  :focus {
    box-shadow: inset 0px 0px 0px 1px rgba(0, 221, 255, 1);
    background: rgba(0, 221, 255, 0.15);
  }
`;

export const FileName = styled.h2`
  ${tw`text-white text-center text-sm whitespace-nowrap overflow-hidden overflow-ellipsis`}
`;

export const FileNameInput = styled.input`
  ${tw`text-white text-center text-sm bg-transparent border-none outline-none w-full`}
  &:focus {
    outline: none;
  }
`;
