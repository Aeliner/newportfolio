import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Img from 'react-cool-img';
import TextIcon from '@/assets/textIcon.png';

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
}

const File = ({ fileName, content = 'Write your content here' }: FileProps) => {
  return (
    <FileContainer tabIndex={0}>
      <Img src={TextIcon} />
      <FileName>{fileName}</FileName>
    </FileContainer>
  );
};

export default File;
