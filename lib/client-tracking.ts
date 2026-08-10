"use client";

type TrackPayload = Record<string, unknown>;

type TrackingHandle = {
  push: (eventName: string, payload?: TrackPayload) => void;
};

type WindowWithTracking = Window & {
  ArtizanTrack?: TrackingHandle;
};

export function trackClientEvent(eventName: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const trackingHandle = (window as WindowWithTracking).ArtizanTrack;
  if (!trackingHandle) {
    return;
  }

  trackingHandle.push(eventName, payload);
}
