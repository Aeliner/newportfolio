import styled from 'styled-components';
import tw from 'twin.macro';

export const BreadcrumbContainer = styled.div`
  ${tw`flex items-center text-sm text-white bg-slate-500/50 px-2 py-1 h-full rounded w-full`}
  cursor: text;
  input {
    ${tw`w-full h-full bg-slate-500/50 rounded-md`}
  }
`;

export const Segment = styled.span`
  ${tw`cursor-pointer hover:text-blue-600`}
  &:hover {
    text-decoration: underline;
  }
`;

export const Separator = styled.span`
  ${tw`mx-1 text-gray-400`}
`;
