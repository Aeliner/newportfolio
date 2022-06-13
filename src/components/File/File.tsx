import React, { MouseEvent } from 'react';
import Img from 'react-cool-img';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { revisedRandId } from '@/utils/generateId';
import { Icons } from './FileIcons';

const FileContainer = styled.div`
  ${tw`flex flex-col p-1 bg-transparent hover:shadow-2xl`}
  img {
    ${tw`p-4 pb-0`}
  }
  &:hover,
  :focus {
    box-shadow: inset 0px 0px 0px 1px rgba(0, 221, 255, 1);
    background: rgba(0, 221, 255, 0.15);
  }
`;

const FileName = styled.h2`
  ${tw`text-white text-center text-sm whitespace-nowrap overflow-hidden overflow-ellipsis`}
`;

interface FileProps {
  fileName: string;
  content?: string;
  type: 'file' | 'folder';
}

const File = ({
  fileName,
  content = 'Write your content here',
  type = 'file',
}: FileProps) => {
  const { windows, setWindows } = useGlobal();
  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    setWindows([
      ...windows,
      {
        id: revisedRandId(),
        coordinates: { x: e.clientX, y: e.clientY },
        title: fileName,
        content: content,
        type: type,
        state: 'open',
      },
    ]);
  };

  return (
    <FileContainer onDoubleClick={handleDoubleClick} tabIndex={0}>
      <Img src={Icons[type]} />
      <FileName>{fileName}</FileName>
    </FileContainer>
  );
};

export default File;
