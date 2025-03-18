export const baseStyles = {
  colors: {
    gradient: "linear-gradient(113.54deg, #FF9500 25%, #FF5722 75%)",
    white: "#FFFFFF",
    whiteTransparent: "rgba(255, 255, 255, 0.9)",
    whiteMoreTransparent: "rgba(255, 255, 255, 0.7)",
    whiteMostTransparent: "rgba(255, 255, 255, 0.15)",
    whiteBorder: "rgba(255, 255, 255, 0.2)",
  },

  fonts: {
    base: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },

  shadows: {
    sm: "0 4px 12px rgba(0, 0, 0, 0.08)",
    md: "0 8px 16px rgba(0, 0, 0, 0.15)",
    lg: "0 16px 32px rgba(0, 0, 0, 0.15)",
  },

  backgrounds: {
    texture:
      "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')",
    glow: "radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 35%)",
  },

  zIndex: {
    base: 0,
    background: 0,
    overlay: 1,
    content: 10,
  },
};

export const LogoSection = ({
  size = "medium",
}: {
  size?: "small" | "medium" | "large";
}) => {
  const dimensions = {
    small: {
      logoBox: { width: 40, height: 40, radius: 10, fontSize: 24 },
      textSize: 32,
    },
    medium: {
      logoBox: { width: 54, height: 54, radius: 12, fontSize: 32 },
      textSize: 42,
    },
    large: {
      logoBox: { width: 64, height: 64, radius: 14, fontSize: 40 },
      textSize: 54,
    },
  }[size];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${dimensions.logoBox.width}px`,
          height: `${dimensions.logoBox.height}px`,
          background: baseStyles.colors.white,
          borderRadius: `${dimensions.logoBox.radius}px`,
          boxShadow: baseStyles.shadows.md,
          marginRight: "16px",
        }}
      >
        <div
          style={{
            fontSize: dimensions.logoBox.fontSize,
            fontWeight: 900,
            background: baseStyles.colors.gradient,
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
          }}
        >
          S
        </div>
      </div>
      <div
        style={{
          fontSize: dimensions.textSize,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          background: baseStyles.colors.gradient,
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        SubStatz
      </div>
    </div>
  );
};

export const BaseContainer = ({
  children,
  width,
  isSquare = false,
}: {
  children: React.ReactNode;
  width: number;
  height?: number;
  isSquare?: boolean;
}) => {
  const borderRadius = isSquare ? width * 0.12 + "px" : baseStyles.radii.sm;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: baseStyles.colors.gradient,
        borderRadius,
        overflow: "hidden",
        position: "relative",
        fontFamily: baseStyles.fonts.base,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: baseStyles.backgrounds.texture,
          opacity: 0.15,
          zIndex: baseStyles.zIndex.background,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: baseStyles.backgrounds.glow,
          zIndex: baseStyles.zIndex.overlay,
        }}
      />

      <div
        style={{
          display: "flex",
          position: "relative",
          zIndex: baseStyles.zIndex.content,
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
