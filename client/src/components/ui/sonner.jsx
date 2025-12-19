import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      expand={true}
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        style: {
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "16px",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.1)",
          color: "#fff",
        },
        className: "toast-custom",
        duration: 4000,
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-400" />,
        info: <InfoIcon className="size-5 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-400" />,
        error: <OctagonXIcon className="size-5 text-red-400" />,
        loading: <Loader2Icon className="size-5 text-gray-400 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
