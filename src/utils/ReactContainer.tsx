import React from 'react';

const ReactContainer = ({ children }: { children: any }) => {
  return <div dangerouslySetInnerHTML={{ __html: children.innerHTML }}></div>;
};

export default ReactContainer;
