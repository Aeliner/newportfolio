import styled from 'styled-components';
import tw from 'twin.macro';

const Container = styled.div`
  ${tw`absolute z-10`}
`;

const WindowContainer = styled.div`
  ${tw`absolute bg-slate-800 text-white z-10 shadow-window data-[open=true]:scale-100 origin-bottom transition-transform will-change-transform data-[minimized=true]:scale-0`}
`;

const WindowLayout = styled.div`
  ${tw`flex w-full h-12 `}
`;

const ButtonsContainer = styled.div`
  ${tw`flex ml-auto`}
  button {
    ${tw`h-12 w-12 text-center text-3xl text-white hover:cursor-pointer hover:bg-gray-600 hover:text-[#00adef]`}
  }
`;

const WindowTitle = styled.span`
  ${tw`rounded-t-xl bg-slate-600 p-2 text-xl mt-2 ml-2 w-48`}
`;

const WindowTextContent = styled.div`
  ${tw`w-full h-full p-2 `}
`;

// Add a new component to render the contents of a folder
const FolderContents = styled.div`
  ${tw`w-full overflow-y-auto p-2 grid gap-4`}
  height: calc(100% - 72px);
  grid-template-columns: repeat(auto-fill, 80px);
  grid-auto-rows: 80px;
`;

const FileItem = styled.div`
  ${tw`flex flex-col items-center p-1 cursor-pointer rounded hover:bg-opacity-5 hover:bg-black`}
`;

const FileIcon = styled.div`
  ${tw`w-12 h-12 bg-gray-100 text-3xl flex items-center justify-center mb-1 rounded`}
`;

const FileName = styled.div`
  ${tw`text-xs text-center break-words max-w-[80px]`}
`;

export {
  Container,
  WindowContainer,
  WindowLayout,
  ButtonsContainer,
  WindowTitle,
  WindowTextContent,
  FolderContents,
  FileItem,
  FileIcon,
  FileName,
};
