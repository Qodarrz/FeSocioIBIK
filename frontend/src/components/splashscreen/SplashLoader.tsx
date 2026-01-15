import { Html, useProgress } from "@react-three/drei";

export default function SplashLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 text-primary">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm tracking-wide">
          Loading {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}
