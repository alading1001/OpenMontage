import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

const SOURCE = staticFile('chicken-rabbit-local/final_vertical.mp4');

export const ChickenRabbitWide: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#efe8dc', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(90deg, #eadfcd 0%, #f8f4ec 50%, #eadfcd 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 608,
          height: 1080,
          transform: 'translate(-50%, -50%)',
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(28, 37, 41, 0.28)',
          backgroundColor: '#efe8dc',
        }}
      >
        <OffthreadVideo
          src={SOURCE}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
