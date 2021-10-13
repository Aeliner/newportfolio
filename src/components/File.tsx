import FolderIcon from '@/assets/folderIcon.png';
import TextIcon from '@/assets/textIcon.png';
import React from 'react';
import Img from 'react-cool-img';
import styled from 'styled-components';
import tw from 'twin.macro';
import ReactDOM from 'react-dom';
import Window from './Window';

const FileContainer = styled.div`
  ${tw`flex flex-col p-1 bg-transparent hover:shadow-2xl`}
  img {
    ${tw`p-4 pb-0`}
  }
  &:hover,
  :focus {
    box-shadow: inset 0px 0px 0px 1px rgba(0, 221, 255, 1);
  }
`;

const FileName = styled.h2`
  ${tw`text-white text-center text-sm whitespace-nowrap overflow-hidden overflow-ellipsis`}
`;

interface FileProps {
  fileName: string;
  content?: string;
  type: string;
}

const Icons: any = {
  text: TextIcon,
  folder: FolderIcon,
};

const handleDoubleClick = () => {
  console.log('did it');
};

const File = ({
  fileName,
  content = 'Write your content here',
  type = 'text',
}: FileProps) => {
  return (
    <FileContainer onDoubleClick={handleDoubleClick} tabIndex={0}>
      <Img src={Icons[type]} />
      <FileName>{fileName}</FileName>
    </FileContainer>
  );
};

export default File;
