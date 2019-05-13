import React from "react";

const PixelNode = props => {
  const [R, G, B, A] = props.RGBA;
  const { id, addToRefStore, numberOfPixelsWide } = props;
  const px = 1000 / numberOfPixelsWide;
  const styles = {
    backgroundColor: `rgba(${R},${G},${B},${A})`,
    width: `${px}px`,
    height: `${px}px`
  };
  return <div id={`node-${id}`} ref={el => addToRefStore(el)} style={styles} />;
};

export default PixelNode;
