import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { ReactComponent as WindowsLogo } from '@/assets/window.svg';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { Icons } from '@/components/File/FileIcons';
import Img from 'react-cool-img';

const ActionBarContainer = styled.div`
  ${tw`bg-gray-700 w-full h-12 flex`}
`;

const ImageContainer = styled.div`
  ${tw`h-12 w-12 flex justify-center items-center text-white hover:cursor-pointer hover:bg-gray-600 hover:text-[#00adef]`}
  svg {
    ${tw`w-6 h-6`}
  }
  img {
    ${tw`w-6 h-6`}
  }
`;

const Footer = () => {
  const { windows, setWindows } = useGlobal();
  return (
    <ActionBarContainer>
      <ImageContainer>
        <WindowsLogo />
      </ImageContainer>
      {windows.map(window => (
        <ImageContainer>
          <Img src={Icons[window.type]} />
        </ImageContainer>
      ))}
    </ActionBarContainer>
  );
};

export default Footer;
