import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';

import { keymapList } from '../util/keyboard';

class MapDownloadHandler extends Component {
  render() {
    return (
      <Modal
        size="mini"
        trigger={
          <button>
            <i className="icon-keyboard-solid" />
          </button>
        }
      >
        <h3 className="modal-heading">Keyboard Shortcuts</h3>
        <table className="shortcut-list">
          <tbody>
            {keymapList.map((shortcut, index) => {
              return (
                <tr className="shortcut-item" key={index}>
                  <td className="shortcut-keys">
                    {shortcut.keys.map((key, index) => {
                      return (
                        <div className="shortcut-key" key={index}>
                          {key}
                        </div>
                      );
                    })}
                  </td>
                  <td className="shortcut-description">{shortcut.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal>
    );
  }
}

export default MapDownloadHandler;
