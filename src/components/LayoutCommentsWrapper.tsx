'use client';

import { useState } from 'react';
import CommentInput from './CommentInput';
import CommentList from './CommentList';

interface LayoutCommentsWrapperProps {
  layoutId: number;
}

export default function LayoutCommentsWrapper({
  layoutId,
}: LayoutCommentsWrapperProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <>
      <CommentInput
        layoutId={layoutId}
        onCommentAdded={() => setRefreshTrigger((prev) => prev + 1)}
      />
      <CommentList layoutId={layoutId} refreshTrigger={refreshTrigger} />
    </>
  );
}
