import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const WindowContainer = styled.div`
  ${tw`w-32 h-16 bg-white absolute top-24 left-24 z-10`}
`;

const Window = () => {
  return <WindowContainer></WindowContainer>;
};

export default Window;
