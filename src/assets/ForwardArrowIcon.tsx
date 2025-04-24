import React, { SVGProps } from 'react';

const ForwardArrowIcon: React.FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M5 12h14M12 5l7 7-7 7' />
    </svg>
  );
};

export default ForwardArrowIcon;
