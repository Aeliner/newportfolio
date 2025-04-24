import React, { SVGProps } from 'react';

interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  direction?: 'up' | 'down' | 'left' | 'right';
}

const ChevronIcon: React.FC<ChevronIconProps> = props => {
  const getPath = () => {
    switch (props.direction) {
      case 'up':
        return 'M18 15l-6-6-6 6';
      case 'right':
        return 'M9 18l6-6-6-6';
      case 'left':
        return 'M15 18l-6-6 6-6';
      case 'down':
      default:
        return 'M6 9l6 6 6-6';
    }
  };

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
      <path d={getPath()} />
    </svg>
  );
};

export default ChevronIcon;
