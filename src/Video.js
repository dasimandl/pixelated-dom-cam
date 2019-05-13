import React, { Component } from "react";
import PixelContainer from "./PixelContainer";

export default class Video extends Component {
  constructor() {
    super();
    this.state = {
      stream: null,
      pixels: null
    };
    this.pixelContainerWidth = 40;
    this.pixelContainerHeight = this.pixelContainerWidth * 0.75;
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.ctx = null;
    this.handleSnap = this.handleSnap.bind(this);
    this.refresh = 100
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { width: "100px", height: "75px" } })
      .then(stream => {
        this.setState({ stream });
        this.videoTag.current.srcObject = stream;
        this.ctx = this.canvasTag.current.getContext("2d");
      })
      .catch(function(err) {
        console.error("An error occurred: " + err);
      });
    setInterval(() => {
      this.handleSnap();
    }, this.refresh);
  }

  handleSnap() {
    // console.time('snap')
    if (!this.ctx) return console.log("ctx not loaded");
    const { pixelContainerWidth, pixelContainerHeight } = this;
    this.ctx.drawImage(this.videoTag.current, 0, 0, pixelContainerWidth, pixelContainerHeight);
    // let base64Image = this.canvasTag.current.toDataURL('image/jpeg');
    const pixels = this.ctx.getImageData(0, 0, pixelContainerWidth, pixelContainerHeight);
    this.setState({ ...this.state, pixels });
    // console.log(this.pixels);
    // console.timeEnd('snap')
  }

  render() {
    const { stream, pixels } = this.state;
    if (!stream) return <div>Loading...</div>;
    return (
      <div>
        <button onClick={this.handleSnap} />
        <video
          id={this.props.id}
          ref={this.videoTag}
          width={this.props.width}
          height={this.props.height}
          autoPlay
          controls
          title={this.props.title}
        />
        <PixelContainer numberOfPixelsWide={this.pixelContainerWidth} pixels={pixels} />
        <canvas ref={this.canvasTag} width={this.props.width} height={this.props.height} />
      </div>
    );
  }
}
