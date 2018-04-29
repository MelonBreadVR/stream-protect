'use babel';

import StreamProtectView from './stream-protect-view';
import { CompositeDisposable } from 'atom';

export default {

  streamProtectView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.streamProtectView = new StreamProtectView(state.streamProtectViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.streamProtectView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'stream-protect:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.streamProtectView.destroy();
  },

  serialize() {
    return {
      streamProtectViewState: this.streamProtectView.serialize()
    };
  },

  toggle() {
    console.log('StreamProtect was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
