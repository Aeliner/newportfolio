import { useGlobal } from '@/store/slices/GlobalSlice';
import React, { forwardRef } from 'react';
import { PreviewContainer, PreviewHeader } from './PreviewWindow.styles';

interface WindowPreviewProps {
  windowId: string;
  style?: React.CSSProperties;
}

const WindowPreview = forwardRef<HTMLDivElement, WindowPreviewProps>(
  ({ windowId, style, ...props }, ref) => {
    const { windows } = useGlobal();
    const window = windows[windowId];
    return window?.size.previewWidth && window?.size.previewHeight ? (
      <PreviewContainer
        ref={ref}
        style={{
          ...style,
          width: window?.size.previewWidth,
          height: window?.size.previewHeight,
        }}
        {...props}
      >
        <PreviewHeader>
          <img src={window?.icon} alt='Window icon' />
          <span>{window?.title}</span>
        </PreviewHeader>
        <img
          src={window?.previewImage}
          alt='Window preview'
          style={{ width: '100%', height: '100%' }}
        />
      </PreviewContainer>
    ) : null;
  },
);

export default WindowPreview;
