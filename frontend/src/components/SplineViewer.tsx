import "@splinetool/viewer/build/spline-viewer";

const SplineViewer = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <spline-viewer url="https://prod.spline.design/V-V-iT0LxNddG2ni/scene.splinecode"></spline-viewer>
    </div>
  );
};

export default SplineViewer;
