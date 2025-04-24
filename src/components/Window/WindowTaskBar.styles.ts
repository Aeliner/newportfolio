import styled from 'styled-components';
import tw from 'twin.macro';

export const TaskBarContainer = styled.div`
  ${tw`flex w-full h-12 bg-slate-600 items-center p-2 gap-4`}
`;

export const TaskBarInput = styled.input`
  ${tw`w-full h-full p-2 bg-slate-500/50 rounded-md`}
`;

export const SearchInput = styled.input`
  ${tw`w-1/4 h-full p-2 bg-slate-500/50 rounded-md`}
`;
