import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
      Plugins: {
        SmsRetriever?: {
          startListening: () => Promise<{ otp: string }>;
          stopListening:  () => Promise<void>;
          addListener: (event: string, cb: (data: { otp: string }) => void) => any;
        };
      };
    };
  }
}

export function useSmsRetriever(onOtpReceived: (otp: string) => void) {
  const listenerRef = useRef<any>(null);

  useEffect(() => {
    const isNative = window.Capacitor?.isNativePlatform?.() ?? false;
    const plugin   = window.Capacitor?.Plugins?.SmsRetriever;

    if (!isNative || !plugin) return;

    // Start listening for SMS
    plugin.startListening().then(({ otp }) => {
      if (otp) onOtpReceived(otp);
    }).catch(() => {
      // Timeout or failure
    });

    // Add listener for event-based delivery
    listenerRef.current = plugin.addListener('smsReceived', ({ otp }) => {
      if (otp) onOtpReceived(otp);
    });

    return () => {
      if (listenerRef.current) {
        listenerRef.current.remove();
      }
      plugin.stopListening().catch(() => {});
    };
  }, [onOtpReceived]);
}
