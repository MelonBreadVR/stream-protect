'use babel';

import StreamProtectView from './stream-protect-view';
import { CompositeDisposable } from 'atom';

export default {
  streamProtectView: null,
  modalPanel: null,
  subscriptions: null,
  config: {
    sensitiveFiles: {
      type: 'array',
      default: [
        '.secrets',
        '.env',
        'secrets.yml',
        'secret_token.rb',
        '.ftpconfig',
        'wp-config.php',
        'wp-cache-config.php'
      ],
      items: {
        type: 'string'
      }
    }
  },

  activate(state) {
    this.streamProtectView = new StreamProtectView(state.streamProtectViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.streamProtectView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    atom.workspace.onDidOpen((event) => {
      const filePath = event.uri.toLowerCase()
      const fileItem = event.item
      const sensitiveFileNames = atom.config.get('stream-protect.sensitiveFiles')

      for (var i = 0; i < sensitiveFileNames.length; i++) {
        if (filePath.includes(sensitiveFileNames[i])) {
          atom.beep()
          const chosen = atom.confirm({
            message: 'This is a sensitive file',
            detailedMessage: 'Are you sure you want to open this right now?',
            buttons: {
              'Hell No': () => this.preventFileBeingOpen(fileItem),
              'Yes': () => {return}
            }
          })
        }
      }
    })
  },

  preventFileBeingOpen(fileItem) {
    // need to do more stuff here
    fileItem.setText('✨=~ Original Content Obscured ~=✨')
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
  }
};
