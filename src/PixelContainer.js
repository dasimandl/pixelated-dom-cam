import React, { Component } from "react";
import PixelNode from "./PixelNode";
import "./App.css";

const INITIAL_STATE = { keys: [], keysAdded: false };

class PixelContainer extends Component {
  constructor() {
    super();
    this.state = {
      keys: [],
      removedKeys: [],
      keysAdded: false
    };
    this.refStore = {};
    this.addToRefStore = this.addToRefStore.bind(this);
    this.flipDomNode = this.flipDomNode.bind(this);
    this.addClassInOrderToAllDomNode = this.addClassInOrderToAllDomNode.bind(this);
    this.removeClassInOrderFromAllDomNode = this.removeClassInOrderFromAllDomNode.bind(this);
    this.onResetState = this.onResetState.bind(this);
  }
  onResetState() {
    this.setState({ ...INITIAL_STATE });
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  setStateAsync(state) {
    return new Promise(resolve => this.setState(state, resolve));
  }
  async getRefStoreKeys() {
    await this.setStateAsync({ ...this.state, keys: Object.keys(this.refStore) });
    return this.state.keys;
  }
  async targetNodesInOrder(className, callback) {
    try {
      const keys = await this.getRefStoreKeys();
      console.log(keys);
      this.asyncForEach(keys, async key => {
        await this.waitFor(0);
        callback(key, className);
      });
    } catch (err) {
      console.error(err);
    }
  }
  async randomlyChangeDomNodes(className, callback) {
    try {
      let { keys } = this.state;
      if (!keys.length) keys = await this.getRefStoreKeys();

      while (keys.length) {
        await this.waitFor(0);
        let randomIndex = Math.floor(Math.random() * keys.length);
        let key = keys[randomIndex];
        callback(key, className);
        keys.splice(randomIndex, 1);
      }
    } catch (err) {
      console.error(err);
    }
  }

  targetSingleDomNode(ref, className, callback) {}
  addClassInOrderToAllDomNode(className) {
    this.targetNodesInOrder(className, (key, className) =>
      this.refStore[key].classList.add(className)
    );
  }

  addClassToSingleDomNode(key, className) {
    try {
      if (key) this.refStore[key].classList.add(className);
    } catch (err) {
      console.error(err, key);
    }
  }
  removeClassFromSingleDomNode(key, className) {
    try {
      if (key) this.refStore[key].classList.remove(className);
    } catch (err) {
      console.error(err, key);
    }
  }

  removeClassInOrderFromAllDomNode(className) {
    this.targetNodesInOrder(className, (key, className) =>
      this.refStore[key].classList.remove(className)
    );
  }
  flipDomNode(className) {
    this.targetNodesInOrder(className, (key, className) => {
      this.refStore[key].classList.add(className);
      setTimeout(() => {
        this.refStore[key].classList.remove(className);
      }, 1000);
    });
  }

  waitFor(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  addToRefStore(ref) {
    if (!ref) return;
    this.refStore[ref.id] = ref;
  }

  render() {
    if (!this.props.pixels) return <div>Loading...</div>;
    const {
      pixels: { data },
      width
    } = this.props;
    const RGBAMap = [];
    for (let i = 0; i < data.length; i += 4) {
      const R = data[i];
      const G = data[i + 1];
      const B = data[i + 2];
      const A = data[i + 3];
      RGBAMap.push([R, G, B, A]);
    }
    // console.log('RGBAMAP LENGTH',RGBAMap.length);

    const styles = {
      display: "flex",
      flexWrap: "wrap",
      width: `1000px`
    };

    return (
      <div>
        <button
          onClick={_ =>
            this.randomlyChangeDomNodes("blue-background", (key, className) =>
              this.addClassToSingleDomNode(key, className)
            )
          }
        >
          Randomly add
        </button>
        <button
          onClick={_ =>
            this.randomlyChangeDomNodes("blue-background", (key, className) =>
              this.removeClassFromSingleDomNode(key, className)
            )
          }
        >
          Randomly remove
        </button>
        <button
          onClick={_ =>
            this.randomlyChangeDomNodes("flip-horizontal-top", (key, className) =>
              this.addClassToSingleDomNode(key, className)
            )
          }
        >
          Randomly Flip
        </button>
        <button onClick={_ => this.flipDomNode("flip-horizontal-top")}>FLIP DOM NODE</button>
        <button onClick={_ => this.addClassInOrderToAllDomNode("blue-background")}>
          Add Color
        </button>
        <button onClick={_ => this.removeClassInOrderFromAllDomNode("blue-background")}>
          Remove Color
        </button>
        <button onClick={this.onResetState}>RESET</button>
        <div style={styles}>
          {RGBAMap &&
            RGBAMap.map((RGBA, i) => (
              <PixelNode
                width={width}
                addToRefStore={this.addToRefStore}
                id={i}
                key={i}
                RGBA={RGBA}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default PixelContainer;

// iterate over the imageData array
// create a mapping of each pixel RGBA values
