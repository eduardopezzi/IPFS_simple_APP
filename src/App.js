import React, { Component } from "react";
import "./App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("http://localhost:5001");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buffer: null,
      fileHash: "Qma1fwAeDnNVVD8VoNuc9AZDjWKpS4cGBfhoURraw5E7SZ"
    };
  }

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  onSubmit = async event => {
    event.preventDefault();

    const ver = await ipfs.version();
    console.log("IPFS Version=", ver);

    console.log("Submitting file to ipfs...");
    const result = await ipfs.add(this.state.buffer);
    var hash = "";
    for await (const result of ipfs.add(this.state.buffer)) {
      console.log(result);
      hash = result.path;
    }

    console.log("Ipfs result", hash);
    this.setState({ fileHash: hash });
  };

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <img src={`http://localhost:8080/ipfs/${this.state.fileHash}`} />
              <p>&nbsp;</p>
              <h2>Change File</h2>
              <form onSubmit={this.onSubmit}>
                <input type="file" onChange={this.captureFile} />
                <input type="submit" />
              </form>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
