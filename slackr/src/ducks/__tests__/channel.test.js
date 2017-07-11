import {createStore} from 'redux';
import channelReducer, * as channelActions from '../channel';
import {getMessageText,getMessageStarState,getMessageId} from '../../message';

describe('channel duck', () => {

  describe('posting messages', () => {
    it('starts off with an empty list of messages', () => {
      const store = createStore(channelReducer);
      expect(store.getState()).toHaveProperty('messages',[]);
    });

    it('accumulates messages', () => {
      const stateAfterFirstMessage = channelReducer(
        undefined,
        channelActions.postMessage('my first message')
      );

      const stateAfterSecondMessage = channelReducer(
        stateAfterFirstMessage,
        channelActions.postMessage('another message')
      );

      expect(stateAfterFirstMessage).toHaveProperty('messages');
      expect(extractMessageTextFromMessages(stateAfterFirstMessage.messages)).toEqual([
        'my first message'
      ]);

      expect(stateAfterSecondMessage).toHaveProperty('messages');
      expect(extractMessageTextFromMessages(stateAfterSecondMessage.messages)).toEqual([
        'my first message',
        'another message'
      ]);
    });

    it('accumulates messages [using store]', () => {
      const store = createStore(channelReducer);

      store.dispatch(
        channelActions.postMessage('my first message')
      );

      expect(extractMessageTextFromMessages(store.getState().messages)).toEqual([
        'my first message'
      ]);

      store.dispatch(
        channelActions.postMessage('the next message')
      );

      expect(extractMessageTextFromMessages(store.getState().messages)).toEqual([
        'my first message',
        'the next message'
      ]);
    });
  });

  describe('starring messages', () => {
    it('is initially unstarred and then becomes starred', () => {
      const store = createStore(channelReducer);

      store.dispatch(
        channelActions.postMessage('a message')
      );

      const ourMessage = store.getState().messages[0];

      expect(getMessageStarState(ourMessage)).toBe('unstarred');

      store.dispatch(
        channelActions.starMessage(getMessageId(ourMessage))
      );

      const ourMessageAfterStarring = store.getState().messages[0];

      expect(getMessageStarState(ourMessageAfterStarring)).toBe('starred');
    });

  });
});

function extractMessageTextFromMessages(messages){
  return messages.map(getMessageText);
}
