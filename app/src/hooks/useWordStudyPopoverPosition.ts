import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';
import type { WordStudyAnchor } from '@/types/wordStudy';

const MOBILE_BREAKPOINT = 768;
const VIEWPORT_PADDING = 12;
const ANCHOR_GAP = 8;
const POPOVER_WIDTH = 360;
const PREFERRED_MAX_HEIGHT_RATIO = 0.7;
const MIN_VIEWPORT_CLEARANCE = 100;

export type PopoverPlacement = 'below' | 'above' | 'sheet';

export interface PopoverPositionStyle {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width?: number | string;
  maxHeight: number | string;
}

interface UseWordStudyPopoverPositionOptions {
  popoverRef: RefObject<HTMLDivElement | null>;
  tokenId: string | null;
  anchor: WordStudyAnchor | null;
  open: boolean;
  /** Re-run when content size may change */
  contentKey: string;
}

interface PopoverPositionResult {
  style: PopoverPositionStyle;
  placement: PopoverPlacement;
  isMobile: boolean;
  isReady: boolean;
}

function getViewportSize(): { width: number; height: number } {
  const visual = window.visualViewport;
  return {
    width: visual?.width ?? window.innerWidth,
    height: visual?.height ?? window.innerHeight,
  };
}

function resolveAnchorRect(
  tokenId: string | null,
  fallback: WordStudyAnchor | null,
): DOMRect | null {
  if (tokenId) {
    const element = document.getElementById(tokenId);
    if (element) {
      return element.getBoundingClientRect();
    }
  }
  if (!fallback) return null;
  return new DOMRect(fallback.left, fallback.top, fallback.width, fallback.height);
}

function computeDesktopPosition(
  anchorRect: DOMRect,
  popoverHeight: number,
  popoverWidth: number,
  viewportWidth: number,
  viewportHeight: number,
): { style: PopoverPositionStyle; placement: 'below' | 'above' } {
  const preferredMaxHeight = Math.min(
    viewportHeight * PREFERRED_MAX_HEIGHT_RATIO,
    viewportHeight - MIN_VIEWPORT_CLEARANCE,
  );

  const spaceBelow = viewportHeight - VIEWPORT_PADDING - (anchorRect.bottom + ANCHOR_GAP);
  const spaceAbove = anchorRect.top - ANCHOR_GAP - VIEWPORT_PADDING;
  const estimatedHeight = Math.min(
    popoverHeight > 0 ? popoverHeight : preferredMaxHeight,
    preferredMaxHeight,
  );
  const minComfortableHeight = Math.min(180, estimatedHeight);

  const canFitBelow = spaceBelow >= minComfortableHeight;
  const canFitAbove = spaceAbove >= minComfortableHeight;

  const placeBelow =
    (canFitBelow && !canFitAbove) ||
    (canFitBelow && canFitAbove && spaceBelow >= spaceAbove) ||
    (!canFitAbove && spaceBelow >= spaceAbove);

  const left = clampHorizontal(
    anchorRect.left + anchorRect.width / 2 - popoverWidth / 2,
    popoverWidth,
    viewportWidth,
  );

  if (placeBelow) {
    const top = Math.min(
      anchorRect.bottom + ANCHOR_GAP,
      viewportHeight - VIEWPORT_PADDING - minComfortableHeight,
    );
    const maxHeight = Math.min(
      preferredMaxHeight,
      Math.max(minComfortableHeight, viewportHeight - VIEWPORT_PADDING - top),
    );
    return {
      placement: 'below',
      style: { top, left, width: popoverWidth, maxHeight },
    };
  }

  const maxHeight = Math.min(
    preferredMaxHeight,
    Math.max(minComfortableHeight, spaceAbove),
  );
  const bottom = viewportHeight - anchorRect.top + ANCHOR_GAP;
  return {
    placement: 'above',
    style: { bottom, left, width: popoverWidth, maxHeight },
  };
}

function clampHorizontal(left: number, width: number, viewportWidth: number): number {
  return Math.max(
    VIEWPORT_PADDING,
    Math.min(left, viewportWidth - width - VIEWPORT_PADDING),
  );
}

function computeSheetPosition(): PopoverPositionResult {
  return {
    placement: 'sheet',
    isMobile: true,
    isReady: true,
    style: {
      left: VIEWPORT_PADDING,
      right: VIEWPORT_PADDING,
      bottom: 0,
      width: 'auto',
      maxHeight: 'min(85vh, calc(100vh - 48px))',
    },
  };
}

export function useWordStudyPopoverPosition({
  popoverRef,
  tokenId,
  anchor,
  open,
  contentKey,
}: UseWordStudyPopoverPositionOptions): PopoverPositionResult {
  const [result, setResult] = useState<PopoverPositionResult>({
    placement: 'below',
    isMobile: false,
    isReady: false,
    style: { maxHeight: 'min(70vh, calc(100vh - 100px))' },
  });

  const updatePosition = useCallback(() => {
    if (!open) return;

    const { width: viewportWidth, height: viewportHeight } = getViewportSize();
    const isMobile = viewportWidth < MOBILE_BREAKPOINT;

    if (isMobile) {
      setResult(computeSheetPosition());
      return;
    }

    const anchorRect = resolveAnchorRect(tokenId, anchor);
    if (!anchorRect) return;

    const popoverEl = popoverRef.current;
    const popoverHeight = popoverEl?.offsetHeight ?? 0;
    const popoverWidth = Math.min(POPOVER_WIDTH, viewportWidth - VIEWPORT_PADDING * 2);
    const { style, placement } = computeDesktopPosition(
      anchorRect,
      popoverHeight,
      popoverWidth,
      viewportWidth,
      viewportHeight,
    );

    setResult({
      placement,
      isMobile: false,
      isReady: true,
      style,
    });
  }, [anchor, open, popoverRef, tokenId]);

  useLayoutEffect(() => {
    if (!open) {
      setResult((prev) => ({ ...prev, isReady: false }));
      return;
    }

    updatePosition();

    const handleReposition = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    window.visualViewport?.addEventListener('resize', handleReposition);
    window.visualViewport?.addEventListener('scroll', handleReposition);

    const popoverEl = popoverRef.current;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && popoverEl
        ? new ResizeObserver(handleReposition)
        : null;
    if (resizeObserver && popoverEl) {
      resizeObserver.observe(popoverEl);
    }

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
      window.visualViewport?.removeEventListener('resize', handleReposition);
      window.visualViewport?.removeEventListener('scroll', handleReposition);
      resizeObserver?.disconnect();
    };
  }, [contentKey, open, updatePosition]);

  return result;
}
