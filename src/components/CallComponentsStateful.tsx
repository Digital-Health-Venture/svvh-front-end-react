import React, { useCallback, useState } from 'react';
import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  EndCallButton
} from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import { setIconOptions } from '@fluentui/react/lib/Styling';

// Suppress icon warnings.
setIconOptions({
  disableWarnings: true
});

const CallingComponents: React.FC = () => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const endCallProps = usePropsFor(EndCallButton);
  
  const [callEnded, setCallEnded] = useState(false);

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps]);

  if (callEnded) {
    return <CallEnded />;
  }

  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      <div style={{ width: '100vw', height: '100vh' }}>
        {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
      </div>

      <ControlBar layout="floatingBottom">
        {cameraProps && <CameraButton {...cameraProps} />}
        {microphoneProps && <MicrophoneButton {...microphoneProps} />}
        {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
      </ControlBar>
    </Stack>
  );
};

const CallEnded: React.FC = () => {
  return <h1>You ended the call.</h1>;
};

export default CallingComponents;
